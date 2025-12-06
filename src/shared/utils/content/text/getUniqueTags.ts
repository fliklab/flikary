import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";
import { slugifyStr } from "./slugify";

export interface Tag {
  tag: string;
  tagName: string;
  count: number;
}

/**
 * 블로그 포스트에서 고유 태그 목록을 추출
 * @param posts - 블로그 포스트 컬렉션
 * @param sortBy - 정렬 기준 ('count': 빈도수 내림차순, 'name': 이름 오름차순)
 * @returns 태그 목록 (태그명, 슬러그, 빈도수 포함)
 */
export const getUniqueTags = (
  posts: CollectionEntry<"blog">[],
  sortBy: "count" | "name" = "name"
): Tag[] => {
  // 태그별 빈도수 계산
  const tagCountMap = new Map<string, { tagName: string; count: number }>();

  posts.filter(postFilter).forEach(post => {
    post.data.tags.forEach((tagName: string) => {
      const slug = slugifyStr(tagName);
      const existing = tagCountMap.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        tagCountMap.set(slug, { tagName, count: 1 });
      }
    });
  });

  // Map을 배열로 변환
  const tags: Tag[] = Array.from(tagCountMap.entries()).map(
    ([tag, { tagName, count }]) => ({
      tag,
      tagName,
      count,
    })
  );

  // 정렬
  if (sortBy === "count") {
    // 빈도수 내림차순, 동일 빈도수면 이름 오름차순
    return tags.sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.tag.localeCompare(b.tag);
    });
  }

  // 이름 오름차순 (기본)
  return tags.sort((a, b) => a.tag.localeCompare(b.tag));
};
