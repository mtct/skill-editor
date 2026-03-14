import { useCallback, useMemo, useState } from 'react'
import { isSkillMd, isBinaryFile, getFileName, getDirectory, sortFiles } from '../utils/fileUtils'
import { AddFileDialog } from './AddFileDialog'
import { MESSAGES } from '../constants/messages'

function groupByDir(files) {
  const sorted = sortFiles(Object.keys(files))
  const groups = {}
  sorted.forEach(path => {
    const dir = getDirectory(path) || ''
    if (!groups[dir]) groups[dir] = []
    groups[dir].push(path)
  })
  return groups
}

export function Sidebar({ files, selectedFile, onSelectFile, onDeleteFile, onAddFile, isOpen, onClose }) {
  const [showAddDialog, setShowAddDialog] = useState(false)

  const groups = useMemo(() => groupByDir(files), [files])

  const handleSelect = useCallback((path) => {
    onSelectFile(path)
    onClose()
  }, [onSelectFile, onClose])

  const existingDirs = useMemo(() => {
    const dirs = new Set()
    Object.keys(files).forEach(path => {
      const dir = getDirectory(path)
      if (dir) {
        const parts = dir.split('/')
        let current = ''
        parts.forEach(part => {
          current = current ? `${current}/${part}` : part
          dirs.add(current + '/')
        })
      }
    })
    return Array.from(dirs).sort()
  }, [files])

  const handleAddFile = useCallback((file, targetPath) => {
    if (file === null) {
      // Create empty editable file
      onAddFile(targetPath, '', false)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (isBinaryFile(file.name)) {
        onAddFile(targetPath, reader.result.split(',')[1], true)
      } else {
        onAddFile(targetPath, reader.result, false)
      }
    }
    if (isBinaryFile(file.name)) {
      reader.readAsDataURL(file)
    } else {
      reader.readAsText(file)
    }
  }, [onAddFile])

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          aria-hidden="true"
          className="md:hidden fixed inset-0 z-30 bg-black/30"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          border-r border-surface-200 bg-surface-50 flex flex-col
          fixed inset-y-0 left-0 z-40 w-72 shadow-elevation-4
          transition-transform duration-200
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:w-64 md:shadow-elevation-1 md:z-auto
        `}
      >
        <nav aria-label={MESSAGES.FILES_NAV} className="flex-1 overflow-y-auto p-2 min-h-0">
          {Object.entries(groups).map(([dir, paths]) => (
            <div key={dir || '__root__'} className="mb-1">
              {dir && (
                <p className="px-2 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-surface-700 select-none truncate">
                  {dir}
                </p>
              )}
              {paths.map(path => {
                const canDelete = !isSkillMd(path)
                const isSelected = path === selectedFile
                return (
                  <div
                    key={path}
                    role="button"
                    tabIndex={0}
                    aria-current={isSelected ? 'true' : undefined}
                    onClick={() => handleSelect(path)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(path) } }}
                    className={`
                      group flex items-center justify-between px-2 h-9 my-0.5 rounded-md cursor-pointer transition-all duration-150
                      ${isSelected ? 'bg-primary-50 text-primary-700 shadow-elevation-1' : 'hover:bg-surface-100'}
                    `}
                  >
                    <span className="truncate text-sm text-surface-900">{getFileName(path)}</span>
                    {canDelete ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteFile(path) }}
                        aria-label={MESSAGES.DELETE_FILE_ARIA}
                        className="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:bg-danger-50 hover:text-danger-600 focus:outline-none focus:ring-2 focus:ring-danger-600 focus:opacity-100 transition-all duration-150"
                      >
                        <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                          <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                        </svg>
                      </button>
                    ) : (
                      <span className="w-8 flex-shrink-0" aria-hidden="true" />
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-surface-200 bg-surface-0">
          <button
            onClick={() => setShowAddDialog(true)}
            className="w-full flex items-center justify-center gap-2 px-3 min-h-[44px] rounded-md text-sm font-medium text-surface-700 hover:bg-surface-100 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 active:bg-surface-200 transition-all duration-200"
          >
            <span aria-hidden="true">+</span>
            <span>{MESSAGES.ADD_FILE}</span>
          </button>
        </div>

      </aside>

      <AddFileDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAdd={handleAddFile}
        existingDirs={existingDirs}
      />
    </>
  )
}

