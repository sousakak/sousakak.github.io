# sousakak.github.io
This is a personal website built with **Astro** and **Vue.js**, deployed on **GitHub Pages**.

---

## Tech Stack

- [Astro](https://astro.build/) — Static site generator
- [Vue 3](https://vuejs.org/) — Interactive UI components
- GitHub Pages — Hosting

---

## Project Structure

```

.
├── src/
│   ├── pages/        # File-based routing (/, /about, etc.)
│   └── components/   # Vue & Astro components
├── dist/             # Distributed pages
├── astro.config.mjs  # Astro configuration
├── package.json
├── LICENSE
├── README.md
└── .gitignore

````

---

## Development
### Install dependencies

```bash
npm install
````

### Start local dev server

```bash
npm run dev
```

Then open:

```
http://localhost:4321
```

---

## Build

To generate static files:

```bash
npm run build
```

Output will be in:

```
dist/
```

---

## Vue in Astro

Vue components are used inside `.astro` files with hydration directives:

```astro
---
import Counter from '../components/Counter.vue';
---

<Counter client:load />
```

### Hydration modes

* `client:load` — load immediately
* `client:idle` — load when idle
* `client:visible` — load when visible

---

## Deployment (GitHub Pages)

This site is deployed using GitHub Pages.

### Important: `astro.config.mjs`

For user site (`username.github.io`):

```js
export default defineConfig({
  site: 'https://YOUR_USERNAME.github.io',
});
```

For project site:

```js
export default defineConfig({
  site: 'https://YOUR_USERNAME.github.io/REPO_NAME',
  base: '/REPO_NAME/',
});
```

---

## Build for GitHub Pages

```bash
npm run build
```

Then deploy the `dist/` folder via:

* GitHub Actions (recommended)
* or manual Pages deployment

---

## Notes

* Pages are created via file-based routing in `src/pages/`
* `/about` → `src/pages/about.astro`
* No router configuration required
* Vue is used only for interactive parts

---

## License
[MIT License](LICENSE)
