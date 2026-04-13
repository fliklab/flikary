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
    width: 320,
    widths: [320, 480, 640],
    sizes: "(max-width: 768px) 100vw, 320px",
  },
  featured: {
    width: 640,
    widths: [480, 640, 960],
    sizes: "(max-width: 768px) 100vw, 640px",
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
