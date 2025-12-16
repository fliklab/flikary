/**
 * 반응형 이미지 헬퍼 함수
 *
 * 이미지 매니페스트에서 srcset, sizes 등을 생성합니다.
 */

import { images } from "@generated/images.manifest";
import type { GeneratedImage, VariantName } from "@generated/images.types";

// ============================================================================
// Types
// ============================================================================

export interface ResponsiveImageProps {
  /** 기본 이미지 src (fallback) */
  src: string;
  /** srcset 문자열 */
  srcset?: string;
  /** sizes 문자열 */
  sizes?: string;
  /** 이미지 너비 */
  width?: number;
  /** 이미지 높이 */
  height?: number;
}

export interface GetResponsiveImageOptions {
  /** 사용할 variant 이름 */
  variant: VariantName;
  /** 선호하는 포맷 (기본: webp) */
  preferredFormat?: "webp" | "jpg" | "png" | "avif";
  /** sizes 속성 값 */
  sizes?: string;
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * 이미지 키 추출
 * - ImageMetadata.src에서 키 추출
 * - 문자열 경로에서 키 추출
 * - slug가 제공되면 slug + 파일명으로 키 생성
 */
export function extractImageKey(
  thumbnail: { src: string } | string | undefined,
  slug?: string
): string | null {
  if (!thumbnail) return null;

  const src = typeof thumbnail === "string" ? thumbnail : thumbnail.src;

  // slug가 제공된 경우: slug + 파일명으로 키 생성
  if (slug) {
    // Astro 빌드된 경로에서 파일명 추출: /_astro/filename.hash.ext → filename
    const astroMatch = src.match(/\/_astro\/([^.]+)\.[^.]+\.[^.]+$/);
    if (astroMatch) {
      return `${slug}/${astroMatch[1]}`;
    }

    // 상대 경로에서 파일명 추출: ./images/thumb.webp → thumb
    const relativeMatch = src.match(/\.\/images\/([^.]+)\.[^.]+$/);
    if (relativeMatch) {
      return `${slug}/${relativeMatch[1]}`;
    }
  }

  // 블로그 이미지 패턴: /_astro/thumb.xxxxx.webp 또는 /images/slug/thumb.webp
  // src/content/blog/my-post/images/thumb.webp → my-post/thumb

  // Astro 빌드된 경로에서 추출 시도 (slug 없는 경우 - fallback)
  const astroMatch = src.match(/\/_astro\/([^.]+)\.[^.]+\.[^.]+$/);
  if (astroMatch) {
    return astroMatch[1];
  }

  // 상대 경로에서 추출: ./images/thumb.webp → thumb
  const relativeMatch = src.match(/\.\/images\/([^.]+)\.[^.]+$/);
  if (relativeMatch) {
    return relativeMatch[1];
  }

  // content/blog 패턴에서 추출
  const blogMatch = src.match(/content\/blog\/([^/]+)\/images\/([^.]+)\.[^.]+/);
  if (blogMatch) {
    return `${blogMatch[1]}/${blogMatch[2]}`;
  }

  return null;
}

/**
 * 특정 포맷의 이미지만 필터링
 */
function filterByFormat(
  images: GeneratedImage[],
  format: string
): GeneratedImage[] {
  return images.filter((img) => img.format === format);
}

/**
 * srcset 문자열 생성
 */
function buildSrcset(images: GeneratedImage[]): string {
  return images.map((img) => `${img.src} ${img.width}w`).join(", ");
}

/**
 * 가장 큰 이미지 선택 (fallback용)
 */
function getLargestImage(images: GeneratedImage[]): GeneratedImage | undefined {
  return images.reduce<GeneratedImage | undefined>((largest, img) => {
    if (!largest || img.width > largest.width) return img;
    return largest;
  }, undefined);
}

// ============================================================================
// Main API
// ============================================================================

/**
 * 반응형 이미지 속성 가져오기
 *
 * @example
 * const imgProps = getResponsiveImage("my-post/thumb", {
 *   variant: "card",
 *   sizes: "(max-width: 768px) 64px, 96px"
 * });
 * // { src: "...", srcset: "...", sizes: "...", width: 192, height: 192 }
 */
export function getResponsiveImage(
  imageKey: string,
  options: GetResponsiveImageOptions
): ResponsiveImageProps | null {
  const { variant, preferredFormat = "webp", sizes } = options;

  const imageVariants = images[imageKey];
  if (!imageVariants) return null;

  const variantImages = imageVariants[variant];
  if (!variantImages || variantImages.length === 0) return null;

  // 선호하는 포맷으로 필터링
  let formatImages = filterByFormat(variantImages, preferredFormat);

  // 선호하는 포맷이 없으면 첫 번째 사용 가능한 포맷 사용
  if (formatImages.length === 0) {
    const availableFormat = variantImages[0]?.format;
    if (availableFormat) {
      formatImages = filterByFormat(variantImages, availableFormat);
    }
  }

  if (formatImages.length === 0) return null;

  const largest = getLargestImage(formatImages);
  if (!largest) return null;

  return {
    src: largest.src,
    srcset: formatImages.length > 1 ? buildSrcset(formatImages) : undefined,
    sizes: formatImages.length > 1 ? sizes : undefined,
    width: largest.width,
    height: largest.height,
  };
}

/**
 * 썸네일에서 반응형 이미지 속성 가져오기
 *
 * @example
 * const imgProps = getResponsiveImageFromThumbnail(post.data.thumbnail, {
 *   variant: "card",
 *   sizes: "96px"
 * });
 */
export function getResponsiveImageFromThumbnail(
  thumbnail: { src: string } | string | undefined,
  options: GetResponsiveImageOptions
): ResponsiveImageProps | null {
  const imageKey = extractImageKey(thumbnail);
  if (!imageKey) return null;

  return getResponsiveImage(imageKey, options);
}

/**
 * 간단한 이미지 src 가져오기 (srcset 없이)
 */
export function getOptimizedImageSrc(
  imageKey: string,
  variant: VariantName,
  preferredFormat: "webp" | "jpg" = "webp"
): string | null {
  const result = getResponsiveImage(imageKey, { variant, preferredFormat });
  return result?.src ?? null;
}

// ============================================================================
// Presets (자주 사용하는 sizes 값)
// ============================================================================

export const SIZES_PRESETS = {
  /** ArticleCard 썸네일: 72-96px (DPR 대응) */
  card: "(max-width: 480px) 64px, 96px",

  /** FeaturedArticleCard: 반응형 */
  featured: "(max-width: 480px) 100vw, (max-width: 640px) 100px, 200px",

  /** 블로그 본문 이미지: 전체 너비 */
  content: "(max-width: 800px) 100vw, 800px",
} as const;

// ============================================================================
// React Component Helper
// ============================================================================

/**
 * ResponsiveImage 컴포넌트용 props 생성
 */
export function createImageProps(
  imageKey: string | null,
  variant: VariantName,
  fallbackSrc?: string
): React.ImgHTMLAttributes<HTMLImageElement> {
  if (!imageKey) {
    return fallbackSrc ? { src: fallbackSrc } : {};
  }

  const responsive = getResponsiveImage(imageKey, {
    variant,
    sizes: SIZES_PRESETS[variant as keyof typeof SIZES_PRESETS],
  });

  if (!responsive) {
    return fallbackSrc ? { src: fallbackSrc } : {};
  }

  return {
    src: responsive.src,
    srcSet: responsive.srcset,
    sizes: responsive.sizes,
    width: responsive.width,
    height: responsive.height,
  };
}
