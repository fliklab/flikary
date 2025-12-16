/**
 * OptimizedImage - 최적화된 반응형 이미지 컴포넌트
 *
 * <picture> + <source>를 사용하여 포맷별 fallback과 srcset을 처리합니다.
 *
 * @example
 * // 매니페스트 키로 사용
 * <OptimizedImage
 *   imageKey="my-post/thumb"
 *   variant="card"
 *   alt="Thumbnail"
 *   className="thumbnail"
 * />
 *
 * // 또는 썸네일 객체로 사용
 * <OptimizedImage
 *   thumbnail={post.data.thumbnail}
 *   variant="featured"
 *   alt=""
 * />
 *
 * // fallback src와 함께 사용 (매니페스트에 없을 때)
 * <OptimizedImage
 *   imageKey="some-key"
 *   variant="card"
 *   fallbackSrc="/images/default.jpg"
 *   alt=""
 * />
 */

import { useMemo } from "react";
import { images } from "@generated/index";
import type { GeneratedImage, VariantName } from "@generated/images.types";
import { extractImageKey, SIZES_PRESETS } from "@shared/utils/responsive-image";

// ============================================================================
// Types
// ============================================================================

interface OptimizedImageBaseProps {
  /** 사용할 variant 이름 */
  variant: VariantName;
  /** alt 텍스트 (접근성) */
  alt: string;
  /** CSS 클래스 */
  className?: string;
  /** 지연 로딩 여부 */
  loading?: "lazy" | "eager";
  /** sizes 속성 (자동 설정됨, 덮어쓰기 가능) */
  sizes?: string;
  /** 매니페스트에 없을 때 사용할 fallback src */
  fallbackSrc?: string;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 블로그 포스트 slug (이미지 키 생성에 사용) */
  slug?: string;
}

interface OptimizedImageWithKeyProps extends OptimizedImageBaseProps {
  /** 이미지 매니페스트 키 */
  imageKey: string;
  thumbnail?: never;
}

interface OptimizedImageWithThumbnailProps extends OptimizedImageBaseProps {
  /** 썸네일 객체 (ImageMetadata 또는 string) */
  thumbnail: { src: string } | string | undefined;
  imageKey?: never;
}

export type OptimizedImageProps =
  | OptimizedImageWithKeyProps
  | OptimizedImageWithThumbnailProps;

// ============================================================================
// Helpers
// ============================================================================

interface SourceSet {
  format: string;
  mimeType: string;
  srcset: string;
  images: GeneratedImage[];
}

/**
 * 포맷별로 그룹화하고 srcset 생성
 */
function buildSourceSets(variantImages: GeneratedImage[]): SourceSet[] {
  const formatGroups: Record<string, GeneratedImage[]> = {};

  for (const img of variantImages) {
    if (!formatGroups[img.format]) {
      formatGroups[img.format] = [];
    }
    formatGroups[img.format].push(img);
  }

  // 포맷 우선순위: webp > avif > jpg > png
  const formatOrder = ["webp", "avif", "jpg", "png"];

  return formatOrder
    .filter((format) => formatGroups[format])
    .map((format) => {
      const imgs = formatGroups[format].sort((a, b) => a.width - b.width);
      return {
        format,
        mimeType: getMimeType(format),
        srcset: imgs.map((img) => `${img.src} ${img.width}w`).join(", "),
        images: imgs,
      };
    });
}

function getMimeType(format: string): string {
  const mimeTypes: Record<string, string> = {
    webp: "image/webp",
    avif: "image/avif",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
  };
  return mimeTypes[format] || `image/${format}`;
}

/**
 * 가장 큰 이미지 선택 (img fallback용)
 */
function getLargestImage(images: GeneratedImage[]): GeneratedImage | undefined {
  return images.reduce<GeneratedImage | undefined>((largest, img) => {
    if (!largest || img.width > largest.width) return img;
    return largest;
  }, undefined);
}

// ============================================================================
// Component
// ============================================================================

export function OptimizedImage(props: OptimizedImageProps) {
  const {
    variant,
    alt,
    className,
    loading = "lazy",
    sizes: customSizes,
    fallbackSrc,
    style,
    slug,
  } = props;

  // 이미지 키 결정
  const imageKey = useMemo(() => {
    if ("imageKey" in props && props.imageKey) {
      return props.imageKey;
    }
    if ("thumbnail" in props && props.thumbnail) {
      return extractImageKey(props.thumbnail, slug);
    }
    return null;
  }, [props, slug]);

  // 매니페스트에서 이미지 데이터 가져오기
  const imageData = useMemo(() => {
    if (!imageKey) return null;

    const imageVariants = images[imageKey];
    if (!imageVariants) return null;

    const variantImages = imageVariants[variant];
    if (!variantImages || variantImages.length === 0) return null;

    return {
      sources: buildSourceSets(variantImages),
      fallback: getLargestImage(variantImages),
    };
  }, [imageKey, variant]);

  // sizes 속성
  const sizes = customSizes || SIZES_PRESETS[variant as keyof typeof SIZES_PRESETS];

  // 매니페스트에 없고 fallbackSrc도 없으면 null 반환
  if (!imageData && !fallbackSrc) {
    return null;
  }

  // 매니페스트에 없으면 fallback 이미지만 렌더링
  if (!imageData) {
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        className={className}
        loading={loading}
        style={style}
      />
    );
  }

  const { sources, fallback } = imageData;

  // fallback img의 src (jpg 우선, 없으면 가장 큰 이미지)
  const jpgSource = sources.find((s) => s.format === "jpg");
  const fallbackImgSrc = jpgSource
    ? getLargestImage(jpgSource.images)?.src
    : fallback?.src;

  return (
    <picture>
      {/* 포맷별 source 태그 (webp 먼저) */}
      {sources.map((source) => (
        <source
          key={source.format}
          type={source.mimeType}
          srcSet={source.srcset}
          sizes={sizes}
        />
      ))}

      {/* fallback img 태그 */}
      <img
        src={fallbackImgSrc || fallbackSrc}
        alt={alt}
        className={className}
        loading={loading}
        width={fallback?.width}
        height={fallback?.height}
        style={style}
      />
    </picture>
  );
}

export default OptimizedImage;
