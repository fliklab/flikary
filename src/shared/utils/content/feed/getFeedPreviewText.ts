const PREVIEW_FALLBACK = "내용이 없습니다.";

const stripCodeFences = (content: string) =>
  content.replace(/```[\s\S]*?```/g, " ");

const stripInlineCode = (content: string) =>
  content.replace(/`([^`]+)`/g, "$1");

const stripImages = (content: string) =>
  content.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1");

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
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();

export const getFeedPreviewText = (content: string | undefined | null) => {
  if (!content) {
    return PREVIEW_FALLBACK;
  }

  const normalized = normalizeWhitespace(
    stripMdMarkers(stripLinks(stripImages(stripInlineCode(stripCodeFences(content)))))
  );

  return normalized || PREVIEW_FALLBACK;
};
