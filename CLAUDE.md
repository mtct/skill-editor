# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Claude Skill Editor** is a client-only React SPA for editing `.skill` files (ZIP archives containing Claude skills). Users can load a `.skill` file, view/edit its structure (SKILL.md, scripts, references, assets), and save the modified archive.

**Tech Stack**:
- React (JavaScript, NOT TypeScript)
- JSZip for client-side ZIP manipulation
- CodeMirror 6 for code editing with syntax highlighting
- Tailwind CSS for styling

**Key Constraints**:
- Client-only application (no backend)
- All file processing happens in-browser
- No persistence beyond current session

## Development Commands

```bash
npm run dev      # Start development server (Vite)
npm run build    # Build for production
npm run preview  # Preview production build
```

## Architecture

### Component Structure

The application follows a two-screen flow:

1. **UploadScreen**: Initial state for loading `.skill` files via drag & drop or file input
2. **SkillEditor**: Main editing interface with:
   - **Header**: Displays current filename and "SALVA" (save) button
   - **Sidebar**: Tree view showing file structure with delete icons (🗑️) for removable files
   - **EditorPanel**: CodeMirror 6 instance with dynamic syntax highlighting based on file type

### State Management

Core application state (managed via React hooks/Context):
- `appState`: Current screen ('upload' | 'editing')
- `skillStructure`: In-memory representation of loaded `.skill` archive
- `selectedFile`: Currently open file in editor
- `validationErrors`: Active validation errors
- `isModified`: Tracks unsaved changes

### .skill File Structure

A `.skill` file is a ZIP archive with:
- **SKILL.md** (required): Contains YAML frontmatter (name, description) + Markdown body
- **scripts/**: Optional directory for script files (Python, JavaScript, etc.)
- **references/**: Optional directory for reference documentation
- **assets/**: Optional directory for binary assets (images, fonts, etc.)

### CodeMirror 6 Integration

Syntax highlighting is configured dynamically per file type:
- `.md` files: Markdown highlighting
- YAML frontmatter in SKILL.md: YAML highlighting
- `.py` files: Python highlighting
- `.js`/`.sh` files: JavaScript highlighting

Use language packages: `@codemirror/lang-markdown`, `@codemirror/lang-yaml`, `@codemirror/lang-python`, `@codemirror/lang-javascript`

### Validation Rules

Before export, validate:
1. SKILL.md must exist (cannot be deleted)
2. SKILL.md must have valid YAML frontmatter with `name` and `description` fields
3. Directory structure must be valid

Use `js-yaml` library for safe YAML parsing and validation.

### File Operations

- **Load**: JSZip.loadAsync() to parse uploaded .skill file
- **Add files**: Users can add files to scripts/, references/, or assets/ directories
- **Delete files**: All files except SKILL.md can be deleted via trash icon in tree view
- **Export**: JSZip.generateAsync() to create downloadable .skill file

### YAML Frontmatter Parsing

SKILL.md frontmatter format:
```markdown
---
name: skill-name
description: Skill description
---

Markdown content here...
```

Parse using regex: `/^---\n([\s\S]*?)\n---\n([\s\S]*)$/`

## Implementation Phases

Per the specification, development is planned in phases:

**Phase 1 - MVP**:
- Load .skill files
- Read-only tree view
- Edit SKILL.md with basic syntax highlighting
- Export modified skill

**Phase 2 - Full Editor**:
- Add/remove supplementary files
- Syntax highlighting for all file types
- YAML frontmatter validation

**Phase 3 - UX Improvements**:
- Drag & drop upload
- Complete pre-export validation
- Advanced error handling

## Important Notes

- **Language**: The specification and some UI elements are in Italian (e.g., "SALVA" button, "TRASCINA QUI IL FILE")
- **JavaScript Only**: Do not use TypeScript for this project
- **No Code Execution**: Scripts loaded from .skill files are only displayed/edited, never executed
- **Browser Compatibility**: Test on Chrome, Firefox, Safari, Edge
- **Large Files**: Consider performance implications for large ZIP archives; implement lazy loading for file content
- **Unsaved Changes**: Implement beforeunload listener to warn users of unsaved modifications

## Specification Reference

The complete specification is in [spec/spec-claude-skill-editor.md](spec/spec-claude-skill-editor.md), which includes:
- Detailed user stories
- UI wireframes descriptions (Upload.png, edit.png)
- Complete functional requirements
- Technical constraints and security considerations
- Testing scenarios
