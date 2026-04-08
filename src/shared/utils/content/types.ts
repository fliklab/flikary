import type { CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

export interface Tag {
  tag: string;
  tagName: string;
  count: number;
}

export type GroupKey = string | number | symbol;

export interface GroupFunction<T> {
  (item: T, index?: number): GroupKey;
}
