import { getCollection } from "astro:content";
import getSortedPosts from "@utils/getSortedPosts";
import { SITE } from "@config";

export async function GET() {
  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts);
  const items = sortedPosts.map(({ data, slug }) => ({
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
