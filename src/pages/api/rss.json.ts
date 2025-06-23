import { getCollection } from "astro:content";
import getSortedPosts from "@utils/getSortedPosts";
import { SITE } from "@config";
import type { APIContext } from "astro";

export async function GET({ request }: APIContext) {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit") ?? "5", 10);
  const tag = url.searchParams.get("tag");

  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts);
  let filteredPosts = sortedPosts;
  if (tag) {
    filteredPosts = filteredPosts.filter(({ data }) =>
      data.tags?.includes(tag)
    );
  }
  const items = filteredPosts.slice(0, limit).map(({ data, slug }) => ({
    slug,
    link: `${SITE.website}blog/${slug}/`,
    title: data.title,
    description: data.description,
    pubDate: data.pubDatetime,
    modDate: data.modDatetime,
    author: data.author,
    tags: data.tags,
    ogImage: data.ogImage,
    canonicalURL: data.canonicalURL,
  }));
  return new Response(
    JSON.stringify({
      title: SITE.title,
      description: SITE.desc,
      site: SITE.website,
      items,
    }),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=600",
      },
    }
  );
}
