// export function extractFirstParagraph(htmlString) {
//   if (typeof htmlString !== "string") return "";

//   // Try to match the content of the first <p> tag
//   const match = htmlString.match(/<p[^>]*>(.*?)<\/p>/is);

//   if (match && match[1]) {
//     // Strip all HTML tags from the paragraph content
//     return match[1].replace(/<[^>]+>/g, "").trim();
//   }

//   // If no <p> tag found, fallback to stripping all tags and returning the string
//   return htmlString.replace(/<[^>]+>/g, "").trim();
// }

export function extractFirstParagraph(htmlString) {
  if (typeof htmlString !== "string") return "";

  // Extract <p> contents if they exist
  const paragraphMatches = htmlString.match(/<p[^>]*>[\s\S]*?<\/p>/gi);

  let text = "";

  if (paragraphMatches?.length) {
    text = paragraphMatches
      .map(p => p.replace(/<[^>]+>/g, "").trim())
      .join("\n\n"); // keep paragraph spacing
  } else {
    // Fallback: strip all HTML
    text = htmlString.replace(/<[^>]+>/g, "").trim();
  }

  // Split into lines (by newlines or sentence breaks)
  const lines = text
    .split(/\r?\n+/)
    .flatMap(line =>
      line
        .split(/(?<=[.!?])\s+/) // sentence-aware split
        .filter(Boolean)
    );

  // Return only first 12 lines
  return lines.slice(0, 5).join("\n");
}