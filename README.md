# Skill Editor

A browser-only editor for `.skill` files — ZIP packages used as AI agent skill bundles.

[**Live →**](https://mtct.github.io/skill-editor/)

## Features

- Load, edit, and export `.skill` files entirely in the browser (no backend)
- Syntax highlighting for Markdown, YAML, Python, JavaScript (CodeMirror 6)
- Interactive file tree with add/delete support
- Image and PDF previews
- `SKILL.md` and YAML frontmatter validation before export
- Light/dark theme

## Development

```bash
npm install
npm run dev      # http://localhost:5173/skill-editor/
npm run build
```

## `.skill` file structure

```
SKILL.md          # required — YAML frontmatter + Markdown body
scripts/          # optional
references/       # optional
assets/           # optional
```

`SKILL.md` must include `name` and `description` in the frontmatter.

## Stack

React 19 · Vite 7 · Tailwind CSS v4 · CodeMirror 6 · JSZip

## Deploy

GitHub Actions builds and deploys to GitHub Pages on every push to `main`.

## License

ISC
