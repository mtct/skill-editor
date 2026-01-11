# Claude Skill Editor

## 1. Overview

**Objective**: Creare un'applicazione web SPA client-only che permetta agli utenti di caricare file `.skill` (archivi ZIP), visualizzare e modificare i loro componenti (SKILL.md, scripts, references, assets), e risalvare l'archivio modificato. L'editor facilita la gestione strutturata delle skill Claude senza richiedere decompressione manuale o utilizzo di strumenti esterni.

**Context**: Le skill Claude sono archivi ZIP con estensione `.skill` contenenti una directory strutturata. Gli utenti attualmente devono decomprimere manualmente, modificare i file, e ricomprimere l'archivio, rischiando errori di struttura. Questo tool fornisce un'interfaccia dedicata per semplificare il workflow di editing.

**Target Users**: Sviluppatori e utenti che creano o modificano skill personalizzate per Claude, specialmente chi lavora frequentemente con skill complesse multi-file.

## 2. Requisiti Funzionali

- Caricamento di file `.skill` (archivi ZIP) tramite input file o drag & drop
- Parsing e visualizzazione della struttura del file in una tree view navigabile
- Editing del file SKILL.md con syntax highlighting per YAML (frontmatter) e Markdown (body)
- Gestione dei file supplementari (scripts/, references/, assets/):
  - Visualizzazione dei file esistenti
  - Aggiunta di nuovi file
  - Rimozione di file tramite icona cestino (🗑️) visibile accanto a ogni file
  - Editing di file testuali con syntax highlighting appropriato
  - SKILL.md non può essere eliminato (nessuna icona cestino)
- Evidenziazione visiva del file correntemente selezionato nella tree view
- Header con nome file skill corrente e pulsante "SALVA"
- Validazione della struttura della skill:
  - Presenza obbligatoria di SKILL.md
  - Validazione del YAML frontmatter (name e description obbligatori)
  - Verifica della struttura directory
- Export della skill modificata come file `.skill` scaricabile
- Gestione errori di parsing/validazione con messaggi chiari
- Reset/chiusura della skill corrente per caricarne una nuova

## 3. Requisiti Tecnici

**Stack Tecnologico**:
- React (JavaScript, non TypeScript)
- JSZip per gestione archivi ZIP lato client
- CodeMirror 6 per editing con syntax highlighting
- Tailwind CSS per styling

**Dipendenze**:
- JSZip: manipolazione archivi ZIP in browser
- CodeMirror 6: editor di codice con syntax highlighting
  - @codemirror/lang-markdown: supporto Markdown
  - @codemirror/lang-yaml: supporto YAML
  - @codemirror/lang-python: supporto Python
  - @codemirror/lang-javascript: supporto JavaScript/Bash
- js-yaml: parsing e serializzazione YAML per validazione frontmatter
- Tailwind CSS: utility-first CSS framework
- File System Access API (opzionale): per migliorare UX download su browser supportati

**Vincoli Architetturali**:
- Client-only: nessun backend, tutto processing in browser
- Single Page Application (SPA)
- State management tramite React hooks (useState, useReducer) o Context API
- Gestione file in-memory (non persistence oltre la sessione)

**Considerazioni di Performance**:
- Gestione efficiente di file di grandi dimensioni in archivi ZIP
- Lazy loading del contenuto dei file nella tree view
- Debouncing per operazioni di validazione in tempo reale

**Sicurezza e Compliance**:
- Validazione input per prevenire parsing di file dannosi
- Sanitizzazione del contenuto quando visualizzato
- Nessuna esecuzione di codice dagli script caricati (solo visualizzazione/editing)

## 4. User Stories

**Story 1**: Caricamento Skill
- **As a** sviluppatore di skill Claude
- **I want** caricare un file `.skill` tramite drag & drop o file picker
- **So that** posso iniziare a modificare la skill senza decomprimerla manualmente

**Story 2**: Navigazione Struttura
- **As a** utente dell'editor
- **I want** visualizzare la struttura completa della skill in una tree view
- **So that** posso capire rapidamente l'organizzazione dei file e navigare tra essi

**Story 3**: Editing SKILL.md
- **As a** creatore di skill
- **I want** modificare il file SKILL.md con syntax highlighting per YAML e Markdown
- **So that** posso aggiornare metadata e istruzioni della skill in modo efficiente e senza errori di sintassi

**Story 4**: Gestione File Supplementari
- **As a** sviluppatore
- **I want** aggiungere, rimuovere e modificare file nelle directory scripts/, references/, assets/
- **So that** posso mantenere aggiornate tutte le risorse della skill

**Story 5**: Rimozione File
- **As a** utente dell'editor
- **I want** eliminare file supplementari cliccando l'icona cestino accanto al nome del file
- **So that** posso rimuovere rapidamente risorse non più necessarie senza navigare menu complessi

**Story 6**: Validazione Struttura
- **As a** utente
- **I want** ricevere feedback immediato su errori di struttura o validazione
- **So that** posso correggere problemi prima di salvare la skill

**Story 7**: Export Skill Modificata
- **As a** creatore di skill
- **I want** scaricare la skill modificata come file `.skill` valido
- **So that** posso utilizzarla immediatamente in Claude senza ulteriori passaggi manuali

## 5. Flussi d'Uso / Scenari

### Scenario 1: Caricamento e Modifica Skill Esistente

**Precondizioni**: L'utente ha un file `.skill` da modificare

**Flusso**:
1. L'utente apre l'applicazione
2. L'utente carica il file `.skill` tramite drag & drop o file input
3. L'applicazione decomprime l'archivio e mostra la tree view della struttura
4. L'utente clicca su SKILL.md nella tree view
5. Il contenuto di SKILL.md appare nell'editor con syntax highlighting
6. L'utente modifica il frontmatter YAML (es: cambia description)
7. L'applicazione valida il YAML in tempo reale
8. L'utente naviga a un file in scripts/ e lo modifica
9. L'utente clicca "Save Skill" / "Download"
10. L'applicazione ricomprime l'archivio e lo fornisce per download come `.skill`

**Postcondizioni**: L'utente ha un file `.skill` aggiornato scaricato localmente

**Casi Eccezionali**:
- **File non valido caricato**: Mostrare errore chiaro (es: "File non è un archivio ZIP valido")
- **SKILL.md mancante**: Mostrare errore "Struttura non valida: SKILL.md obbligatorio"
- **YAML frontmatter invalido**: Evidenziare errore nell'editor con messaggio specifico

### Scenario 2: Aggiunta Nuovo File Supplementare

**Precondizioni**: L'utente ha caricato una skill e vuole aggiungere un file di riferimento

**Flusso**:
1. L'utente clicca con tasto destro (o pulsante) sulla directory `references/` nella tree view
2. L'applicazione mostra opzione "Add File"
3. L'utente seleziona "Add File" e carica un file locale (es: `api-docs.md`)
4. Il file appare nella tree view sotto `references/api-docs.md`
5. L'utente può modificare il contenuto del file nell'editor
6. Al salvataggio, il file è incluso nell'archivio `.skill` esportato

**Postcondizioni**: Il file aggiunto è presente nella skill modificata

**Casi Eccezionali**:
- **File troppo grande**: Mostrare warning se >5MB
- **Nome file duplicato**: Chiedere conferma per sovrascrittura o rinomina automatica

### Scenario 3: Eliminazione File dalla Tree View

**Precondizioni**: L'utente ha caricato una skill e visualizza la tree view

**Flusso**:
1. L'utente identifica un file che vuole rimuovere (es: `reference_1.md`)
2. L'utente clicca sull'icona cestino (🗑️) accanto al nome del file
3. L'applicazione mostra conferma: "Sei sicuro di voler eliminare reference_1.md?"
4. L'utente conferma l'eliminazione
5. Il file scompare dalla tree view
6. Se il file eliminato era aperto nell'editor, l'editor mostra un messaggio o si svuota
7. Al salvataggio, il file non sarà incluso nell'archivio `.skill` esportato

**Postcondizioni**: Il file è rimosso dalla struttura della skill

**Casi Eccezionali**:
- **Tentativo eliminazione SKILL.md**: Non mostrare icona cestino per SKILL.md (file obbligatorio)
- **File aperto correntemente**: Chiudere l'editor e mostrare messaggio "File eliminato"
- **Annullamento**: Se l'utente annulla, nessuna modifica viene effettuata

### Scenario 4: Validazione Pre-Export

**Precondizioni**: L'utente ha modificato la skill e clicca "Save/Download"

**Flusso**:
1. L'utente clicca pulsante "SALVA"
2. L'applicazione esegue validazione completa:
   - Verifica presenza SKILL.md
   - Valida frontmatter YAML (name e description presenti)
   - Verifica struttura directory
3. Se validazione passa: genera ZIP e avvia download
4. Se validazione fallisce: mostra lista errori con dettagli

**Postcondizioni**: L'utente ottiene file `.skill` valido o lista errori da correggere

**Casi Eccezionali**:
- **Errori di validazione**: Non permettere export, evidenziare errori nella UI
- **Browser non supporta download**: Mostrare istruzioni alternative

## 6. Wireframe e Diagrammi

### Wireframe 1: Schermata Upload Iniziale
File: `Upload.png`

**Descrizione**: Schermata di landing dell'applicazione che mostra:
- Area centrale vuota con testo "TRASCINA QUI IL FILE .skill o CARICA"
- Supporto per drag & drop e selezione file manuale

**Elementi UI**:
- Container centrale per drop zone
- Testo istruzionale chiaro
- Design minimalista e centrato

### Wireframe 2: Interfaccia Editor
File: `edit.png`

**Descrizione**: Interfaccia principale di editing dopo caricamento skill

**Layout**:
- **Header** (top):
  - Nome file corrente: "skill-prova.skill"
  - Pulsante "SALVA" in alto a destra

- **Sidebar Sinistra** (tree view):
  - File selezionato evidenziato: "skill.md" (sfondo grigio)
  - Altri file con icona cestino (🗑️) per eliminazione:
    - reference_1.md
    - reference_2.md
  - Directory espandibile "contents/" con:
    - reference.pdf (con icona cestino)
    - reference.xlsx (con icona cestino)

- **Area Editor Principale** (destra):
  - Contenuto del file selezionato
  - Esempio mostrato: "lorem ipsum qui va il testo del file appena aperto"
  - Area di editing occupante maggior parte dello schermo

**Note UI dal Wireframe**:
- Tree view mostra gerarchia file con indentazione visiva
- File attivo ha background differenziato
- Icone cestino sempre visibili per file eliminabili (non SKILL.md)
- Layout a due colonne: sidebar fissa + editor responsive

## 7. Note Implementative

**Suggerimenti Architetturali**:
- Struttura componenti React:
  ```
  App
  ├── UploadScreen (stato iniziale: drag & drop + file input)
  └── SkillEditor (post-caricamento)
      ├── Header (nome file + pulsante SALVA)
      ├── Layout (two-column)
      │   ├── Sidebar (tree view + file actions)
      │   │   ├── TreeNode (ricorsivo per file/directory)
      │   │   └── DeleteButton (icona cestino per file eliminabili)
      │   └── EditorPanel (CodeMirror integrato)
      └── ValidationPanel (errori/warning, modale o toast)
  ```
- Layout CSS (Tailwind):
  ```
  - UploadScreen: flex items-center justify-center h-screen
  - SkillEditor: h-screen flex flex-col
    - Header: fixed top, w-full, border-b
    - Layout: flex-1 flex flex-row
      - Sidebar: w-64 border-r overflow-y-auto
      - EditorPanel: flex-1 overflow-hidden
  ```
- State management:
  - `appState`: 'upload' | 'editing' (controlla quale schermata mostrare)
  - `skillStructure`: oggetto con struttura file completa
  - `selectedFile`: file correntemente aperto nell'editor
  - `validationErrors`: lista errori correnti
  - `isModified`: flag per rilevare modifiche non salvate

**Considerazioni Tecniche**:
- **Parsing ZIP**: JSZip.loadAsync() per caricare file asincronamente
- **YAML Frontmatter**: Separare frontmatter dal body con regex `/^---\n([\s\S]*?)\n---\n([\s\S]*)$/`
- **Syntax Highlighting con CodeMirror 6**: 
  - Importare language packages specifici: `@codemirror/lang-markdown`, `@codemirror/lang-yaml`, `@codemirror/lang-python`
  - Configurare extensions dinamicamente basandosi sul tipo di file
  - Esempio setup:
    ```javascript
    import { EditorView } from '@codemirror/view'
    import { EditorState } from '@codemirror/state'
    import { markdown } from '@codemirror/lang-markdown'
    import { yaml } from '@codemirror/lang-yaml'
    
    const extensions = fileType === 'md' ? [markdown()] : [yaml()]
    const state = EditorState.create({ doc: content, extensions })
    ```
- **Tree View**: Libreria react-arborist o rc-tree per tree view performante
- **Tailwind CSS Setup**:
  - Configurare Tailwind in modo standard per React
  - Usare utility classes per layout responsive
  - Componenti UI base: buttons, panels, modals con classi Tailwind
- **File Export**:
  ```javascript
  // Esempio export con JSZip
  const zip = new JSZip();
  zip.file("SKILL.md", skillMdContent);
  zip.folder("scripts").file("script.py", scriptContent);
  const blob = await zip.generateAsync({type: "blob"});
  saveAs(blob, "skill-name.skill");
  ```
- **Validazione YAML**: Usare js-yaml per parsing sicuro e catch errori
- **Gestione modifiche non salvate**: Implementare beforeunload listener per warning

**Priorità di Sviluppo**:
1. **Phase 1 - MVP**:
   - Caricamento file .skill
   - Tree view sola lettura
   - Editing SKILL.md con syntax highlighting base
   - Export skill modificata
   
2. **Phase 2 - Editor Completo**:
   - Gestione file supplementari (add/remove)
   - Syntax highlighting per tutti i tipi di file
   - Validazione YAML frontmatter
   
3. **Phase 3 - Miglioramenti UX**:
   - Drag & drop per caricamento
   - Validazione completa pre-export
   - UI polish e error handling avanzato

**Testing**:
- Test caricamento skill valide di diverse dimensioni
- Test parsing YAML frontmatter con vari formati
- Test gestione file con caratteri speciali nei nomi
- Test validazione con skill malformate (SKILL.md mancante, YAML invalido)
- Test export e verifica integrità archivio ZIP generato
- Test browser compatibility (Chrome, Firefox, Safari, Edge)
- Test gestione file binari in assets/ (immagini, font)
