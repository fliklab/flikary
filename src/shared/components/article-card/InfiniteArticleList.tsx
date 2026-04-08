import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// 한번에 fade-in 애니메이션 variants
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

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
  // 새로 로드된 포스트의 시작 인덱스 추적
  const [newPostsStartIndex, setNewPostsStartIndex] = useState(0);

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

      const newPosts: InitialPost[] = data.posts.map(post => ({
        slug: post.slug,
        data: transformPostToFrontmatter(post),
      }));

      setPosts(prev => {
        setNewPostsStartIndex(prev.length); // 새 포스트 시작 인덱스 저장
        return [...prev, ...newPosts];
      });
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
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchMorePosts();
        }
      },
      {
        rootMargin: "100px", // 더 낮은 위치에서 트리거
        threshold: 0,
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
        <AnimatePresence mode="popLayout">
          {posts.map(({ slug, data }, index) => {
            // 새로 로드된 포스트만 애니메이션 적용
            const isNewPost = index >= newPostsStartIndex;

            return (
              <motion.div
                key={slug}
                variants={itemVariants}
                initial={isNewPost ? "hidden" : false}
                animate="visible"
                layout
              >
                <ArticleCard href={`/blog/${slug}/`} frontmatter={data} />
              </motion.div>
            );
          })}
        </AnimatePresence>

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
        <motion.div
          className="end-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <span className="end-icon">~</span>
          <p>모든 글을 불러왔습니다</p>
        </motion.div>
      )}
    </div>
  );
}
