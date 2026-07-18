# sousakak.github.io

Personal website of **emptyCan**, built with **Astro**, **Vue 3**, **TypeScript**, and **Three.js**.

The project focuses on creating a modern interactive experience while keeping the site statically generated and lightweight. UI components are written in Vue, while the animated background is rendered with Three.js using a modular architecture designed for future shader-based effects.

---

# Features

* Static site generation with Astro
* Interactive UI components using Vue 3
* TypeScript-first architecture
* SCSS with centralized variables
* Three.js animated background
* Custom animated cursor
* Responsive layout
* Automatic deployment to GitHub Pages

---

# Tech Stack

| Category     | Technology     |
| ------------ | -------------- |
| Framework    | Astro          |
| UI           | Vue 3          |
| Language     | TypeScript     |
| Styling      | SCSS           |
| 3D Rendering | Three.js       |
| Hosting      | GitHub Pages   |
| CI/CD        | GitHub Actions |

---

# Project Structure

```text
.
├── dist/             # Distributed pages
│
├── public/           # Static assets
│   └── data/
│       └── coastline.json
│
├── src/
│   ├── components/
│   │   ├── AppBackgroundCanvas.vue
│   │   ├── AppContentPanel.vue
│   │   ├── AppCursor.vue
│   │   ├── AppLoadingScreen.vue
│   │   ├── AppMenu.vue
│   │   ├── AppScrollableSections.vue
│   │   ├── AppSectionIndicator.vue
│   │   └── AppTitlePanel.vue
│   │
│   ├── i18n/
│   │   ├── locales/
│   │   │   ├── en-perm.ftl
│   │   │   ├── en.ftl
│   │   │   └── ja.ftl
│   │   │
│   │   └── index.ts
│   │
│   ├── layouts/
│   │   └── Layout.astro
│   │
│   ├── lib/
│   │   ├── three/
│   │   │   ├── Camera.ts
│   │   │   ├── Interaction.ts
│   │   │   ├── ReadyState.ts
│   │   │   ├── Renderer.ts
│   │   │   ├── Scene.ts
│   │   │   ├── Time.ts
│   │   │   └── Globe/
│   │   │       ├── Globe.ts
│   │   │       ├── CoastlineGeometry.ts
│   │   │       ├── CoastlineMaterial.ts
│   │   │       ├── coastline.frag
│   │   │       └── coastline.vert
│   │   │
│   │   ├── transition/
│   │   │   ├── ErosionRenderer.ts
│   │   │   ├── erosion.frag
│   │   │   └── erosion.vert
│   │   │
│   │   └── utils/
│   │   │   ├── convertCoords.ts
│   │       └── tween.ts
│   │
│   ├── pages/
│   │   ├── 404.astro
│   │   ├── about.astro
│   │   └── index.astro
│   │
│   └── styles/
│       ├── about.scss
│       ├── global.scss
│       ├── index.scss
│       ├── reset.css
│       └── variables.scss
│
├── astro.config.mjs  # Astro configuration
├── package.json
├── tsconfig.json
├── LICENSE
└── README.md
```

---

# Development

Install dependencies.

```bash
npm install
```

Start the development server.

```bash
npm run dev
```

The site will be available at:

```text
http://localhost:4321
```

---

# Build

Generate the production build.

```bash
npm run build
```

The generated files will be placed in:

```text
dist/
```

---

# Architecture

The project separates rendering responsibilities into independent modules.

```text
Three.js
 ├── Camera
 ├── Renderer
 ├── Scene
 ├── Time
 └── Globe
      ├── CoastlineGeometry
      └── CoastlineMaterial
```

This design keeps rendering components loosely coupled and simplifies future extensions.

---

# Globe Rendering

The globe is generated from coastline GeoJSON data located in:

```text
public/data/coastline.json
```

The rendering pipeline is:

```text
GeoJSON
    ↓
CoastlineGeometry
    ↓
THREE.LineSegments
    ↓
Scene
```

Using `THREE.LineSegments` avoids unintended connections between independent coastline features and provides a better foundation for future GPU-based particle effects.

---

# Future Plans

* GLSL shader-based particle effects
* Mouse interaction with coastline fragmentation
* Interactive page transitions
* Post-processing effects
* Additional portfolio pages
* Responsive improvements

---

# Deployment

The website is automatically deployed to GitHub Pages using GitHub Actions whenever changes are pushed to the main branch.

---

# License

Released under the MIT License.
