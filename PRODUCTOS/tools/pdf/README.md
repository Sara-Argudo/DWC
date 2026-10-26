# Generador de PDF de las guías

Convierte una guía en Markdown (`docs/*.md`) en un PDF maquetado para
repartir a los alumnos: portada, introducción con las etiquetas de git,
índice, un separador por etiqueta y el código coloreado.

## Uso

```bash
# La guía de este proyecto: docs/Guia_Ejercicio_02.md -> docs/Guia_Ejercicio_02.pdf
npm run pdf

# Otra guía (el PDF se guarda junto a ella, con el mismo nombre)
npm run pdf -- docs/Otra_Guia.md

# Indicando también el PDF de salida
npm run pdf -- docs/Otra_Guia.md salida/Otra_Guia.pdf
```

Requisitos:

- `npm install` hecho (usa `marked` y `highlight.js`, que están en las
  `devDependencies`).
- **Chrome o Edge** instalado: se usa en modo *headless* para imprimir el
  PDF. Si no está en la ruta habitual, se indica con la variable
  `CHROME_PATH`.
- **Conexión a internet** para descargar las fuentes Inter y JetBrains Mono
  de Google Fonts. Sin conexión, el PDF se genera con las fuentes del
  sistema.

## Ficheros

| Fichero            | Qué hace                                                       |
| ------------------ | -------------------------------------------------------------- |
| `generate-pdf.mjs` | Markdown → HTML → PDF (con Chrome/Edge headless)               |
| `style.css`        | Todo el diseño: portada, banners, tipografía, código, tablas... |

## Configuración de la portada: `<guia>.pdf.json`

Junto a cada guía puede haber un JSON con el mismo nombre y la extensión
`.pdf.json` (por ejemplo `docs/Guia_Ejercicio_02.pdf.json`). Todos los campos
son opcionales:

```json
{
  "badge": "Angular 21 · Ejercicio 02",
  "title": "Signals y directivas<br>en Angular",
  "subtitle": "Guía paso a paso: un CRUD de productos con <b>signal</b>...",
  "chips": ["signal()", "computed()", "effect()"],
  "footer": "Signals y directivas en Angular · Ejercicio 02",
  "date": "Octubre 2026"
}
```

| Campo      | Dónde aparece                                  | Si no se indica                    |
| ---------- | ---------------------------------------------- | ---------------------------------- |
| `badge`    | etiqueta redondeada arriba de la portada       | no aparece                         |
| `title`    | título grande de la portada (admite `<br>`)    | el `#` de la primera línea de la guía |
| `subtitle` | texto bajo el título (admite `<b>`)            | no aparece                         |
| `chips`    | píldoras con los conceptos                     | no aparecen                        |
| `footer`   | pie de página, a la izquierda                  | el `#` de la primera línea         |
| `date`     | abajo a la derecha de la portada               | el mes y año actuales              |

## Formato que debe seguir la guía en Markdown

El generador se basa en la estructura de `docs/Guia_Ejercicio_02.md`:

- **Primera línea**: `# Título de la guía`.
- **Introducción**: todo lo que hay entre el título y la sección `## 1.`.
  Dentro, la lista de etiquetas con este formato exacto (una por etiqueta,
  puede ocupar varias líneas):

  ```markdown
  - `03_alta_producto` (pasos 9 a 13): descripción de la etiqueta...
  - `04_borrado_producto` (pasos 14 y 15): descripción...
  - `07_computed` (paso 20): descripción...
  ```

  Con ella se generan las tarjetas de "Las etiquetas del proyecto", el
  índice agrupado y el banner que abre cada etiqueta (en página nueva, justo
  antes de su primer paso).
- **Pasos**: secciones `## N. Título`, numeradas desde 1. El número aparece en
  un recuadro de color y la sección entra en el índice.
- **Bloques de código**: con lenguaje (` ```ts `, ` ```html `, ` ```css `,
  ` ```bash `...) se colorean; **sin lenguaje** se tratan como diagramas
  (letra monoespaciada sin colorear, y si una línea es muy larga se reduce la
  letra para que quepa).
- Los bloques de hasta 28 líneas y las tablas no se parten entre páginas.

Si la guía no tiene lista de etiquetas, el PDF se genera igual, sin tarjetas
ni banners y con un índice sin agrupar.
