---
applyTo: "**"
---

# Skill Editor — GitHub Copilot Instructions

## Project

**Claude Skill Editor** is a **client-only React SPA** for editing `.skill` files (ZIP archives). Users load a `.skill` file, edit its structure (SKILL.md, scripts, references, assets), and export the modified archive. There is no backend.

## Tech Stack

| Tool | Purpose |
|---|---|
| React (JavaScript) | UI framework — **no TypeScript** |
| Vite | Dev server & bundler |
| JSZip | Client-side ZIP read/write |
| CodeMirror 6 | Code editor with syntax highlighting |
| Tailwind CSS | Styling |
| js-yaml | YAML parsing and validation |

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run preview  # Preview production build
```

## Coding Rules

- **Never use TypeScript.** All source files must be `.jsx` or `.js`.
- **No backend calls.** All processing happens in the browser.
- **No persistence.** State lives only in memory for the current session.
- UI copy is in **Italian** (e.g., "SALVA", "TRASCINA QUI IL FILE").
- Scripts loaded from `.skill` files are **displayed/edited only — never executed**.
- Add a `beforeunload` listener to warn users of unsaved changes.

## Architecture

### Two-screen flow

1. **UploadScreen** — drag & drop or file input to load a `.skill` file.
2. **SkillEditor** — main editing interface:
   - `Header` — filename + "SALVA" button.
   - `Sidebar` — tree view with 🗑️ delete icons (SKILL.md is protected).
   - `EditorPanel` — CodeMirror 6 with per-file-type syntax highlighting.

### Key source files

```
src/
  App.jsx
  components/
    AddFileDialog.jsx
    EditorPanel.jsx
    Header.jsx
    Sidebar.jsx
    SkillEditor.jsx
    UploadScreen.jsx
    ValidationToast.jsx
  constants/messages.js
  hooks/useSkillState.js
  utils/
    fileUtils.js
    yamlParser.js
    zipHandler.js
```

### Application state (`useSkillState`)

| State | Type | Description |
|---|---|---|
| `appState` | `'upload' \| 'editing'` | Current screen |
| `skillStructure` | object | In-memory ZIP contents |
| `selectedFile` | string | Active file path in editor |
| `validationErrors` | array | Pre-export validation errors |
| `isModified` | boolean | Unsaved changes flag |

## `.skill` File Format

A `.skill` file is a ZIP archive:

```
SKILL.md            ← required; YAML frontmatter + Markdown body
scripts/            ← optional; Python, JS, shell scripts
references/         ← optional; reference documentation
assets/             ← optional; binary assets (images, fonts…)
```

### SKILL.md frontmatter

```markdown
---
name: skill-name
description: Skill description
---

Markdown content here...
```

Parse with regex: `/^---\n([\s\S]*?)\n---\n([\s\S]*)$/`  
Validate with `js-yaml` (safe parse only).

## ZIP Operations

| Operation | API |
|---|---|
| Load | `JSZip.loadAsync(file)` |
| Export | `jszip.generateAsync({ type: 'blob' })` |

## CodeMirror 6 Syntax Highlighting

Detect language from file extension and apply the correct language package:

| Extension | Package |
|---|---|
| `.md` | `@codemirror/lang-markdown` |
| `.yaml` / `.yml` | `@codemirror/lang-yaml` |
| `.py` | `@codemirror/lang-python` |
| `.js` / `.sh` | `@codemirror/lang-javascript` |

## Validation (pre-export)

1. `SKILL.md` must exist and cannot be deleted.
2. `SKILL.md` frontmatter must parse as valid YAML with `name` and `description` fields.
3. Directory structure must follow the allowed layout above.

## File Management Rules

- **Add**: only to `scripts/`, `references/`, or `assets/`.
- **Delete**: any file except `SKILL.md`.
- **SKILL.md**: always protected; no delete allowed.

## Performance Notes

- Use lazy loading for file content in large ZIP archives.
- Avoid reading all file contents eagerly on load.
