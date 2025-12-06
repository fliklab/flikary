import type { CollectionEntry } from "astro:content";
import type { GroupKey, GroupFunction } from "../types";

export type { GroupKey, GroupFunction };

export const getPostsByGroupCondition = (
  posts: CollectionEntry<"blog">[],
  groupFunction: GroupFunction<CollectionEntry<"blog">>
) => {
  const result: Record<GroupKey, CollectionEntry<"blog">[]> = {};
  for (let i = 0; i < posts.length; i++) {
    const item = posts[i];
    const groupKey = groupFunction(item, i);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
  }
  return result;
};
