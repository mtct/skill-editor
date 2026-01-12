import { useMemo, useRef, useState } from 'react'
import { Tree } from 'react-arborist'
import { buildFileTree, isSkillMd, isBinaryFile, getDirectory } from '../utils/fileUtils'
import { AddFileDialog } from './AddFileDialog'

function TreeNode({ node, style, dragHandle }) {
  const { data } = node
  const canDelete = !data.isDirectory && !isSkillMd(data.id)
  // Check if this node is selected based on the data prop (which includes selectedFile)
  const isSelected = data.isSelected

  return (
    <div
      ref={dragHandle}
      style={style}
      className={`
        flex items-center justify-between px-2 py-1.5 my-0.5 rounded-md cursor-pointer transition-all duration-150
        ${isSelected ? 'bg-primary-50 text-primary-700 shadow-elevation-1' : 'hover:bg-surface-100'}
      `}
      onClick={() => node.isInternal ? node.toggle() : node.select()}
    >
      <div className="flex items-center gap-1 min-w-0">
        {data.isDirectory ? (
          <span className="text-surface-700 w-4 text-center text-xs leading-none">
            {node.isOpen ? '▼' : '▶'}
          </span>
        ) : (
          <span className="w-4" />
        )}
        <span className={`truncate leading-tight ${data.isDirectory ? 'font-semibold text-surface-900' : 'text-surface-900'}`}>
          {data.name}
        </span>
      </div>

      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
        {canDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              node.data.onDelete?.(data.id)
            }}
            className="p-1 rounded text-surface-700 opacity-60 hover:opacity-100 hover:bg-danger-50 hover:text-danger-600 focus:outline-none focus:ring-2 focus:ring-danger-600 transition-all duration-200"
            title="Delete"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  )
}

export function Sidebar({ files, selectedFile, onSelectFile, onDeleteFile, onAddFile }) {
  const treeRef = useRef(null)
  const [showAddDialog, setShowAddDialog] = useState(false)

  // Build tree structure with delete handler and selection state attached
  const treeData = useMemo(() => {
    const tree = buildFileTree(files)

    // Attach delete handler and selection state to each node
    const attachData = (nodes) => {
      nodes.forEach(node => {
        node.onDelete = onDeleteFile
        node.isSelected = !node.isDirectory && node.id === selectedFile
        if (node.children) {
          attachData(node.children)
        }
      })
    }
    attachData(tree)

    return tree
  }, [files, onDeleteFile, selectedFile])

  // Handle selection - only update if a file is selected, maintain current selection otherwise
  const handleSelect = (nodes) => {
    if (nodes.length > 0) {
      const node = nodes[0]
      if (!node.data.isDirectory) {
        onSelectFile(node.id)
      }
    }
    // Don't deselect if clicking outside - keep the current selection
  }

  // Extract existing directories for suggestions
  const existingDirs = useMemo(() => {
    const dirs = new Set()
    Object.keys(files).forEach(path => {
      const dir = getDirectory(path)
      if (dir) {
        // Add all parent directories
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

  // Handle file addition with path
  const handleAddFile = (file, targetPath) => {
    const reader = new FileReader()
    reader.onload = () => {
      const isBinary = isBinaryFile(file.name)
      if (isBinary) {
        // Convert to base64 for binary files
        const base64 = reader.result.split(',')[1]
        onAddFile(targetPath, base64, true)
      } else {
        onAddFile(targetPath, reader.result, false)
      }
    }

    if (isBinaryFile(file.name)) {
      reader.readAsDataURL(file)
    } else {
      reader.readAsText(file)
    }
  }

  return (
    <aside className="w-64 border-r border-surface-200 bg-surface-50 shadow-elevation-1 flex flex-col h-full">
      <div className="flex-1 overflow-auto p-2">
        <Tree
          ref={treeRef}
          data={treeData}
          selection={selectedFile}
          onSelect={handleSelect}
          openByDefault={true}
          width="100%"
          height={600}
          indent={16}
          rowHeight={40}
          overscanCount={5}
        >
          {TreeNode}
        </Tree>
      </div>

      <div className="p-3 border-t border-surface-200 bg-surface-0">
        <button
          onClick={() => setShowAddDialog(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-surface-700 hover:bg-surface-100 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 active:bg-surface-200 transition-all duration-200"
        >
          <span>+ Add file</span>
        </button>
      </div>

      <AddFileDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAdd={handleAddFile}
        existingDirs={existingDirs}
      />
    </aside>
  )
}
