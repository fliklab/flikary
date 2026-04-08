import type { CollectionEntry } from "astro:content";
import { getSortedPosts } from "../text/getSortedPosts";
import { slugifyStr } from "../text/slugify";
import { normalizeTag } from "./normalizeTag";

export const getPostsByTag = (posts: CollectionEntry<"blog">[], tag: string) =>
  getSortedPosts(
    posts.filter(post =>
      post.data.tags
        .map((t: string) => slugifyStr(normalizeTag(t)))
        .includes(tag)
    )
  );
