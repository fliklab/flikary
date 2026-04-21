const PREVIEW_FALLBACK = "내용이 없습니다.";

const stripCodeFences = (content: string) =>
  content.replace(/```[\s\S]*?```/g, " ");

const stripInlineCode = (content: string) =>
  content.replace(/`([^`]+)`/g, "$1");

const stripImageLines = (content: string) =>
  content
    .replace(/^\s*!\[[^\]]*\]\([^)]+\)\s*$/gm, " ")
    .replace(/^\s*<img[\s\S]*?\/?>\s*$/gim, " ")
    .replace(/^\s*<(BlogImage|Image|Picture|Figure)[^>]*\/?>\s*$/gm, " ")
    .replace(/^\s*<(BlogImage|Image|Picture|Figure)[^>]*>[\s\S]*?<\/\1>\s*$/gm, " ");

const stripImages = (content: string) =>
  content.replace(/!\[[^\]]*\]\([^)]+\)/g, " ");

const stripImageTags = (content: string) =>
  content
    .replace(/<img[\s\S]*?\/?>/gim, " ")
    .replace(/<(BlogImage|Image|Picture|Figure)[^>]*\/?>/gm, " ")
    .replace(/<(BlogImage|Image|Picture|Figure)[^>]*>[\s\S]*?<\/\1>/gm, " ");

const stripLinks = (content: string) =>
  content.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

const stripMdMarkers = (content: string) =>
  content
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s{0,3}>\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1");

const normalizeWhitespace = (content: string) =>
  content
    .replace(/\r\n/g, "\n")
    // Keep at most two visual blank lines between paragraphs.
    .replace(/\n{4,}/g, "\n\n\n")
    .replace(/[ \t]+/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .trim();

export const getFeedPreviewText = (content: string | undefined | null) => {
  if (!content) {
    return PREVIEW_FALLBACK;
  }

  const normalized = normalizeWhitespace(
    stripMdMarkers(
      stripLinks(
        stripImages(
          stripImageTags(stripImageLines(stripInlineCode(stripCodeFences(content))))
        )
      )
    )
  );

  return normalized || PREVIEW_FALLBACK;
};
