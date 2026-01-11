import { useEffect, useRef, useMemo } from 'react'
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language'
import { markdown } from '@codemirror/lang-markdown'
import { yaml } from '@codemirror/lang-yaml'
import { python } from '@codemirror/lang-python'
import { javascript } from '@codemirror/lang-javascript'
import { getLanguage, isBinaryFile, getFileName } from '../utils/fileUtils'
import { MESSAGES } from '../constants/messages'

// Get language extension based on file type
function getLanguageExtension(language) {
  switch (language) {
    case 'markdown':
      return markdown()
    case 'yaml':
      return yaml()
    case 'python':
      return python()
    case 'javascript':
      return javascript()
    default:
      return markdown()
  }
}

export function EditorPanel({ filePath, content, isBinary, onChange }) {
  const containerRef = useRef(null)
  const viewRef = useRef(null)

  // Determine language from file path
  const language = useMemo(() => {
    return filePath ? getLanguage(filePath) : 'markdown'
  }, [filePath])

  // Create or update editor
  useEffect(() => {
    if (!containerRef.current || isBinary) return

    // Destroy existing editor
    if (viewRef.current) {
      viewRef.current.destroy()
    }

    // Create update listener
    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const newContent = update.state.doc.toString()
        onChange(newContent)
      }
    })

    // Create editor state
    const state = EditorState.create({
      doc: content || '',
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        getLanguageExtension(language),
        syntaxHighlighting(defaultHighlightStyle),
        updateListener,
        EditorView.lineWrapping,
        EditorView.theme({
          '&': {
            height: '100%',
            fontSize: '14px',
            backgroundColor: '#FFFFFF',
          },
          '.cm-scroller': {
            overflow: 'auto',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
          },
          '.cm-content': {
            padding: '16px 0',
            caretColor: '#2196F3',
          },
          '.cm-line': {
            padding: '0 16px',
          },
          '.cm-activeLine': {
            backgroundColor: '#FAFAFA',
          },
          '.cm-selectionBackground': {
            backgroundColor: '#E3F2FD !important',
          },
          '.cm-cursor': {
            borderLeftColor: '#2196F3',
          },
        }),
      ],
    })

    // Create editor view
    viewRef.current = new EditorView({
      state,
      parent: containerRef.current,
    })

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy()
        viewRef.current = null
      }
    }
  }, [filePath, language]) // Re-create when file changes

  // Update content when it changes externally (but not from our own edits)
  useEffect(() => {
    if (viewRef.current && content !== undefined && !isBinary) {
      const currentContent = viewRef.current.state.doc.toString()
      if (currentContent !== content) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentContent.length,
            insert: content,
          },
        })
      }
    }
  }, [content, isBinary])

  // No file selected
  if (!filePath) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface-50 text-surface-700 text-base">
        Select a file from the sidebar
      </div>
    )
  }

  // Binary file
  if (isBinary) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-surface-50 text-surface-700">
        <span className="text-6xl">📄</span>
        <span className="font-semibold text-lg text-surface-900">{getFileName(filePath)}</span>
        <span className="text-sm text-surface-700">{MESSAGES.BINARY_FILE}</span>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-hidden bg-surface-0"
    />
  )
}
