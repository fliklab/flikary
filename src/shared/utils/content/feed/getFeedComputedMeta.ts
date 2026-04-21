import type { FeedEntry, ComputedFeedMeta } from "./types";
import { getFeedPreviewText } from "./getFeedPreviewText";

const formatFeedFallbackTitle = (pubDatetime: Date) => {
  const date = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
  }).format(pubDatetime);
  return `${date}의 기록`;
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}...`;
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const stripLeadingTitleLine = (text: string, title?: string) => {
  const normalizedTitle = title?.trim();
  if (!normalizedTitle) return text;

  return text
    .replace(new RegExp(`^${escapeRegExp(normalizedTitle)}\\n+`, "i"), "")
    .trim();
};

export const getFeedComputedMeta = (entry: FeedEntry): ComputedFeedMeta => {
  const previewFromBody = stripLeadingTitleLine(
    getFeedPreviewText(entry.body),
    entry.data.title
  );
  const hasExplicitTitle = Boolean(entry.data.title?.trim());
  const hasExplicitDescription = Boolean(entry.data.description?.trim());
  const resolvedTitle =
    entry.data.title?.trim() || formatFeedFallbackTitle(entry.data.pubDatetime);
  const previewText = previewFromBody;
  const resolvedDescription = hasExplicitDescription
    ? entry.data.description!.trim()
    : truncateText(previewFromBody, 180);

  return {
    resolvedTitle,
    resolvedDescription,
    previewText,
    showTitleInFeed: hasExplicitTitle,
    hasExplicitTitle,
    hasExplicitDescription,
  };
};
