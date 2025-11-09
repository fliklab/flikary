// src/utils/blurhash-to-gradient.ts
import { decode } from "blurhash";

export function blurHashToGradient(blurHash: string): string {
  try {
    // BlurHash 문자열을 2x2 픽셀로 디코딩
    const pixels = decode(blurHash, 2, 2);

    // 4개 픽셀의 평균 색상 계산
    let r = 0,
      g = 0,
      b = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      r += pixels[i]; // Red
      g += pixels[i + 1]; // Green
      b += pixels[i + 2]; // Blue
    }

    // 평균값 계산
    const avgR = Math.round(r / 4);
    const avgG = Math.round(g / 4);
    const avgB = Math.round(b / 4);

    // 밝기 변화를 준 그라데이션 생성
    const darker = `rgb(${Math.max(0, avgR - 20)}, ${Math.max(0, avgG - 20)}, ${Math.max(0, avgB - 20)})`;
    const lighter = `rgb(${Math.min(255, avgR + 20)}, ${Math.min(255, avgG + 20)}, ${Math.min(255, avgB + 20)})`;

    return `linear-gradient(135deg, ${darker} 0%, ${lighter} 100%)`;
  } catch (error) {
    console.error("BlurHash 디코딩 오류:", error);
    // 오류 시 기본 그라데이션
    return "linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)";
  }
}
