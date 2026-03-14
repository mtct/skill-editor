export const MESSAGES = {
  // Upload screen
  UPLOAD_TITLE: 'Trascina qui il file .skill, o clicca per sfogliare',
  UPLOAD_ARIA_LABEL: 'Carica file .skill — clicca o trascina qui',
  UPLOAD_HINT: 'Clicca o trascina un file .skill',

  // Header
  SAVE_BUTTON: 'SALVA',
  CLOSE_BUTTON: 'CHIUDI',
  MODIFIED_INDICATOR: '(modificato)',
  UNSAVED_CHANGES_CONFIRM: 'Hai modifiche non salvate. Vuoi uscire senza salvare?',
  TOGGLE_SIDEBAR_OPEN: 'Apri barra laterale',
  TOGGLE_SIDEBAR_CLOSE: 'Chiudi barra laterale',
  TOGGLE_LIGHT: 'Passa al tema chiaro',
  TOGGLE_DARK: 'Passa al tema scuro',

  // Validation errors
  ERROR_INVALID_FILE: 'File non valido. Seleziona un file .skill',
  ERROR_NOT_ZIP: 'Il file non è un archivio ZIP valido',
  ERROR_NO_SKILL_MD: 'Struttura non valida: SKILL.md è obbligatorio',
  ERROR_INVALID_YAML: 'Frontmatter YAML non valido',
  ERROR_MISSING_NAME: 'Campo "name" obbligatorio nel frontmatter',
  ERROR_MISSING_DESCRIPTION: 'Campo "description" obbligatorio nel frontmatter',

  // Confirmations
  CONFIRM_DELETE: 'Sei sicuro di voler eliminare',
  CONFIRM_UNSAVED: 'Hai modifiche non salvate. Vuoi uscire?',

  // File actions
  ADD_FILE: 'Aggiungi file',
  FILES_NAV: 'File',
  ADD_FILE_MODE_UPLOAD: 'Carica file',
  ADD_FILE_MODE_EMPTY: 'File vuoto',
  ADD_FILE_LABEL: 'Seleziona file',
  ADD_FILE_EMPTY_NAME: 'Nome file',
  ADD_FILE_EMPTY_NAME_PLACEHOLDER: 'es: script.py, config.yaml, README.md',
  ADD_FILE_PATH: 'Percorso di destinazione',
  ADD_FILE_PATH_HINT: 'Includi sottocartelle nel percorso (es: scripts/utils/helper.py)',
  ADD_FILE_PATH_PLACEHOLDER: 'es: scripts/helper.py o SKILL.md',
  ADD_FILE_FOLDERS: 'Cartelle comuni',
  ADD_FILE_CANCEL: 'Annulla',
  ADD_FILE_CONFIRM: 'Aggiungi',
  DELETE_FILE: 'Elimina',
  DELETE_FILE_ARIA: 'Elimina file',

  // Editor
  FILE_DELETED: 'File eliminato',
  BINARY_FILE: 'File binario — anteprima non disponibile',
  SELECT_FILE: 'Seleziona un file dalla barra laterale',

  // Validation toast
  VALIDATION_TITLE: 'Errori di validazione',
  VALIDATION_CLOSE: 'Chiudi',

  // Status
  LOADING: 'Caricamento...',
  SAVING: 'Salvataggio...',

  // Onboarding
  HOW_IT_WORKS: 'Come funziona',
  ONBOARD_STEP1_TITLE: 'Carica',
  ONBOARD_STEP1_DESC: 'Trascina o scegli un file .skill dall\'area sopra',
  ONBOARD_STEP2_TITLE: 'Modifica',
  ONBOARD_STEP2_DESC: 'Edita SKILL.md, script, riferimenti e risorse',
  ONBOARD_STEP3_TITLE: 'Esporta',
  ONBOARD_STEP3_DESC: 'Premi SALVA per scaricare il file .skill aggiornato',

  // SKILL.md hint
  SKILLMD_HINT: 'SKILL.md è il cuore della skill: il blocco YAML in cima definisce name e description, il corpo Markdown descrive il comportamento.',
  SKILLMD_HINT_DISMISS: 'Capito',

  // Empty state
  EMPTY_STATE_TITLE: 'Nessun file selezionato',
  EMPTY_STATE_DESC: 'Seleziona SKILL.md dalla barra laterale per iniziare',
}
