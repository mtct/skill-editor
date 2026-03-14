import { useEffect, useRef, useMemo, useState, useCallback } from 'react'
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language'
import { markdown } from '@codemirror/lang-markdown'
import { yaml } from '@codemirror/lang-yaml'
import { python } from '@codemirror/lang-python'
import { javascript } from '@codemirror/lang-javascript'
import { getLanguage, isBinaryFile, getFileName, isImageFile, isPdfFile, getImageMimeType } from '../utils/fileUtils'
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
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null)

  // One-time SKILL.md hint (dismissed state persisted in localStorage)
  const [hintDismissed, setHintDismissed] = useState(
    () => localStorage.getItem('skill-editor-skillmd-hint') === '1'
  )
  const dismissHint = useCallback(() => {
    localStorage.setItem('skill-editor-skillmd-hint', '1')
    setHintDismissed(true)
  }, [])

  const isSkillMdFile = filePath === 'SKILL.md'
  const showSkillMdHint = isSkillMdFile && !hintDismissed

  // Determine language from file path
  const language = useMemo(() => {
    return filePath ? getLanguage(filePath) : 'markdown'
  }, [filePath])

  // Create blob URL for PDF files and clean up on unmount or file change
  useEffect(() => {
    if (isBinary && isPdfFile(filePath) && content) {
      // Convert base64 to blob URL
      const binaryString = atob(content)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      const blob = new Blob([bytes], { type: 'application/pdf' })
      const blobUrl = URL.createObjectURL(blob)
      setPdfBlobUrl(blobUrl)

      // Cleanup function
      return () => {
        URL.revokeObjectURL(blobUrl)
      }
    } else {
      // Reset blob URL if not a PDF
      setPdfBlobUrl(null)
    }
  }, [filePath, content, isBinary])

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
            backgroundColor: 'var(--color-surface-0)',
            color: 'var(--color-surface-900)',
          },
          '&.cm-focused': {
            outline: 'none',
          },
          '.cm-gutters': {
            backgroundColor: 'var(--color-surface-50)',
            color: 'var(--color-surface-700)',
            borderRight: '1px solid var(--color-surface-200)',
          },
          '.cm-lineNumbers .cm-gutterElement': {
            color: 'var(--color-surface-700)',
          },
          '.cm-activeLineGutter': {
            backgroundColor: 'var(--color-surface-100)',
          },
          '.cm-foldPlaceholder': {
            backgroundColor: 'var(--color-surface-200)',
            color: 'var(--color-surface-900)',
          },
          '.cm-tooltip': {
            backgroundColor: 'var(--color-surface-100)',
            border: '1px solid var(--color-surface-200)',
            color: 'var(--color-surface-900)',
          },
          '.cm-panels': {
            backgroundColor: 'var(--color-surface-50)',
            color: 'var(--color-surface-900)',
          },
          '.cm-searchMatch': {
            backgroundColor: 'var(--color-primary-50)',
            outline: '1px solid var(--color-primary-500)',
          },
          '.cm-selectionMatch': {
            backgroundColor: 'var(--color-primary-50)',
          },
          '.cm-scroller': {
            overflow: 'auto',
            fontFamily: '"Geist Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
          },
          '.cm-content': {
            padding: '16px 0',
            caretColor: 'var(--color-primary-500)',
          },
          '.cm-line': {
            padding: '0 16px',
          },
          '.cm-activeLine': {
            backgroundColor: 'var(--color-surface-50)',
          },
          '.cm-selectionBackground': {
            backgroundColor: 'var(--color-primary-50) !important',
          },
          '.cm-cursor': {
            borderLeftColor: 'var(--color-primary-500)',
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
      <div className="flex-1 flex flex-col items-center justify-center bg-surface-50 gap-3 p-8 text-center">
        {/* Arrow pointing left toward sidebar */}
        <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          className="text-surface-200 -scale-x-100">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        <p className="font-semibold text-surface-900 text-sm">{MESSAGES.EMPTY_STATE_TITLE}</p>
        <p className="text-xs text-surface-700 max-w-[22ch] leading-relaxed">{MESSAGES.EMPTY_STATE_DESC}</p>
      </div>
    )
  }

  // Binary file - check if it's an image or PDF
  if (isBinary) {
    const fileName = getFileName(filePath)

    // Image viewer
    if (isImageFile(filePath)) {
      const mimeType = getImageMimeType(filePath)
      const dataUrl = `data:${mimeType};base64,${content}`

      return (
        <div className="flex-1 flex flex-col bg-surface-50">
          <div className="px-4 py-3 border-b border-surface-200 bg-surface-0">
            <span className="font-semibold text-base text-surface-900">{fileName}</span>
          </div>
          <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
            <img
              src={dataUrl}
              alt={fileName}
              className="max-w-full max-h-full object-contain rounded-lg shadow-elevation-2 bg-surface-0"
            />
          </div>
        </div>
      )
    }

    // PDF viewer
    if (isPdfFile(filePath) && pdfBlobUrl) {
      return (
        <div className="flex-1 flex flex-col bg-surface-50">
          <div className="px-4 py-3 border-b border-surface-200 bg-surface-0">
            <span className="font-semibold text-base text-surface-900">{fileName}</span>
          </div>
          <iframe
            src={pdfBlobUrl}
            className="flex-1 w-full border-0"
            title={fileName}
          />
        </div>
      )
    }

    // Other binary files - generic message
    return (
      <div className="flex-1 flex flex-col bg-surface-50">
        <div className="px-4 py-3 border-b border-surface-200 bg-surface-0">
          <span className="font-semibold text-base text-surface-900">{fileName}</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-surface-700">
          <svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            className="text-surface-200">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span className="text-sm text-surface-700">{MESSAGES.BINARY_FILE}</span>
        </div>
      </div>
    )
  }

  // Text file editor
  const fileName = getFileName(filePath)

  return (
    <div className="flex-1 flex flex-col bg-surface-50">
      {/* One-time SKILL.md hint banner */}
      {showSkillMdHint && (
        <div role="note" className="flex items-start gap-3 px-4 py-3 bg-primary-50 border-b border-primary-500/20 text-sm">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 20 20" fill="currentColor"
            className="text-primary-500 flex-shrink-0 mt-0.5">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
          </svg>
          <span className="flex-1 text-primary-700">{MESSAGES.SKILLMD_HINT}</span>
          <button
            onClick={dismissHint}
            className="flex-shrink-0 text-xs font-semibold text-primary-500 hover:text-primary-700 underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded transition-colors"
          >
            {MESSAGES.SKILLMD_HINT_DISMISS}
          </button>
        </div>
      )}
      <div className="px-4 py-3 border-b border-surface-200 bg-surface-0">
        <span className="font-semibold text-base text-surface-900">{fileName}</span>
      </div>
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden bg-surface-0"
      />
    </div>
  )
}
