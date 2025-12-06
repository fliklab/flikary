import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { getSortedPosts } from "@utils/content/text";
import { SITE } from "@config";
import { getThumbnailSrc, getDisplayDate } from "@shared/components/article-card/types";

// SSR 모드로 설정하여 쿼리 파라미터 처리 가능하게 함
export const prerender = false;

export interface PostItem {
  slug: string;
  title: string;
  description?: string;
  pubDatetime: string;
  formattedDate: string;
  tags: string[];
  thumbnail?: string;
  ulternativeUrl?: string;
}

export interface PostsResponse {
  posts: PostItem[];
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
}

const PAGE_SIZE = SITE.postPerPage;

export const GET: APIRoute = async ({ url }) => {
  const cursor = url.searchParams.get("cursor");
  const tag = url.searchParams.get("tag");
  const limit = Math.min(
    parseInt(url.searchParams.get("limit") || String(PAGE_SIZE), 10),
    50
  );

  // Get all posts
  const allPosts = await getCollection("blog", ({ data }: CollectionEntry<"blog">) => !data.draft);
  let sortedPosts = getSortedPosts(allPosts);

  // Filter by tag if provided
  if (tag) {
    sortedPosts = sortedPosts.filter((post) =>
      post.data.tags?.some((t: string) => t.toLowerCase() === tag.toLowerCase())
    );
  }

  const total = sortedPosts.length;

  // Find cursor index
  let startIndex = 0;
  if (cursor) {
    const cursorIndex = sortedPosts.findIndex((post) => post.slug === cursor);
    if (cursorIndex !== -1) {
      startIndex = cursorIndex + 1;
    }
  }

  // Get posts for current page
  const paginatedPosts = sortedPosts.slice(startIndex, startIndex + limit);
  const hasMore = startIndex + limit < total;
  const nextCursor = hasMore ? paginatedPosts[paginatedPosts.length - 1]?.slug : null;

  // Transform posts to serializable format
  const posts: PostItem[] = paginatedPosts.map((post) => ({
    slug: post.slug,
    title: post.data.title,
    description: post.data.description,
    pubDatetime: post.data.pubDatetime.toISOString(),
    formattedDate: getDisplayDate(post.data.pubDatetime, post.data.modDatetime ?? undefined),
    tags: post.data.tags || [],
    thumbnail: getThumbnailSrc(post.data.thumbnail),
    ulternativeUrl: post.data.ulternativeUrl,
  }));

  const response: PostsResponse = {
    posts,
    nextCursor,
    hasMore,
    total,
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=60",
    },
  });
};
