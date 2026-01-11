import { useReducer, useCallback, useEffect } from 'react'
import { loadSkillFile, saveSkillFile } from '../utils/zipHandler'
import { validateSkillMd } from '../utils/yamlParser'
import { isSkillMd } from '../utils/fileUtils'

// Action types
const ACTIONS = {
  LOAD_SKILL: 'LOAD_SKILL',
  LOAD_ERROR: 'LOAD_ERROR',
  SELECT_FILE: 'SELECT_FILE',
  UPDATE_FILE: 'UPDATE_FILE',
  ADD_FILE: 'ADD_FILE',
  DELETE_FILE: 'DELETE_FILE',
  SET_VALIDATION_ERRORS: 'SET_VALIDATION_ERRORS',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
  RESET: 'RESET',
  SET_SAVING: 'SET_SAVING',
}

// Initial state
const initialState = {
  appState: 'upload', // 'upload' | 'editing'
  fileName: null,
  files: {},
  selectedFile: null,
  isModified: false,
  validationErrors: [],
  loadError: null,
  isSaving: false,
}

// Reducer
function skillReducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOAD_SKILL:
      return {
        ...state,
        appState: 'editing',
        fileName: action.fileName,
        files: action.files,
        selectedFile: findSkillMd(action.files),
        isModified: false,
        validationErrors: [],
        loadError: null,
      }

    case ACTIONS.LOAD_ERROR:
      return {
        ...state,
        loadError: action.error,
      }

    case ACTIONS.SELECT_FILE:
      return {
        ...state,
        selectedFile: action.path,
      }

    case ACTIONS.UPDATE_FILE:
      return {
        ...state,
        files: {
          ...state.files,
          [action.path]: {
            ...state.files[action.path],
            content: action.content,
          },
        },
        isModified: true,
      }

    case ACTIONS.ADD_FILE:
      return {
        ...state,
        files: {
          ...state.files,
          [action.path]: {
            content: action.content,
            isBinary: action.isBinary || false,
          },
        },
        isModified: true,
      }

    case ACTIONS.DELETE_FILE: {
      const newFiles = { ...state.files }
      delete newFiles[action.path]
      return {
        ...state,
        files: newFiles,
        selectedFile: state.selectedFile === action.path ? null : state.selectedFile,
        isModified: true,
      }
    }

    case ACTIONS.SET_VALIDATION_ERRORS:
      return {
        ...state,
        validationErrors: action.errors,
      }

    case ACTIONS.CLEAR_ERRORS:
      return {
        ...state,
        validationErrors: [],
        loadError: null,
      }

    case ACTIONS.SET_SAVING:
      return {
        ...state,
        isSaving: action.isSaving,
      }

    case ACTIONS.RESET:
      return initialState

    default:
      return state
  }
}

// Find SKILL.md in files
function findSkillMd(files) {
  const paths = Object.keys(files)
  return paths.find(path => isSkillMd(path)) || null
}

/**
 * Custom hook for skill state management
 */
export function useSkillState() {
  const [state, dispatch] = useReducer(skillReducer, initialState)

  // Load skill file
  const loadSkill = useCallback(async (file) => {
    dispatch({ type: ACTIONS.CLEAR_ERRORS })

    const { files, error } = await loadSkillFile(file)

    if (error) {
      dispatch({ type: ACTIONS.LOAD_ERROR, error })
      return false
    }

    dispatch({
      type: ACTIONS.LOAD_SKILL,
      fileName: file.name,
      files,
    })

    return true
  }, [])

  // Select file for editing
  const selectFile = useCallback((path) => {
    dispatch({ type: ACTIONS.SELECT_FILE, path })
  }, [])

  // Update file content
  const updateFile = useCallback((path, content) => {
    dispatch({ type: ACTIONS.UPDATE_FILE, path, content })
  }, [])

  // Add new file
  const addFile = useCallback((path, content, isBinary = false) => {
    dispatch({ type: ACTIONS.ADD_FILE, path, content, isBinary })
  }, [])

  // Delete file
  const deleteFile = useCallback((path) => {
    // Prevent deleting SKILL.md
    if (isSkillMd(path)) {
      return false
    }
    dispatch({ type: ACTIONS.DELETE_FILE, path })
    return true
  }, [])

  // Validate and save skill
  const saveSkill = useCallback(async () => {
    // Find and validate SKILL.md
    const skillMdPath = findSkillMd(state.files)

    if (!skillMdPath) {
      dispatch({
        type: ACTIONS.SET_VALIDATION_ERRORS,
        errors: ['SKILL.md non trovato'],
      })
      return false
    }

    const skillMdContent = state.files[skillMdPath].content
    const errors = validateSkillMd(skillMdContent)

    if (errors.length > 0) {
      dispatch({ type: ACTIONS.SET_VALIDATION_ERRORS, errors })
      return false
    }

    // Save the file
    dispatch({ type: ACTIONS.SET_SAVING, isSaving: true })

    try {
      await saveSkillFile(state.files, state.fileName)
      dispatch({ type: ACTIONS.SET_SAVING, isSaving: false })
      return true
    } catch (err) {
      dispatch({ type: ACTIONS.SET_SAVING, isSaving: false })
      dispatch({
        type: ACTIONS.SET_VALIDATION_ERRORS,
        errors: [`Errore durante il salvataggio: ${err.message}`],
      })
      return false
    }
  }, [state.files, state.fileName])

  // Reset to upload state
  const reset = useCallback(() => {
    dispatch({ type: ACTIONS.RESET })
  }, [])

  // Clear errors
  const clearErrors = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_ERRORS })
  }, [])

  // Warn on unsaved changes before leaving
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (state.isModified) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [state.isModified])

  return {
    ...state,
    loadSkill,
    selectFile,
    updateFile,
    addFile,
    deleteFile,
    saveSkill,
    reset,
    clearErrors,
  }
}
