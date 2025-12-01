import type { CollectionEntry } from "astro:content";

export interface AdjacentPostSummary {
  slug: string;
  title: string;
}

export interface AdjacentPosts {
  previous: AdjacentPostSummary | null;
  next: AdjacentPostSummary | null;
}

export const getAdjacentPosts = (
  posts: CollectionEntry<"blog">[],
  currentSlug: string
): AdjacentPosts => {
  if (!posts.length) {
    return { previous: null, next: null };
  }

  const currentIndex = posts.findIndex((post) => post.slug === currentSlug);

  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  const previous =
    currentIndex > 0
      ? {
          slug: posts[currentIndex - 1].slug,
          title: posts[currentIndex - 1].data.title,
        }
      : null;

  const next =
    currentIndex < posts.length - 1
      ? {
          slug: posts[currentIndex + 1].slug,
          title: posts[currentIndex + 1].data.title,
        }
      : null;

  return { previous, next };
};


