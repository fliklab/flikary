import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import type { FeedEmbedRef } from "../feed";
import { getFeedComputedMeta } from "../feed/getFeedComputedMeta";
import type { EmbeddedEntryPreviewData } from "./types";

const resolvePreviewImageUrl = (
  entry: CollectionEntry<"blog"> | CollectionEntry<"feed">
) => {
  const image = entry.data.ogImage ?? entry.data.thumbnail;
  if (!image) {
    return entry.collection === "feed"
      ? `/feed/${entry.slug}.png`
      : `/blog/${entry.slug}.png`;
  }

  return typeof image === "string" ? image : image.src;
};

export const buildEntryPreview = async (
  embed: FeedEmbedRef
): Promise<EmbeddedEntryPreviewData> => {
  const collectionEntries = await getCollection(embed.collection);
  const entry = collectionEntries.find(item => item.slug === embed.slug);

  if (!entry) {
    throw new Error(
      `Embedded ${embed.collection} entry not found for slug "${embed.slug}"`
    );
  }

  if (embed.collection === "feed") {
    const computed = getFeedComputedMeta(entry);

    return {
      kind: "feed",
      slug: entry.slug,
      href: `/feed/${entry.slug}/`,
      title: computed.resolvedTitle,
      description: computed.resolvedDescription,
      ogImage: resolvePreviewImageUrl(entry),
    };
  }

  return {
    kind: "blog",
    slug: entry.slug,
    href: `/blog/${entry.slug}/`,
    title: entry.data.title,
    description: entry.data.description,
    ogImage: resolvePreviewImageUrl(entry),
  };
};
