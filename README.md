# Sergio Solbes Ferri - Perfil Académico

Este es el repositorio del sitio web del perfil académico de **Sergio Solbes Ferri**, Catedrático de Historia Económica en la Universidad de Las Palmas de Gran Canaria (ULPGC).

El sitio web sirve como un portfolio interactivo y profesional para presentar su trayectoria docente e investigadora, sus proyectos, publicaciones y méritos académicos.

## Características

- **Diseño Responsivo:** Optimizado para dispositivos móviles y pantallas grandes. Se ha ajustado el punto de quiebre (breakpoint) para pantallas pequeñas a `980px` según las preferencias del usuario.
- **Modo Claro/Oscuro:** Soporte integrado para cambiar entre tema claro y oscuro de forma sencilla.
- **Secciones Detalladas:**
  - *Inicio (Hero):* Resumen del perfil, enlaces a plataformas académicas (ResearchGate, ORCID, Google Scholar, Dialnet, etc.).
  - *Sobre Mí:* Formación académica y experiencia general.
  - *Docencia:* Experiencia docente, asignaturas impartidas, dirección de tesis y TFG/TFM.
  - *Investigación:* Líneas de investigación principales.
  - *Proyectos:* Proyectos de investigación financiados en los que participa o ha participado.
  - *Publicaciones:* Libros, artículos en revistas y capítulos de libro.
  - *Contacto:* Información de contacto institucional.

## Tecnologías Utilizadas

Este proyecto ha sido desarrollado utilizando tecnologías modernas y eficientes para el desarrollo web:

- **Framework:** [Next.js](https://nextjs.org) (App Router).
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) para tipado estático y mayor seguridad en el código.
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) para el diseño y maquetación de la interfaz.
- **Componentes de UI:** [shadcn/ui](https://ui.shadcn.com/) (basado en Radix UI) para componentes accesibles y personalizables.
- **Iconos:** [Lucide React](https://lucide.dev/).
- **Animaciones:** [Framer Motion](https://www.framer.com/motion/) para transiciones y animaciones fluidas.
- **Internacionalización:** Soporte i18n implementado nativamente.

## Instalación Local

Si deseas correr este proyecto en tu entorno local para desarrollo o pruebas, sigue estos pasos:

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_REPOSITORIO>
   ```

2. **Instalar dependencias:**
   Puedes usar `npm`, `yarn`, `pnpm` o `bun`.
   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   # o
   yarn dev
   # o
   pnpm dev
   ```

4. **Visualizar la aplicación:**
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado. Las ediciones que realices en `app/page.tsx` o en los componentes se actualizarán automáticamente.

## Estructura de Datos

El contenido del perfil (experiencia, publicaciones, proyectos) está centralizado y se gestiona mediante archivos JSON y TypeScript en el directorio `lib/data/`:
- `lib/data.ts`: Archivo principal que exporta la información y la asocia a sus respectivos tipos de datos TypeScript.
- `lib/data/academic.json`: Contiene la información de docencia, formación académica, méritos y dirección de trabajos.
- `lib/data/projects.json`: Contiene la lista de proyectos de investigación.

## Contacto Institucional

Para consultas relacionadas con la actividad académica de Sergio Solbes Ferri, puede utilizar el correo institucional:
- **Email:** sergio.solbes@ulpgc.es

---
*Sitio web desarrollado para reflejar el compromiso académico e investigador dentro de la disciplina de la Historia Económica.*
