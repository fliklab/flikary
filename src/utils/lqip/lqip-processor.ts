import type { LQIPProcessor } from "../../types/lqip";
import { FourPixelEncoder } from "./four-pixel-encoder";
import { FourPixelDecoder } from "./four-pixel-decoder";
import { FiveColorEncoder } from "./five-color-encoder";
import { FiveColorDecoder } from "./five-color-decoder";

/** 사용 가능한 LQIP 프로세서 타입 */
export const LQIP_PROCESSORS = {
  "four-pixel": {
    encoder: FourPixelEncoder,
    decoder: FourPixelDecoder,
  },
  "five-color": {
    encoder: FiveColorEncoder,
    decoder: FiveColorDecoder,
  },
  // 추후 blurhash 등 다른 방식 추가 가능
} as const;

export type LQIPProcessorType = keyof typeof LQIP_PROCESSORS;

/** LQIP 프로세서 팩토리 */
export class LQIPProcessorFactory {
  private static processors = new Map<LQIPProcessorType, LQIPProcessor>();

  /**
   * 지정된 타입의 LQIP 프로세서 인스턴스 반환
   */
  static getProcessor(type: LQIPProcessorType): LQIPProcessor {
    if (!this.processors.has(type)) {
      const processorConfig = LQIP_PROCESSORS[type];
      const processor: LQIPProcessor = {
        encoder: new processorConfig.encoder(),
        decoder: new processorConfig.decoder(),
      };
      this.processors.set(type, processor);
    }

    return this.processors.get(type)!;
  }

  /**
   * 사용 가능한 모든 프로세서 타입 반환
   */
  static getAvailableTypes(): LQIPProcessorType[] {
    return Object.keys(LQIP_PROCESSORS) as LQIPProcessorType[];
  }

  /**
   * 기본 프로세서 반환 (5-color)
   */
  static getDefaultProcessor(): LQIPProcessor {
    return this.getProcessor("five-color");
  }
}

/**
 * 편의 함수: 기본 프로세서 사용
 */
export function getDefaultLQIPProcessor(): LQIPProcessor {
  return LQIPProcessorFactory.getDefaultProcessor();
}

/**
 * 편의 함수: 특정 타입 프로세서 사용
 */
export function getLQIPProcessor(type: LQIPProcessorType): LQIPProcessor {
  return LQIPProcessorFactory.getProcessor(type);
}
