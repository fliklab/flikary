/**
 * 반응형 이미지 매니페스트 로딩 유틸리티
 * Vercel 환경과 로컬 환경 모두에서 안전하게 작동
 */

// 타입 정의
export interface ResponsiveImageConfig {
  webp?: Array<{
    width: number;
    path: string;
    size: number;
  }>;
  jpg?: Array<{
    width: number;
    path: string;
    size: number;
  }>;
}

export interface ResponsiveImageData {
  original: {
    width: number;
    height: number;
    format: string;
  };
  responsive: {
    compact: ResponsiveImageConfig;
    full: ResponsiveImageConfig;
  };
}

export type ResponsiveImagesManifest = Record<
  string,
  Record<string, ResponsiveImageData>
>;

// 글로벌 캐시
let manifestCache: ResponsiveImagesManifest | null = null;

/**
 * 반응형 이미지 매니페스트를 안전하게 로드
 */
export async function loadResponsiveImagesManifest(): Promise<ResponsiveImagesManifest> {
  // 캐시가 있으면 반환
  if (manifestCache) {
    return manifestCache;
  }

  try {
    // TypeScript 파일에서 import (Vercel 환경에서 안전함)
    const { responsiveImagesManifest: manifest } = await import(
      "../data/responsive-images"
    );
    manifestCache = manifest;
    return manifestCache;
  } catch (error) {
    console.warn("⚠️ 반응형 이미지 매니페스트 로드 실패:", error);

    // 빈 객체 반환 (기능 비활성화)
    manifestCache = {};
    return manifestCache;
  }
}

/**
 * 특정 슬러그와 파일명에 대한 반응형 이미지 데이터 가져오기
 */
export async function getResponsiveImageData(
  slug: string,
  fileName: string
): Promise<ResponsiveImageData | null> {
  const manifest = await loadResponsiveImagesManifest();

  if (manifest[slug] && manifest[slug][fileName]) {
    return manifest[slug][fileName];
  }

  return null;
}
