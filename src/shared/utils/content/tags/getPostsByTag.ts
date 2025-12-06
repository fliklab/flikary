import type { CollectionEntry } from "astro:content";
import { getSortedPosts } from "../text/getSortedPosts";
import { slugifyAll } from "../text/slugify";

export const getPostsByTag = (posts: CollectionEntry<"blog">[], tag: string) =>
  getSortedPosts(
    posts.filter(post => slugifyAll(post.data.tags).includes(tag))
  );
