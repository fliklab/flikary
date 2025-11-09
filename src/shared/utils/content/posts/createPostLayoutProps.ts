import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "../text";

export interface PostLayoutProps {
  title: string;
  author: string;
  description: string;
  pubDatetime: Date;
  modDatetime?: Date;
  canonicalURL?: string;
  ogImage?: string;
  scrollSmooth: boolean;
}

type SiteMeta = {
  title: string;
};

type OgImageField =
  | string
  | {
      src: string;
    }
  | undefined;

const resolveOgImageUrl = (
  ogImage: OgImageField,
  postTitle: string,
  siteOrigin: string
) => {
  const ogImageUrl = typeof ogImage === "string" ? ogImage : ogImage?.src;
  const fallbackPath = `/blog/${slugifyStr(postTitle)}.png`;

  return new URL(ogImageUrl ?? fallbackPath, siteOrigin).href;
};

export const createPostLayoutProps = (
  post: CollectionEntry<"blog">,
  site: SiteMeta,
  siteOrigin: string
): PostLayoutProps => {
  const {
    title,
    author,
    description,
    ogImage,
    canonicalURL,
    pubDatetime,
    modDatetime,
  } = post.data;

  return {
    title: `${title} | ${site.title}`,
    author,
    description,
    pubDatetime,
    modDatetime: modDatetime ?? undefined,
    canonicalURL,
    ogImage: resolveOgImageUrl(ogImage, title, siteOrigin),
    scrollSmooth: true,
  };
};
