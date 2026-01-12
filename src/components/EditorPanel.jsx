import { useEffect, useRef, useMemo, useState } from 'react'
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
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-surface-700">
          <span className="text-6xl">📄</span>
          <span className="text-sm text-surface-700">{MESSAGES.BINARY_FILE}</span>
        </div>
      </div>
    )
  }

  // Text file editor
  const fileName = getFileName(filePath)

  return (
    <div className="flex-1 flex flex-col bg-surface-50">
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
