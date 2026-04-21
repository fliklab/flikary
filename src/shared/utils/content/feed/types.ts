import type { CollectionEntry } from "astro:content";
import type { EmbeddedEntryPreviewData } from "../entry-preview/types";

export type FeedEntry = CollectionEntry<"feed">;

export type FeedEmbedRef = NonNullable<FeedEntry["data"]["embeds"]>[number];

export interface ComputedFeedMeta {
  resolvedTitle: string;
  resolvedDescription: string;
  previewText: string;
  showTitleInFeed: boolean;
  hasExplicitTitle: boolean;
  hasExplicitDescription: boolean;
}

export interface FeedItemViewModel {
  slug: string;
  href: string;
  resolvedTitle: string;
  previewText: string;
  showTitleInFeed: boolean;
  dateLabel: string;
  series?: string;
  hasMoreLink: boolean;
  tags: string[];
  pubDatetime: Date;
  modDatetime?: Date | null;
  embeds: EmbeddedEntryPreviewData[];
}
