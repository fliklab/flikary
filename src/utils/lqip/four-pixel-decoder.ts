import type {
  LQIPDecoder,
  LQIPData,
  LQIPRenderInfo,
  FourPixelData,
  RGB,
} from "../../types/lqip";

/** 4개 픽셀 방식 LQIP 디코더 */
export class FourPixelDecoder implements LQIPDecoder {
  readonly type = "four-pixel";

  decode(data: LQIPData): LQIPRenderInfo {
    try {
      // base64에서 픽셀 데이터 추출
      const pixelData = this.decodeFromBase64(data.encoded);

      // CSS 스타일 생성
      const style = this.generateCSSStyle(pixelData);

      // 가로세로 비율 계산
      const aspectRatio = (data.width / data.height).toString();

      return {
        style,
        aspectRatio,
        className: "lqip-four-pixel",
      };
    } catch {
      // 오류 시 기본 그라데이션 반환
      return {
        style: "background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)",
        aspectRatio: "auto",
        className: "lqip-fallback",
      };
    }
  }

  /**
   * base64에서 4개 픽셀 데이터 추출
   */
  private decodeFromBase64(encoded: string): FourPixelData {
    const buffer = Buffer.from(encoded, "base64");

    if (buffer.length !== 12) {
      throw new Error("잘못된 4픽셀 데이터 크기");
    }

    const colors: RGB[] = [];
    for (let i = 0; i < 4; i++) {
      const offset = i * 3;
      colors.push({
        r: buffer[offset],
        g: buffer[offset + 1],
        b: buffer[offset + 2],
      });
    }

    return {
      topLeft: colors[0],
      topRight: colors[1],
      bottomLeft: colors[2],
      bottomRight: colors[3],
    };
  }

  /**
   * 4개 픽셀을 렌더링하는 CSS 스타일 생성
   */
  private generateCSSStyle(pixelData: FourPixelData): string {
    const { topLeft, topRight, bottomLeft, bottomRight } = pixelData;

    // RGB 색상을 CSS 문자열로 변환
    const toRGB = (color: RGB) => `rgb(${color.r}, ${color.g}, ${color.b})`;

    // CSS Grid를 사용한 4픽셀 레이아웃
    return `
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      background: 
        linear-gradient(to right, ${toRGB(topLeft)} 50%, ${toRGB(topRight)} 50%) top / 100% 50% no-repeat,
        linear-gradient(to right, ${toRGB(bottomLeft)} 50%, ${toRGB(bottomRight)} 50%) bottom / 100% 50% no-repeat;
      transition: opacity 0.3s ease;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    `
      .replace(/\s+/g, " ")
      .trim();
  }
}

/**
 * 4개 픽셀 LQIP 컴포넌트용 CSS 스타일
 */
export const fourPixelLQIPStyles = `
  .lqip-four-pixel {
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
  }
  
  .lqip-container {
    position: relative;
    overflow: hidden;
    border-radius: 1rem;
  }
  
  .lqip-image {
    position: relative;
    z-index: 2;
    width: 100%;
    height: auto;
    transition: opacity 0.3s ease;
  }
  
  .lqip-fallback {
    background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
    transition: opacity 0.3s ease;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
`;
