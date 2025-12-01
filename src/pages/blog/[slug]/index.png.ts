import { generateOgImageForPost } from "@utils/og/generator";
import { slugifyStr } from "@utils/content/text";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import type { BlogPost } from "types";

export async function getStaticPaths() {
  const posts = await getCollection("blog").then(p =>
    p.filter(({ data }) => !data.draft && !data.ogImage)
  );

  return posts.map(post => ({
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
