import type { FeedEntry, FeedItemViewModel } from "./types";
import { getFeedComputedMeta } from "./getFeedComputedMeta";
import { buildEntryPreview } from "../entry-preview/buildEntryPreview";

export const buildFeedItemViewModel = async (
  entry: FeedEntry
): Promise<FeedItemViewModel> => {
  const computed = getFeedComputedMeta(entry);
  const embeds = await Promise.all(
    (entry.data.embeds ?? []).map(embed => buildEntryPreview(embed))
  );

  return {
    slug: entry.slug,
    href: `/feed/${entry.slug}/`,
    resolvedTitle: computed.resolvedTitle,
    previewText: computed.previewText,
    showTitleInFeed: computed.showTitleInFeed,
    tags: entry.data.tags ?? [],
    pubDatetime: entry.data.pubDatetime,
    modDatetime: entry.data.modDatetime,
    embeds,
  };
};
