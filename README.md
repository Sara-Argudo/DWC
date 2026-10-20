# Desarrollo Web en Entorno Cliente (DWEC)

Repositorio de la asignatura **Desarrollo Web en Entorno Cliente** de **2º DAW** (Desarrollo de Aplicaciones Web).

Aquí se guardan las prácticas, ejercicios y proyectos realizados durante el curso. La mayoría de ellos están desarrollados con **Angular**.

- **Alumno/a:** Sara Argudo Medina
- **Curso:** 2026/2027

---

## Contenidos de la asignatura

- Fundamentos de JavaScript y TypeScript
- Manipulación del DOM y eventos
- Introducción a Angular y su arquitectura
- Componentes y plantillas
- Data binding y directivas
- Servicios e inyección de dependencias
- Routing y navegación entre vistas
- Formularios (template-driven y reactivos)
- Consumo de APIs REST con HttpClient
- Programación asíncrona (Promesas, async/await y RxJS)

## Tecnologías utilizadas

- Angular
- TypeScript
- HTML5 y CSS3
- Node.js y npm
- Git y GitHub

## Requisitos previos

- [Node.js](https://nodejs.org/) (versión LTS)
- npm (se instala junto con Node.js)
- Angular CLI:

```bash
npm install -g @angular/cli
```

Para comprobar que todo está instalado:

```bash
node -v
npm -v
ng version
```

## Cómo ejecutar un proyecto

1. Clonar el repositorio:

```bash
git clone https://github.com/Sara-Argudo/DWC.git
cd DWC
```

2. Entrar en la carpeta del proyecto:

```bash
cd ejemplo_02
```

3. Instalar las dependencias:

```bash
npm install
```

4. Arrancar el servidor de desarrollo:

```bash
ng serve
```

5. Abrir el navegador en [http://localhost:4200](http://localhost:4200).

## Comandos útiles de Angular CLI

| Comando | Descripción |
|---------|-------------|
| `ng new nombre-proyecto` | Crea un nuevo proyecto |
| `ng serve` | Levanta el servidor de desarrollo |
| `ng serve --open` | Levanta el servidor y abre el navegador |
| `ng generate component nombre` | Genera un componente |
| `ng generate service nombre` | Genera un servicio |
| `ng generate module nombre` | Genera un módulo |
| `ng generate guard nombre` | Genera un guard |
| `ng generate pipe nombre` | Genera un pipe |
| `ng build` | Compila el proyecto para producción |
| `ng test` | Ejecuta los tests unitarios |

## Comandos de Git más usados

```bash
git status                      # Ver el estado de los cambios
git add .                       # Añadir todos los cambios
git commit -m "mensaje"         # Guardar los cambios
git push origin main            # Subir los cambios al repositorio
git pull origin main            # Descargar los últimos cambios
```

Convención sugerida para los mensajes de commit:

- `feat:` nueva funcionalidad
- `fix:` corrección de errores
- `docs:` cambios en la documentación
- `style:` cambios de formato o estilos
- `refactor:` reestructuración del código

## Recursos de interés

- [Documentación oficial de Angular](https://angular.dev/)
- [Documentación de TypeScript](https://www.typescriptlang.org/docs/)
- [MDN Web Docs](https://developer.mozilla.org/es/)
- [Documentación de RxJS](https://rxjs.dev/)

## Licencia

Repositorio con fines educativos.
