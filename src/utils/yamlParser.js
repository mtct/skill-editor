import yaml from 'js-yaml'
import { MESSAGES } from '../constants/messages'

// Regex to extract YAML frontmatter from markdown
const FRONTMATTER_REGEX = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/

/**
 * Parse SKILL.md content and extract frontmatter
 * @param {string} content - The SKILL.md file content
 * @returns {{frontmatter: Object|null, body: string, errors: string[]}}
 */
export function parseSkillMd(content) {
  const errors = []
  let frontmatter = null
  let body = content

  const match = content.match(FRONTMATTER_REGEX)

  if (match) {
    const yamlString = match[1]
    body = match[2]

    try {
      frontmatter = yaml.load(yamlString)

      // Validate required fields
      if (!frontmatter || typeof frontmatter !== 'object') {
        errors.push(MESSAGES.ERROR_INVALID_YAML)
      } else {
        if (!frontmatter.name || String(frontmatter.name).trim() === '') {
          errors.push(MESSAGES.ERROR_MISSING_NAME)
        }
        if (!frontmatter.description || String(frontmatter.description).trim() === '') {
          errors.push(MESSAGES.ERROR_MISSING_DESCRIPTION)
        }
      }
    } catch (err) {
      errors.push(`${MESSAGES.ERROR_INVALID_YAML}: ${err.message}`)
    }
  } else {
    // No frontmatter found - still valid but check if it might be malformed
    if (content.startsWith('---')) {
      errors.push(MESSAGES.ERROR_INVALID_YAML)
    }
  }

  return { frontmatter, body, errors }
}

/**
 * Validate SKILL.md content
 * @param {string} content - The SKILL.md content to validate
 * @returns {string[]} - Array of error messages (empty if valid)
 */
export function validateSkillMd(content) {
  const { errors } = parseSkillMd(content)
  return errors
}

/**
 * Serialize frontmatter and body back to SKILL.md format
 * @param {Object} frontmatter - The frontmatter object
 * @param {string} body - The markdown body
 * @returns {string}
 */
export function serializeSkillMd(frontmatter, body) {
  const yamlString = yaml.dump(frontmatter, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
  }).trim()

  return `---\n${yamlString}\n---\n${body}`
}
