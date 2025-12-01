import type { APIRoute } from "astro";
import { generateOgImageForSite } from "@utils/generateOgImages";

export const GET: APIRoute = async () => {
  const png = await generateOgImageForSite();
  const buffer = new ArrayBuffer(png.byteLength);
  new Uint8Array(buffer).set(png);
  return new Response(buffer, {
    headers: { "Content-Type": "image/png" },
  });
};
