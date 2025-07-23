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
   * 4개 픽셀을 렌더링하는 CSS 스타일 생성 (개선된 radial gradient 방식)
   */
  private generateCSSStyle(pixelData: FourPixelData): string {
    const { topLeft, topRight, bottomLeft, bottomRight } = pixelData;

    // RGB 색상을 CSS 문자열로 변환
    const toRGB = (color: RGB) => `rgb(${color.r}, ${color.g}, ${color.b})`;
    const toRGBA = (color: RGB, alpha: number) =>
      `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;

    // 4개 픽셀의 평균 색상 계산
    const avgColor = this.calculateAverageColor([
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
    ]);
    const backgroundColor = toRGB(avgColor);

    // 각 모서리에서 중심으로 향하는 radial gradient 생성
    const gradients = [
      // 좌상단 모서리
      `radial-gradient(circle at 0% 0%, ${toRGBA(topLeft, 0.8)} 0%, ${toRGBA(topLeft, 0.4)} 30%, transparent 60%)`,
      // 우상단 모서리
      `radial-gradient(circle at 100% 0%, ${toRGBA(topRight, 0.8)} 0%, ${toRGBA(topRight, 0.4)} 30%, transparent 60%)`,
      // 좌하단 모서리
      `radial-gradient(circle at 0% 100%, ${toRGBA(bottomLeft, 0.8)} 0%, ${toRGBA(bottomLeft, 0.4)} 30%, transparent 60%)`,
      // 우하단 모서리
      `radial-gradient(circle at 100% 100%, ${toRGBA(bottomRight, 0.8)} 0%, ${toRGBA(bottomRight, 0.4)} 30%, transparent 60%)`,
    ];

    return `
      background-color: ${backgroundColor};
      background-image: ${gradients.join(", ")};
      background-size: 100% 100%;
      background-repeat: no-repeat;
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

  /**
   * 여러 색상의 평균값 계산
   */
  private calculateAverageColor(colors: RGB[]): RGB {
    const sum = colors.reduce(
      (acc, color) => ({
        r: acc.r + color.r,
        g: acc.g + color.g,
        b: acc.b + color.b,
      }),
      { r: 0, g: 0, b: 0 }
    );

    return {
      r: Math.round(sum.r / colors.length),
      g: Math.round(sum.g / colors.length),
      b: Math.round(sum.b / colors.length),
    };
  }
}

/**
 * 4개 픽셀 LQIP 컴포넌트용 CSS 스타일 (radial gradient 방식)
 */
export const fourPixelLQIPStyles = `
  .lqip-four-pixel {
    /* 부드러운 그라데이션 렌더링 */
    image-rendering: auto;
    filter: blur(0.5px);
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
  
  /* 부드러운 그라데이션 효과를 위한 추가 스타일 */
  .lqip-placeholder {
    background-blend-mode: multiply;
  }
`;
