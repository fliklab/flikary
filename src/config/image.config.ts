/**
 * 이미지 최적화 설정
 *
 * - formats: 생성할 이미지 포맷 (순서대로 우선순위)
 * - quality: 각 포맷별 품질 설정
 * - variants: 용도별 이미지 크기 정의
 */

export interface ImageVariantConfig {
  width: number;
  height?: number;
  /** 추가 srcset 너비들 (반응형용) */
  srcsetWidths?: number[];
}

export interface ImageConfig {
  /** 생성할 이미지 포맷 */
  formats: ("webp" | "jpg" | "png" | "avif")[];
  /** 포맷별 품질 설정 */
  quality: {
    webp: number;
    jpg: number;
    png: number;
    avif: number;
  };
  /** 용도별 이미지 변형 설정 */
  variants: Record<string, ImageVariantConfig>;
  /** 원본 이미지 소스 경로 패턴 */
  sourcePatterns: string[];
  /** 생성된 이미지 출력 경로 */
  outputDir: string;
  /** 매니페스트 출력 경로 */
  manifestPath: string;
}

export const imageConfig: ImageConfig = {
  formats: ["webp", "jpg"],

  quality: {
    webp: 80,
    jpg: 80,
    png: 90,
    avif: 65,
  },

  variants: {
    // 일반 ArticleCard 썸네일 (72-96px 표시, 2x DPR 대응)
    card: {
      width: 192,
      height: 192,
      srcsetWidths: [96, 144, 192],
    },

    // FeaturedArticleCard 썸네일 (140-200px 표시, 4:3 비율)
    featured: {
      width: 400,
      height: 300,
      srcsetWidths: [200, 300, 400],
    },

    // 모바일 Featured (전체 너비, 16:9 비율)
    featuredMobile: {
      width: 800,
      height: 450,
      srcsetWidths: [400, 600, 800],
    },

    // OG 이미지 (소셜 미디어용)
    og: {
      width: 1200,
      height: 630,
    },

    // 블로그 본문 내 이미지 (전체 너비)
    content: {
      width: 1200,
      srcsetWidths: [400, 800, 1200],
    },
  },

  sourcePatterns: [
    "src/content/blog/**/images/*.{png,jpg,jpeg,webp}",
    "src/assets/images/**/*.{png,jpg,jpeg,webp}",
  ],

  outputDir: "public/optimized-images",

  manifestPath: "src/generated/images.manifest.ts",
};

export default imageConfig;
