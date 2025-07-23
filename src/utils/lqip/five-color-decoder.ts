import type {
  LQIPDecoder,
  LQIPData,
  LQIPRenderInfo,
  FiveColorData,
  RGB,
} from "../../types/lqip";

/** 5개 색상과 위치 방식 LQIP 디코더 */
export class FiveColorDecoder implements LQIPDecoder {
  readonly type = "five-color";

  decode(data: LQIPData): LQIPRenderInfo {
    try {
      // base64에서 5개 색상 데이터 추출
      const fiveColorData = this.decodeFromBase64(data.encoded);

      // CSS 스타일 생성
      const style = this.generateCSSStyle(fiveColorData);

      // 가로세로 비율 계산
      const aspectRatio = (data.width / data.height).toString();

      return {
        style,
        aspectRatio,
        className: "lqip-five-color",
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
   * base64에서 5개 색상 데이터 추출
   */
  private decodeFromBase64(encoded: string): FiveColorData {
    const jsonString = Buffer.from(encoded, "base64").toString("utf-8");
    return JSON.parse(jsonString) as FiveColorData;
  }

  /**
   * 5개 색상과 위치를 사용하여 CSS 스타일 생성
   */
  private generateCSSStyle(fiveColorData: FiveColorData): string {
    const { colors } = fiveColorData;

    if (colors.length === 0) {
      return "background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)";
    }

    // 모든 색상의 평균을 배경색으로 사용
    const backgroundColor = this.calculateAverageColor(
      colors.map(c => c.color)
    );

    // 각 색상의 각 위치에서 radial gradient 생성
    const gradients: string[] = [];

    for (const colorData of colors) {
      const colorStrAlpha = this.toRGBA(colorData.color, 0.7);

      for (const position of colorData.positions) {
        // 위치를 백분율로 변환
        const x = Math.round(position.x * 100);
        const y = Math.round(position.y * 100);

        // 각 위치에서 radial gradient 생성
        gradients.push(
          `radial-gradient(circle at ${x}% ${y}%, ${colorStrAlpha} 0%, ${this.toRGBA(colorData.color, 0.4)} 25%, transparent 50%)`
        );
      }
    }

    // 전체 색조를 맞추기 위한 오버레이 그라데이션 추가
    const dominantColor = colors[0]?.color; // 첫 번째 색상을 주요 색상으로
    if (dominantColor) {
      gradients.push(
        `linear-gradient(45deg, ${this.toRGBA(dominantColor, 0.1)} 0%, transparent 100%)`
      );
    }

    return `
      background-color: ${this.toRGB(backgroundColor)};
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
    if (colors.length === 0) return { r: 128, g: 128, b: 128 };

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

  /**
   * RGB 색상을 CSS 문자열로 변환
   */
  private toRGB(color: RGB): string {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  }

  /**
   * RGBA 색상을 CSS 문자열로 변환
   */
  private toRGBA(color: RGB, alpha: number): string {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
  }
}

/**
 * 5개 색상 LQIP 컴포넌트용 CSS 스타일
 */
export const fiveColorLQIPStyles = `
  .lqip-five-color {
    /* 부드러운 그라데이션 렌더링 */
    image-rendering: auto;
    filter: blur(1px);
    background-blend-mode: soft-light;
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
  
  /* 더 복합적인 그라데이션 효과를 위한 추가 스타일 */
  .lqip-placeholder {
    background-blend-mode: soft-light;
    mix-blend-mode: multiply;
  }
`;
