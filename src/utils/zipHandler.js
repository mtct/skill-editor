import JSZip from 'jszip'
import { MESSAGES } from '../constants/messages'
import { isBinaryFile, isSkillMd } from './fileUtils'

/**
 * Load and parse a .skill file (ZIP archive)
 * @param {File} file - The .skill file to load
 * @returns {Promise<{files: Object, error: string|null}>}
 */
export async function loadSkillFile(file) {
  // Validate extension
  if (!file.name.toLowerCase().endsWith('.skill')) {
    return { files: null, error: MESSAGES.ERROR_INVALID_FILE }
  }

  try {
    const zip = await JSZip.loadAsync(file)
    const files = {}
    let hasSkillMd = false

    // Collect all file paths first
    const allPaths = []
    zip.forEach((relativePath, zipEntry) => {
      if (!zipEntry.dir && !relativePath.startsWith('.') && !relativePath.includes('/.')) {
        allPaths.push(relativePath)
      }
    })

    // Detect and remove common root folder
    const rootFolder = detectRootFolder(allPaths)

    // Extract all files
    const promises = []

    zip.forEach((relativePath, zipEntry) => {
      // Skip directories and hidden files
      if (zipEntry.dir || relativePath.startsWith('.') || relativePath.includes('/.')) {
        return
      }

      // Normalize path by removing root folder if present
      let normalizedPath = relativePath
      if (rootFolder && relativePath.startsWith(rootFolder)) {
        normalizedPath = relativePath.substring(rootFolder.length)
      }

      // Check for SKILL.md (by filename, not full path)
      if (isSkillMd(normalizedPath)) {
        hasSkillMd = true
      }

      const promise = (async () => {
        const isBinary = isBinaryFile(normalizedPath)

        if (isBinary) {
          // Store binary files as base64
          const content = await zipEntry.async('base64')
          files[normalizedPath] = {
            content,
            isBinary: true,
          }
        } else {
          // Store text files as string
          const content = await zipEntry.async('string')
          files[normalizedPath] = {
            content,
            isBinary: false,
          }
        }
      })()

      promises.push(promise)
    })

    await Promise.all(promises)

    // Validate SKILL.md presence
    if (!hasSkillMd) {
      return { files: null, error: MESSAGES.ERROR_NO_SKILL_MD }
    }

    return { files, error: null }
  } catch (err) {
    console.error('Error loading skill file:', err)
    return { files: null, error: MESSAGES.ERROR_NOT_ZIP }
  }
}

/**
 * Detect if all files are inside a common root folder
 * @param {string[]} paths - Array of file paths
 * @returns {string|null} - The root folder path with trailing slash, or null
 */
function detectRootFolder(paths) {
  if (paths.length === 0) return null

  // Check if all paths start with the same folder
  const firstPath = paths[0]
  const firstSlash = firstPath.indexOf('/')

  if (firstSlash === -1) {
    // No folders, files are at root
    return null
  }

  const potentialRoot = firstPath.substring(0, firstSlash + 1)

  // Check if all paths start with this root
  const allHaveSameRoot = paths.every(path => path.startsWith(potentialRoot))

  return allHaveSameRoot ? potentialRoot : null
}

/**
 * Save files as a .skill archive
 * @param {Object} files - The files object to save
 * @param {string} fileName - The original filename
 */
export async function saveSkillFile(files, fileName) {
  const zip = new JSZip()

  // Add all files to the ZIP
  Object.entries(files).forEach(([path, fileData]) => {
    if (fileData.isBinary) {
      // Add binary file from base64
      zip.file(path, fileData.content, { base64: true })
    } else {
      // Add text file
      zip.file(path, fileData.content)
    }
  })

  // Generate the ZIP blob
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  })

  // Trigger download
  downloadBlob(blob, fileName)
}

/**
 * Download a blob as a file
 */
function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
