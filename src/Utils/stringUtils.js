export function extractFirstParagraph(htmlString) {
  if (typeof htmlString !== "string") return "";

  // Try to match the content of the first <p> tag
  const match = htmlString.match(/<p[^>]*>(.*?)<\/p>/is);

  if (match && match[1]) {
    // Strip all HTML tags from the paragraph content
    return match[1].replace(/<[^>]+>/g, "").trim();
  }

  // If no <p> tag found, fallback to stripping all tags and returning the string
  return htmlString.replace(/<[^>]+>/g, "").trim();
}
