import { generateOgImageForPost } from "@utils/og/generator";
import { slugifyStr } from "@utils/content/text";
import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import type { BlogPost } from "types";

export async function getStaticPaths() {
  const posts = await getCollection("blog").then(
    (p: CollectionEntry<"blog">[]) =>
      p.filter(
        ({ data }: CollectionEntry<"blog">) => !data.draft && !data.ogImage
      )
  );

  return posts.map((post: CollectionEntry<"blog">) => ({
    params: { slug: slugifyStr(post.data.title) },
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
