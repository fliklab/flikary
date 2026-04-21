import { generateOgImageForPost } from "@utils/og/generator";
import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";

export async function getStaticPaths() {
  const entries = await getCollection("feed").then(
    (items: CollectionEntry<"feed">[]) =>
      items.filter(
        ({ data }: CollectionEntry<"feed">) => !data.draft && !data.ogImage
      )
  );

  return entries.map(entry => ({
    params: { slug: entry.slug },
    props: entry,
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const png = await generateOgImageForPost(props as CollectionEntry<"feed">);
  const buffer = new ArrayBuffer(png.byteLength);
  new Uint8Array(buffer).set(png);

  return new Response(buffer, {
    headers: { "Content-Type": "image/png" },
  });
};
