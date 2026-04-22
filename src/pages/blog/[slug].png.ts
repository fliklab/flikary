import { generateOgImageForPost } from "@utils/og/generator";
import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import type { BlogPost } from "types";

export async function getStaticPaths() {
  const posts = await getCollection("blog").then(
    (items: CollectionEntry<"blog">[]) =>
      items.filter(
        ({ data }: CollectionEntry<"blog">) => !data.draft && !data.ogImage
      )
  );

  return posts.map((post: CollectionEntry<"blog">) => ({
    params: { slug: post.slug },
    props: post,
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const png = await generateOgImageForPost(props as BlogPost);
  const buffer = new ArrayBuffer(png.byteLength);
  new Uint8Array(buffer).set(png);

  return new Response(buffer, {
    headers: { "Content-Type": "image/png" },
  });
};
