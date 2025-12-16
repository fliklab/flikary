/**
 * 이미지 매니페스트 타입 정의
 *
 * generate-images.ts 스크립트에서 생성한 매니페스트 파일의 타입을 정의합니다.
 */

/** 단일 생성된 이미지 정보 */
export interface GeneratedImage {
  /** 웹 경로 (예: /optimized-images/my-post/thumb-card-192.webp) */
  src: string;
  /** 이미지 너비 (px) */
  width: number;
  /** 이미지 높이 (px, 비율 유지 시 undefined) */
  height?: number;
  /** 이미지 포맷 (webp, jpg 등) */
  format: string;
}

/** 특정 variant의 이미지 목록 (여러 너비/포맷) */
export type VariantImages = GeneratedImage[];

/** 특정 이미지 키에 대한 모든 variants */
export interface ImageVariants {
  [variantName: string]: VariantImages;
}

/** 전체 이미지 매니페스트 */
export interface ImageManifest {
  [imageKey: string]: ImageVariants;
}

/** variant 이름 타입 (config와 동기화) */
export type VariantName = "card" | "featured" | "featuredMobile" | "og" | "content";
