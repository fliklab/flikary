import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";

const MS_PER_SECOND = 1000;

const getPostTimestamp = (post: CollectionEntry<"blog">): number => {
  const datetime = post.data.modDatetime ?? post.data.pubDatetime;
  return Math.floor(new Date(datetime).getTime() / MS_PER_SECOND);
};

export const getSortedPosts = (posts: CollectionEntry<"blog">[]) => {
  return posts
    .filter(postFilter)
    .sort((a, b) => getPostTimestamp(b) - getPostTimestamp(a));
};
