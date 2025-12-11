/**
 * HTML Formatter Utility
 * Provides functions to safely format and sanitize HTML content from backend responses
 */

/**
 * Sanitizes HTML content by removing potentially dangerous elements and attributes
 * @param {string} html - Raw HTML string from backend
 * @returns {string} - Sanitized HTML string
 */
export const sanitizeHTML = (html) => {
  if (!html || typeof html !== "string") return "";

  // Create a temporary div to parse HTML
  const temp = document.createElement("div");
  temp.innerHTML = html;

  // Remove script tags
  const scripts = temp.querySelectorAll("script");
  scripts.forEach((script) => script.remove());

  // Remove event handlers
  const allElements = temp.querySelectorAll("*");
  allElements.forEach((element) => {
    // Remove all on* attributes (onclick, onload, etc.)
    Array.from(element.attributes).forEach((attr) => {
      if (attr.name.startsWith("on")) {
        element.removeAttribute(attr.name);
      }
    });
  });

  return temp.innerHTML;
};

/**
 * Formats HTML content with proper structure and styling
 * @param {string} html - HTML string to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted HTML string
 */
export const formatHTML = (html, options = {}) => {
  const {
    addWrapper = false,
    wrapperClass = "formatted-content",
    preserveWhitespace = false,
  } = options;

  if (!html || typeof html !== "string") return "";

  let formatted = html.trim();

  // Sanitize first
  formatted = sanitizeHTML(formatted);

  // Preserve whitespace if needed
  if (!preserveWhitespace) {
    formatted = formatted.replace(/\s+/g, " ");
  }

  // Add wrapper div if requested
  if (addWrapper) {
    formatted = `<div class="${wrapperClass}">${formatted}</div>`;
  }

  return formatted;
};

/**
 * Converts plain text to HTML with line breaks
 * @param {string} text - Plain text string
 * @returns {string} - HTML string with <br> tags
 */
export const textToHTML = (text) => {
  if (!text || typeof text !== "string") return "";

  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, "<br>");
};

/**
 * Strips all HTML tags from a string
 * @param {string} html - HTML string
 * @returns {string} - Plain text without HTML tags
 */
export const stripHTML = (html) => {
  if (!html || typeof html !== "string") return "";

  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
};

/**
 * Truncates HTML content to a specified length while preserving tags
 * @param {string} html - HTML string
 * @param {number} maxLength - Maximum character length
 * @param {string} suffix - Suffix to add when truncated (default: '...')
 * @returns {string} - Truncated HTML string
 */
export const truncateHTML = (html, maxLength = 100, suffix = "...") => {
  if (!html || typeof html !== "string") return "";

  const plainText = stripHTML(html);

  if (plainText.length <= maxLength) {
    return html;
  }

  // Truncate plain text
  const truncatedText = plainText.substring(0, maxLength).trim() + suffix;

  return truncatedText;
};

/**
 * Formats backend response data that may contain HTML
 * @param {Object} data - Backend response data
 * @param {Array<string>} htmlFields - Array of field names that contain HTML
 * @returns {Object} - Formatted data object
 */
export const formatBackendHTML = (data, htmlFields = []) => {
  if (!data || typeof data !== "object") return data;

  const formatted = { ...data };

  htmlFields.forEach((field) => {
    if (formatted[field] && typeof formatted[field] === "string") {
      formatted[field] = formatHTML(formatted[field]);
    }
  });

  return formatted;
};

/**
 * Renders HTML safely in React components
 * Use with dangerouslySetInnerHTML
 * @param {string} html - HTML string
 * @returns {Object} - Object with __html property for React
 */
export const createMarkup = (html) => {
  return { __html: sanitizeHTML(html) };
};

/**
 * Formats rich text content from backend (common in CMS responses)
 * @param {string} richText - Rich text HTML from backend
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted HTML string
 */
export const formatRichText = (richText, options = {}) => {
  const {
    allowedTags = [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "a",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
    ],
    maxLength = null,
  } = options;

  if (!richText || typeof richText !== "string") return "";

  let formatted = sanitizeHTML(richText);

  // Remove tags not in allowedTags
  const temp = document.createElement("div");
  temp.innerHTML = formatted;

  const allElements = temp.querySelectorAll("*");
  allElements.forEach((element) => {
    if (!allowedTags.includes(element.tagName.toLowerCase())) {
      // Replace with text content
      const textNode = document.createTextNode(element.textContent);
      element.parentNode.replaceChild(textNode, element);
    }
  });

  formatted = temp.innerHTML;

  // Truncate if maxLength specified
  if (maxLength) {
    formatted = truncateHTML(formatted, maxLength);
  }

  return formatted;
};

/**
 * Formats HTML for display in forms (escapes HTML entities)
 * @param {string} html - HTML string
 * @returns {string} - Escaped HTML string safe for form inputs
 */
export const formatHTMLForForm = (html) => {
  if (!html || typeof html !== "string") return "";

  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Decodes HTML entities back to regular characters
 * @param {string} html - HTML string with entities
 * @returns {string} - Decoded string
 */
export const decodeHTMLEntities = (html) => {
  if (!html || typeof html !== "string") return "";

  const temp = document.createElement("textarea");
  temp.innerHTML = html;
  return temp.value;
};

/**
 * Validates if a string contains valid HTML
 * @param {string} html - String to validate
 * @returns {boolean} - True if valid HTML
 */
export const isValidHTML = (html) => {
  if (!html || typeof html !== "string") return false;

  try {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.innerHTML === html;
  } catch (e) {
    return false;
  }
};

/**
 * Extracts text content from HTML while preserving structure
 * @param {string} html - HTML string
 * @param {Object} options - Options for extraction
 * @returns {string} - Extracted text with preserved structure
 */
export const extractTextWithStructure = (html, options = {}) => {
  const { preserveLineBreaks = true, preserveParagraphs = true } = options;

  if (!html || typeof html !== "string") return "";

  const temp = document.createElement("div");
  temp.innerHTML = html;

  if (preserveParagraphs) {
    // Replace <p> tags with double line breaks
    html = html.replace(/<\/p>/gi, "\n\n");
    html = html.replace(/<p[^>]*>/gi, "");
  }

  if (preserveLineBreaks) {
    // Replace <br> tags with line breaks
    html = html.replace(/<br\s*\/?>/gi, "\n");
  }

  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
};

export default {
  sanitizeHTML,
  formatHTML,
  textToHTML,
  stripHTML,
  truncateHTML,
  formatBackendHTML,
  createMarkup,
  formatRichText,
  formatHTMLForForm,
  decodeHTMLEntities,
  isValidHTML,
  extractTextWithStructure,
};
