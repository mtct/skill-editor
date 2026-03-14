# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Skill Editor** is a client-only React SPA for editing `.skill` files (ZIP archives). Users load a `.skill` file, edit its contents (SKILL.md, scripts, references, assets), and export the modified archive. There is no backend — all processing is browser-side.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Production build → dist/
npm run preview  # Preview production build
```

No test runner is configured.

## Coding Rules

- **No TypeScript.** All source files must be `.jsx` or `.js`.
- **No backend calls.** All processing happens in the browser.
- **No persistence.** State lives only in memory for the current session (except theme preference in localStorage).
- UI copy is in **Italian** — all user-facing strings live in `src/constants/messages.js`.
- Scripts from `.skill` files are **displayed and edited only — never executed**.

## Architecture

### Two-screen flow

1. **UploadScreen** — drag & drop or file picker to load a `.skill` file.
2. **SkillEditor** — main editing interface composed of:
   - `Header` — filename, SALVA/CHIUDI buttons, theme toggle, sidebar toggle.
   - `Sidebar` — tree view (`react-arborist`) with delete buttons; SKILL.md is protected.
   - `EditorPanel` — CodeMirror 6 with per-extension syntax highlighting; images and PDFs render as previews instead of editor.
   - `ValidationToast` — shown on pre-export validation failure.

### State management

All application state lives in `useSkillState` (`src/hooks/useSkillState.js`), a `useReducer`-based hook. Key shape:

```js
{
  appState: 'upload' | 'editing',
  fileName: string | null,
  files: { [path]: { content: string | base64, isBinary: boolean } },
  selectedFile: string | null,
  isModified: boolean,
  validationErrors: string[],
}
```

Actions: `LOAD_SKILL`, `LOAD_ERROR`, `SELECT_FILE`, `UPDATE_FILE`, `ADD_FILE`, `DELETE_FILE`, `SET_VALIDATION_ERRORS`, `CLEAR_ERRORS`, `SET_SAVING`, `RESET`.

### Data flow

Load `.skill` → `zipHandler.js` extracts ZIP → state populated via `LOAD_SKILL` → tree rendered → user edits update state via `UPDATE_FILE` → save triggers SKILL.md validation → ZIP regenerated and downloaded.

## `.skill` File Format

A `.skill` file is a ZIP archive:

```
SKILL.md          ← required; YAML frontmatter + Markdown body
scripts/          ← optional
references/       ← optional
assets/           ← optional
```

**SKILL.md frontmatter** parsed with regex `/^---\n([\s\S]*?)\n---\n([\s\S]*)$/` and validated with `js-yaml` (safe parse). Must contain non-empty `name` and `description` fields.

## File Management Rules

- **Add:** only to `scripts/`, `references/`, or `assets/`.
- **Delete:** any file except `SKILL.md`.
- Binary files (images, PDFs) stored as base64 in memory.

## Key Utilities

| File | Responsibility |
|---|---|
| `src/utils/zipHandler.js` | Load (`JSZip.loadAsync`) and export (`generateAsync`) ZIP; auto-strips common root folder |
| `src/utils/yamlParser.js` | Parse and validate SKILL.md frontmatter |
| `src/utils/fileUtils.js` | Extension detection, binary file detection, CodeMirror language mapping |

## CodeMirror 6 Language Map

| Extension | Language |
|---|---|
| `.md` / `.markdown` | Markdown |
| `.yaml` / `.yml` | YAML |
| `.py` | Python |
| `.js` / `.sh` / `.json` | JavaScript |

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages on every push to `main`. The Vite base path is `/skill-editor/`. Manual chunks split React, CodeMirror, and vendor bundles for performance.
