import { Resvg } from "@resvg/resvg-js";
import { type CollectionEntry } from "astro:content";
import postOgImage from "@utils/og/templates/post";
import siteOgImage from "@utils/og/templates/site";

function svgBufferToPngBuffer(svg: string): Uint8Array {
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  // Ensure we return a plain Uint8Array (not Node Buffer type)
  return new Uint8Array(pngData.asPng());
}

export async function generateOgImageForPost(
  post: CollectionEntry<"blog">
): Promise<Uint8Array> {
  const svg = await postOgImage(post);
  return svgBufferToPngBuffer(svg);
}

export async function generateOgImageForSite(): Promise<Uint8Array> {
  const svg = await siteOgImage();
  return svgBufferToPngBuffer(svg);
}
