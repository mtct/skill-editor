// File extension to language mapping for CodeMirror
export const LANGUAGE_MAP = {
  md: 'markdown',
  markdown: 'markdown',
  yaml: 'yaml',
  yml: 'yaml',
  py: 'python',
  python: 'python',
  js: 'javascript',
  javascript: 'javascript',
  sh: 'javascript',
  bash: 'javascript',
  json: 'javascript',
}

// Binary file extensions (no text preview)
export const BINARY_EXTENSIONS = [
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico',
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
  'zip', 'rar', '7z', 'tar', 'gz',
  'mp3', 'wav', 'ogg', 'mp4', 'webm', 'avi',
  'ttf', 'otf', 'woff', 'woff2', 'eot',
]

// Image file extensions
export const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico']

// PDF file extension
export const PDF_EXTENSIONS = ['pdf']

/**
 * Get file extension from path
 */
export function getExtension(path) {
  const parts = path.split('.')
  return parts.length > 1 ? parts.pop().toLowerCase() : ''
}

/**
 * Get filename from path
 */
export function getFileName(path) {
  return path.split('/').pop()
}

/**
 * Get directory from path
 */
export function getDirectory(path) {
  const parts = path.split('/')
  parts.pop()
  return parts.join('/')
}

/**
 * Check if file is binary
 */
export function isBinaryFile(path) {
  const ext = getExtension(path)
  return BINARY_EXTENSIONS.includes(ext)
}

/**
 * Check if file is an image
 */
export function isImageFile(path) {
  const ext = getExtension(path)
  return IMAGE_EXTENSIONS.includes(ext)
}

/**
 * Check if file is a PDF
 */
export function isPdfFile(path) {
  const ext = getExtension(path)
  return PDF_EXTENSIONS.includes(ext)
}

/**
 * Get MIME type for image based on extension
 */
export function getImageMimeType(path) {
  const ext = getExtension(path)
  const mimeTypes = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
  }
  return mimeTypes[ext] || 'image/png'
}

/**
 * Get language for CodeMirror based on file path
 */
export function getLanguage(path) {
  const ext = getExtension(path)
  return LANGUAGE_MAP[ext] || 'markdown'
}

/**
 * Check if path is SKILL.md (case insensitive)
 */
export function isSkillMd(path) {
  const fileName = getFileName(path).toLowerCase()
  return fileName === 'skill.md'
}

/**
 * Sort files with SKILL.md first, then alphabetically
 */
export function sortFiles(files) {
  return [...files].sort((a, b) => {
    const aIsSkill = isSkillMd(a)
    const bIsSkill = isSkillMd(b)

    if (aIsSkill && !bIsSkill) return -1
    if (!aIsSkill && bIsSkill) return 1

    return a.localeCompare(b)
  })
}

/**
 * Build tree structure from flat file list
 */
export function buildFileTree(files) {
  const tree = []
  const map = {}

  // Sort files first
  const sortedPaths = sortFiles(Object.keys(files))

  sortedPaths.forEach(path => {
    const parts = path.split('/')
    let currentLevel = tree
    let currentPath = ''

    parts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part
      const isFile = index === parts.length - 1

      let existing = map[currentPath]

      if (!existing) {
        existing = {
          id: currentPath,
          name: part,
          isDirectory: !isFile,
          children: isFile ? undefined : [],
        }
        map[currentPath] = existing
        currentLevel.push(existing)
      }

      if (!isFile) {
        currentLevel = existing.children
      }
    })
  })

  return tree
}
