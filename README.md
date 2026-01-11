# Claude Skill Editor

Un editor web moderno per file `.skill` di Claude, con interfaccia Material Design e deploy automatico su GitHub Pages.

[**🚀 Demo Live**](https://mtct.github.io/skill-editor/)

## Caratteristiche

- **Editor avanzato** con syntax highlighting per Markdown, YAML, Python e JavaScript (CodeMirror 6)
- **Gestione file** con struttura ad albero interattiva
- **Supporto file binari** (immagini, font, etc.)
- **Validazione integrata** per SKILL.md e frontmatter YAML
- **Design System Material** con elevazioni, spaziature sistematiche e palette coerente
- **Client-only** - nessun backend, tutto funziona nel browser
- **Drag & drop** per caricare file `.skill`

## Tecnologie

- **React 19** - UI framework
- **Vite 7** - Build tool e dev server
- **Tailwind CSS v4** - Styling con design tokens personalizzati
- **CodeMirror 6** - Editor di codice con syntax highlighting
- **JSZip** - Manipolazione archivi ZIP lato client
- **react-arborist** - Tree view per navigazione file

## Sviluppo

### Prerequisiti

- Node.js 20+
- npm

### Installazione

```bash
git clone https://github.com/mtct/skill-editor.git
cd skill-editor
npm install
```

### Comandi

```bash
# Avvia il dev server (http://localhost:5173)
npm run dev

# Build per produzione
npm run build

# Preview della build di produzione
npm run preview
```

## Struttura File .skill

Un file `.skill` è un archivo ZIP con la seguente struttura:

```text
skill-name.skill
├── SKILL.md              # Required: contiene YAML frontmatter + descrizione Markdown
├── scripts/              # Optional: script Python, JavaScript, Bash, etc.
├── references/           # Optional: documentazione di riferimento
└── assets/               # Optional: file binari (immagini, font, etc.)
```

### SKILL.md

Il file SKILL.md deve contenere frontmatter YAML valido:

```markdown
---
name: skill-name
description: Descrizione della skill
---

# Contenuto Markdown

Descrizione dettagliata della skill...
```

## Design System

L'applicazione utilizza un design system Material ispirato a Material Design 3:

### Palette Colori

- **Surface**: 6 tonalità di grigio (#FFFFFF → #212121)
- **Primary**: Blu (#2196F3) per interazioni
- **Success**: Verde (#43A047) per azioni positive
- **Danger**: Rosso (#E53935) per errori/azioni distruttive

### Elevazioni

- **elevation-1**: Header, Sidebar
- **elevation-2**: Bottoni, Card
- **elevation-3**: Hover states
- **elevation-4**: Modali
- **elevation-8**: Toast notifiche

### Spaziature

Sistema a griglia 8px (p-2/gap-2, p-4/gap-4, p-6/gap-6, p-8/gap-8)

## Deploy

Il progetto utilizza GitHub Actions per il deploy automatico su GitHub Pages.

### Workflow

Ad ogni push su `main`:

1. GitHub Actions esegue `npm ci` e `npm run build`
2. La cartella `dist/` viene deployata su GitHub Pages
3. L'app è disponibile su <https://mtct.github.io/skill-editor/>

Il workflow è configurato in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## Licenza

ISC

## Contributi

Pull request e issue sono benvenute!
