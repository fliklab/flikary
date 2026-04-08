import type { CollectionEntry } from "astro:content";
import type { ImageMetadata } from "astro";

export type ArticleFrontmatter = CollectionEntry<"blog">["data"];

export interface ArticleCardProps {
  href?: string;
  frontmatter: ArticleFrontmatter;
  secHeading?: boolean;
}

export interface FeaturedArticleCardProps extends ArticleCardProps {
  slug: string;
}

export const formatCardDate = (value: string | Date): string => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

export const getDisplayDate = (
  pubDatetime: Date,
  modDatetime?: Date | null
): string => {
  const dateToUse =
    modDatetime && modDatetime > pubDatetime ? modDatetime : pubDatetime;
  return formatCardDate(dateToUse);
};

/**
 * thumbnail 필드에서 이미지 src를 추출
 * - ImageMetadata 객체인 경우 src 반환
 * - string인 경우 그대로 반환
 * - 없으면 undefined 반환
 */
export const getThumbnailSrc = (
  thumbnail?: ImageMetadata | string
): string | undefined => {
  if (!thumbnail) return undefined;
  if (typeof thumbnail === "string") return thumbnail;
  return thumbnail.src;
};
