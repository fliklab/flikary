import { getDefaultLQIPProcessor } from "./lqip-processor";
import type { LQIPData, LQIPRenderInfo } from "../../types/lqip";

// LQIP 데이터 저장 형식
type LQIPDataStorage = Record<string, LQIPData>;

/**
 * LQIP 데이터를 로드하고 렌더링 정보를 반환하는 유틸리티
 */
export class AstroLQIPUtil {
  private static lqipDataCache: LQIPDataStorage | null = null;

  /**
   * LQIP 데이터 파일을 로드 (캐시됨)
   */
  private static async loadLQIPData(): Promise<LQIPDataStorage> {
    if (this.lqipDataCache) {
      return this.lqipDataCache;
    }

    try {
      // 동적 import로 JSON 데이터 로드
      const lqipDataModule = await import("../../data/lqip-data.json");
      this.lqipDataCache = lqipDataModule.default || lqipDataModule;
      return this.lqipDataCache;
    } catch (error) {
      console.warn("LQIP 데이터 파일을 찾을 수 없습니다:", error);
      return {};
    }
  }

  /**
   * 이미지 경로에 대한 LQIP 렌더링 정보 반환
   */
  static async getLQIPRenderInfo(
    imagePath: string
  ): Promise<LQIPRenderInfo | null> {
    try {
      const lqipData = await this.loadLQIPData();
      const imageData = lqipData[imagePath];

      if (!imageData) {
        return null;
      }

      const processor = getDefaultLQIPProcessor();
      return processor.decoder.decode(imageData);
    } catch (error) {
      console.error("LQIP 렌더링 정보 생성 실패:", error);
      return null;
    }
  }

  /**
   * 이미지 경로 정규화
   */
  static normalizeImagePath(imageSrc: string, slug?: string): string {
    // /@fs/absolute/path/src/content/blog/... -> blog/...
    const fsMatch = imageSrc.match(/\/@fs.*?\/src\/content\/(blog\/.+?)(\?|$)/);
    if (fsMatch) {
      return fsMatch[1];
    }

    // 일반적인 상대 경로 처리
    if (imageSrc.startsWith("./") && slug) {
      const cleanSrc = imageSrc.replace(/^\.\//, "");
      return `blog/${slug}/${cleanSrc}`;
    }

    // 이미 blog/로 시작하는 경우
    if (imageSrc.startsWith("blog/")) {
      return imageSrc;
    }

    return imageSrc;
  }

  /**
   * 기본 fallback 렌더링 정보 반환
   */
  static getFallbackRenderInfo(): LQIPRenderInfo {
    return {
      style: "background: linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%)",
      aspectRatio: "auto",
      className: "lqip-fallback",
    };
  }
}

/**
 * 편의 함수: 이미지 경로에 대한 LQIP 정보 반환
 */
export async function getLQIPInfo(
  imageSrc: string,
  slug?: string
): Promise<{
  renderInfo: LQIPRenderInfo;
  aspectRatio: string;
  hasData: boolean;
}> {
  const normalizedPath = AstroLQIPUtil.normalizeImagePath(imageSrc, slug);
  const renderInfo = await AstroLQIPUtil.getLQIPRenderInfo(normalizedPath);

  if (renderInfo) {
    return {
      renderInfo,
      aspectRatio: renderInfo.aspectRatio,
      hasData: true,
    };
  }

  // Fallback
  const fallbackInfo = AstroLQIPUtil.getFallbackRenderInfo();
  return {
    renderInfo: fallbackInfo,
    aspectRatio: fallbackInfo.aspectRatio,
    hasData: false,
  };
}
