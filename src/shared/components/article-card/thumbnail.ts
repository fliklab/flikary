import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";

export interface ThumbnailImageData {
  src: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
}

interface ThumbnailOptions {
  size: "card" | "featured";
}

const THUMBNAIL_PRESETS = {
  card: {
    width: 96,
    widths: [96, 192, 288],
    sizes: "(max-width: 480px) 64px, 96px",
  },
  featured: {
    width: 200,
    widths: [200, 400, 800, 960],
    sizes: "(max-width: 479px) 100vw, (max-width: 640px) 100px, 200px",
  },
} as const;

export const buildThumbnailImage = async (
  thumbnail: ImageMetadata | string | undefined,
  options: ThumbnailOptions
): Promise<ThumbnailImageData | undefined> => {
  if (!thumbnail) return undefined;

  if (typeof thumbnail === "string") {
    return { src: thumbnail };
  }

  const preset = THUMBNAIL_PRESETS[options.size];
  const result = await getImage({
    src: thumbnail,
    width: preset.width,
    widths: preset.widths,
    sizes: preset.sizes,
    format: "webp",
    quality: "mid",
  });

  return {
    src: result.src,
    srcSet: result.srcSet.attribute,
    sizes: preset.sizes,
    width: Number(result.attributes.width),
    height: Number(result.attributes.height),
  };
};
