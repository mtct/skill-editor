# Claude Skill Editor

A modern web editor for Claude `.skill` files, featuring Material Design interface and automatic deployment to GitHub Pages.

[**🚀 Live Demo**](https://mtct.github.io/skill-editor/)

## Features

- **Advanced editor** with syntax highlighting for Markdown, YAML, Python, and JavaScript (CodeMirror 6)
- **File management** with interactive tree structure
- **Binary file support** (images, fonts, etc.)
- **Integrated validation** for SKILL.md and YAML frontmatter
- **Material Design System** with elevations, systematic spacing, and coherent palette
- **Client-only** - no backend, everything runs in the browser
- **Drag & drop** to upload `.skill` files

## Technologies

- **React 19** - UI framework
- **Vite 7** - Build tool and dev server
- **Tailwind CSS v4** - Styling with custom design tokens
- **CodeMirror 6** - Code editor with syntax highlighting
- **JSZip** - Client-side ZIP archive manipulation
- **react-arborist** - Tree view for file navigation

## Development

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
git clone https://github.com/mtct/skill-editor.git
cd skill-editor
npm install
```

### Commands

```bash
# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## .skill File Structure

A `.skill` file is a ZIP archive with the following structure:

```text
skill-name.skill
├── SKILL.md              # Required: contains YAML frontmatter + Markdown description
├── scripts/              # Optional: Python, JavaScript, Bash scripts, etc.
├── references/           # Optional: reference documentation
└── assets/               # Optional: binary files (images, fonts, etc.)
```

### SKILL.md

The SKILL.md file must contain valid YAML frontmatter:

```markdown
---
name: skill-name
description: Skill description
---

# Markdown Content

Detailed skill description...
```

## Design System

The application uses a Material design system inspired by Material Design 3:

### Color Palette

- **Surface**: 6 shades of gray (#FFFFFF → #212121)
- **Primary**: Blue (#2196F3) for interactions
- **Success**: Green (#43A047) for positive actions
- **Danger**: Red (#E53935) for errors/destructive actions

### Elevations

- **elevation-1**: Header, Sidebar
- **elevation-2**: Buttons, Cards
- **elevation-3**: Hover states
- **elevation-4**: Modals
- **elevation-8**: Toast notifications

### Spacing

8px grid system (p-2/gap-2, p-4/gap-4, p-6/gap-6, p-8/gap-8)

## Deployment

The project uses GitHub Actions for automatic deployment to GitHub Pages.

### Workflow

On every push to `main`:

1. GitHub Actions runs `npm ci` and `npm run build`
2. The `dist/` folder is deployed to GitHub Pages
3. The app is available at <https://mtct.github.io/skill-editor/>

The workflow is configured in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## License

ISC

## Contributing

Pull requests and issues are welcome!
