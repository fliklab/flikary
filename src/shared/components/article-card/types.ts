import type { CollectionEntry } from "astro:content";

export interface ArticleCardProps {
  href?: string;
  frontmatter: CollectionEntry<"blog">["data"];
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
  modDatetime?: Date
): string => {
  const dateToUse =
    modDatetime && modDatetime > pubDatetime ? modDatetime : pubDatetime;
  return formatCardDate(dateToUse);
};

