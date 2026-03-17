# CLAUDE.md

## Project overview

DIWA Variable Dictionary — a single-page React app that lets researchers browse and search variable definitions used across DIWA research strategies. Deployed to GitHub Pages at `https://tom-baz.github.io/variable-dictionary`.

## Tech stack

- **React 19** (JSX, no TypeScript)
- **Vite 7** for dev server and builds
- **ESLint 9** with React hooks and React Refresh plugins
- **gh-pages** for deployment

## Commands

- `npm run dev` — start local dev server
- `npm run build` — production build to `dist/`
- `npm run lint` — run ESLint
- `npm run preview` — preview production build locally
- `npm run deploy` — build and deploy to GitHub Pages

## Project structure

- `src/App.jsx` — entire UI in a single component file (constants, sub-components, main App)
- `src/data/variables.json` — all variable definitions organized by research strategy
- `src/main.jsx` — React entry point
- `vite.config.js` — Vite config with `base: '/variable-dictionary/'` for GitHub Pages

## Key conventions

- All UI lives in `src/App.jsx` as a single-file architecture — no separate component files
- Variable data is purely in `variables.json`; adding/editing variables means editing that JSON file
- Inline styles are used throughout (no CSS framework or separate stylesheets beyond `index.html` resets)
- Variable types have associated color schemes defined in `TYPE_COLORS` constant
- ESLint rule: unused vars starting with uppercase or `_` are allowed

## Data format

Each variable in `variables.json` has: `name`, `definition`, `type` (wage/capital/benefits/demographics), `source`, `notebook`, `logic`, `inputs` (dependency array), `code` (Python snippet), and optional `tag`.
