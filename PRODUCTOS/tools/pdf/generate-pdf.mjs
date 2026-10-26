// Genera un PDF maquetado a partir de una guía en Markdown.
//
// Uso:
//   npm run pdf                                  (genera docs/Guia_Ejercicio_02.pdf)
//   node tools/pdf/generate-pdf.mjs <guia.md> [salida.pdf]
//
// Pasos: Markdown -> HTML (marked + highlight.js + style.css) -> PDF con
// Chrome o Edge en modo headless. La portada se configura con un JSON junto
// a la guía (<guia>.pdf.json). Ver tools/pdf/README.md.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import hljs from 'highlight.js';
import { Marked } from 'marked';

const input = resolve(process.argv[2] ?? 'docs/Guia_Ejercicio_02.md');
const output = resolve(process.argv[3] ?? input.replace(/\.md$/, '.pdf'));
const here = new URL('.', import.meta.url);

// --- Configuración de la portada (opcional) --------------------------------
const configPath = input.replace(/\.md$/, '.pdf.json');
const config = existsSync(configPath) ? JSON.parse(readFileSync(configPath, 'utf8')) : {};

const md = readFileSync(input, 'utf8');
const lines = md.split(/\r?\n/);
const docTitle = lines[0].replace(/^#\s+/, '');

const month = new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
const cover = {
  badge: config.badge ?? '',
  title: config.title ?? docTitle,
  subtitle: config.subtitle ?? '',
  chips: config.chips ?? [],
  date: config.date ?? month.charAt(0).toUpperCase() + month.slice(1),
  footer: config.footer ?? docTitle
};

// --- Separar introducción y cuerpo ----------------------------------------
// El cuerpo empieza en la primera sección "## 1. ...".
const firstSection = lines.findIndex(l => /^## 1\. /.test(l));
if (firstSection === -1) {
  throw new Error('La guía debe tener una sección "## 1. ..." donde empieza el cuerpo.');
}
const introMd = lines.slice(1, firstSection).join('\n');
const bodyMd = lines.slice(firstSection).join('\n');

// Etiquetas de la introducción, con el formato:
//   - `03_alta_producto` (pasos 9 a 13): descripción...
const tags = [];
const tagRe = /^- `(\d\d_[a-z0-9_]+)` \(pasos? (\d+)(?: (?:a|y) (\d+))?\): ([\s\S]*?)(?=\n- `|\n\n|(?![\s\S]))/gm;
for (const m of introMd.matchAll(tagRe)) {
  tags.push({ tag: m[1], from: +m[2], to: +(m[3] ?? m[2]), desc: m[4].replace(/\s*\n\s*/g, ' ') });
}
const introText = introMd.replace(/^- `\d\d_[\s\S]*$/m, '').trim();
const steps = t => `pasos ${t.from}${t.to !== t.from ? `–${t.to}` : ''}`;

// --- Markdown -> HTML -----------------------------------------------------
const escapeHtml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const toc = [];
const marked = new Marked({ gfm: true });
marked.use({
  renderer: {
    code(code, lang) {
      const language = (lang || '').trim();
      // Los bloques cortos no se parten entre dos páginas.
      const keep = code.split('\n').length <= 28 ? ' keep' : '';
      if (language && hljs.getLanguage(language)) {
        const html = hljs.highlight(code, { language }).value;
        return `<pre class="code${keep}" data-lang="${language}"><code>${html}</code></pre>\n`;
      }
      // Bloques sin lenguaje = diagramas. No se parten en líneas: si alguna
      // es muy larga, se reduce la letra para que quepa en el ancho de la página.
      const longest = Math.max(...code.split('\n').map(l => [...l].length));
      const size = longest > 90 ? `font-size:${((8.4 * 90) / longest).toFixed(2)}pt` : '';
      return `<pre class="diagram${keep}" style="${size}"><code>${escapeHtml(code)}</code></pre>\n`;
    },
    heading(text, level) {
      if (level === 2) {
        const m = text.match(/^(\d+)\.\s+(.*)$/);
        const id = 's' + (m ? m[1] : toc.length + 1000);
        toc.push({ id, num: m?.[1], text: m ? m[2] : text });
        const num = m ? `<span class="num">${m[1]}</span>` : '';
        return `<h2 id="${id}">${num}<span class="t">${m ? m[2] : text}</span></h2>\n`;
      }
      return `<h${level}>${text}</h${level}>\n`;
    },
    table(header, body) {
      return `<div class="table"><table><thead>${header}</thead><tbody>${body}</tbody></table></div>\n`;
    }
  }
});

// Banner de cada etiqueta antes de su primera sección.
let bodyHtml = marked.parse(bodyMd);
for (const t of tags) {
  const banner = `
<section class="chapter" id="tag-${t.tag}">
  <div class="chapter-kicker">Etiqueta de git · ${steps(t)}</div>
  <div class="chapter-tag">${t.tag}</div>
  <p class="chapter-desc">${marked.parseInline(t.desc)}</p>
  <div class="chapter-cmd"><span>$</span> git checkout ${t.tag}</div>
</section>`;
  bodyHtml = bodyHtml.replace(`<h2 id="s${t.from}">`, `${banner}\n<h2 id="s${t.from}">`);
}

const tagCards = tags
  .map(
    t =>
      `<li><a href="#tag-${t.tag}"><code>${t.tag}</code></a><span class="steps">${steps(t)}</span><p>${marked.parseInline(t.desc)}</p></li>`
  )
  .join('\n');

// Índice: agrupado por etiqueta si las hay; si no, una sola lista.
const tocItem = s =>
  `<li><a href="#${s.id}"><span class="n">${s.num ?? ''}</span><span>${marked.parseInline(s.text)}</span></a></li>`;
const tocHtml = tags.length
  ? tags
      .map(t => {
        const items = toc.filter(s => +s.num >= t.from && +s.num <= t.to).map(tocItem).join('');
        return `<div class="toc-group"><div class="toc-tag">${t.tag}</div><ol>${items}</ol></div>`;
      })
      .join('\n')
  : `<div class="toc-group"><ol>${toc.map(tocItem).join('')}</ol></div>`;

const css = readFileSync(new URL('style.css', here), 'utf8');
const hlcss = readFileSync(new URL('../../node_modules/highlight.js/styles/github.css', here), 'utf8');
const cssString = s => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>${escapeHtml(cover.title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=block" rel="stylesheet">
<style>${hlcss}</style>
<style>${css}</style>
<style>@page { @bottom-left { content: ${cssString(cover.footer)}; } }</style>
</head>
<body>

<section class="cover">
  <div class="cover-top">
    ${cover.badge ? `<div class="cover-badge">${cover.badge}</div>` : ''}
  </div>
  <div class="cover-main">
    <div class="cover-logo" aria-hidden="true">
      <svg viewBox="0 0 120 120" width="96" height="96" fill="none" stroke="#fff" stroke-linecap="round">
        <circle cx="30" cy="90" r="9" fill="#fff" stroke="none"/>
        <path d="M30 62a28 28 0 0 1 28 28" stroke-width="9"/>
        <path d="M30 36a54 54 0 0 1 54 54" stroke-width="9" opacity=".75"/>
        <path d="M30 10a80 80 0 0 1 80 80" stroke-width="9" opacity=".5"/>
      </svg>
    </div>
    <h1 class="cover-title">${cover.title}</h1>
    ${cover.subtitle ? `<p class="cover-sub">${cover.subtitle}</p>` : ''}
    <ul class="cover-chips">${cover.chips.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul>
  </div>
  <div class="cover-bottom">
    <div>${tags.length ? `<span>${tags.length} etiquetas</span>` : ''}<span>${toc.length} pasos</span></div>
    <div>${cover.date}</div>
  </div>
</section>

<section class="front">
  <h2 class="front-title">Antes de empezar</h2>
  <div class="intro">${marked.parse(introText)}</div>
  ${
    tags.length
      ? `<h3 class="front-sub">Las etiquetas del proyecto</h3>
  <p class="hint">Cada etiqueta de git es un punto de control: con <code>git checkout &lt;etiqueta&gt;</code> el código y esta guía quedan en el estado de ese paso.</p>
  <ol class="tags">${tagCards}</ol>`
      : ''
  }
</section>

<section class="toc">
  <h2 class="front-title">Índice</h2>
  <div class="toc-cols">${tocHtml}</div>
</section>

<main>
${bodyHtml}
</main>
</body>
</html>`;

// --- HTML -> PDF con Chrome / Edge headless ---------------------------------
function findBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser'
  ];
  const found = candidates.find(p => p && existsSync(p));
  if (!found) {
    throw new Error('No se encuentra Chrome ni Edge. Indica la ruta con la variable CHROME_PATH.');
  }
  return found;
}

const work = mkdtempSync(join(tmpdir(), 'guia-pdf-'));
const htmlPath = join(work, 'guia.html');
writeFileSync(htmlPath, html);

const browser = findBrowser();
// Se borra el PDF anterior para detectar si la impresión falla.
rmSync(output, { force: true });
const result = spawnSync(
  browser,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-pdf-header-footer',
    // Tiempo para descargar las fuentes de Google Fonts antes de imprimir.
    '--virtual-time-budget=15000',
    `--user-data-dir=${join(work, 'profile')}`,
    `--print-to-pdf=${output}`,
    pathToFileURL(htmlPath).href
  ],
  { stdio: 'ignore', timeout: 180000 }
);
rmSync(work, { recursive: true, force: true });

if (result.status !== 0 || !existsSync(output)) {
  throw new Error(`No se ha podido generar el PDF (código ${result.status}).`);
}
console.log(`PDF generado: ${output}`);
console.log(`  ${tags.length} etiquetas, ${toc.length} secciones`);
