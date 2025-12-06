import { useState, useEffect, useRef, useCallback } from "react";
import ArticleCard from "./ArticleCard";
import ArticleCardSkeleton from "./ArticleCardSkeleton";
import type { PostItem, PostsResponse } from "@pages/api/posts.json";
import type { ArticleFrontmatter } from "./types";

interface InitialPost {
  slug: string;
  data: ArticleFrontmatter;
}

interface InfiniteArticleListProps {
  initialPosts: InitialPost[];
  initialCursor: string | null;
  initialHasMore: boolean;
  tag?: string;
}

function transformPostToFrontmatter(post: PostItem): ArticleFrontmatter {
  return {
    title: post.title,
    description: post.description,
    pubDatetime: new Date(post.pubDatetime),
    tags: post.tags,
    thumbnail: post.thumbnail,
    ulternativeUrl: post.ulternativeUrl,
    author: "",
  };
}

export default function InfiniteArticleList({
  initialPosts,
  initialCursor,
  initialHasMore,
  tag,
}: InfiniteArticleListProps) {
  const [posts, setPosts] = useState<InitialPost[]>(initialPosts);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchMorePosts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (cursor) params.set("cursor", cursor);
      if (tag) params.set("tag", tag);

      const response = await fetch(`/api/posts.json?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data: PostsResponse = await response.json();

      const newPosts: InitialPost[] = data.posts.map((post) => ({
        slug: post.slug,
        data: transformPostToFrontmatter(post),
      }));

      setPosts((prev) => [...prev, ...newPosts]);
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  }, [cursor, hasMore, isLoading, tag]);

  useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (!currentRef) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchMorePosts();
        }
      },
      {
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    observerRef.current.observe(currentRef);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchMorePosts, hasMore, isLoading]);

  return (
    <div className="infinite-article-list">
      <ul className="article-list">
        {posts.map(({ slug, data }) => (
          <ArticleCard
            key={slug}
            href={`/blog/${slug}/`}
            frontmatter={data}
          />
        ))}

        {isLoading && <ArticleCardSkeleton count={3} />}
      </ul>

      {error && (
        <div className="load-error">
          <p>{error}</p>
          <button onClick={fetchMorePosts} className="retry-btn">
            다시 시도
          </button>
        </div>
      )}

      {hasMore && !isLoading && (
        <div ref={loadMoreRef} className="load-trigger" aria-hidden="true" />
      )}

      {!hasMore && posts.length > 0 && (
        <div className="end-message">
          <span className="end-icon">~</span>
          <p>모든 글을 불러왔습니다</p>
        </div>
      )}
    </div>
  );
}
