// LQIP (Low Quality Image Placeholder) 시스템을 위한 타입 정의

/** 이미지의 기본 메타데이터 */
export interface ImageMetadata {
  width: number;
  height: number;
  path: string;
}

/** LQIP 데이터 - 저장될 형태 */
export interface LQIPData {
  /** 인코딩된 LQIP 데이터 (base64) */
  encoded: string;
  /** 이미지 너비 */
  width: number;
  /** 이미지 높이 */
  height: number;
  /** 사용된 인코더 타입 */
  encoderType: string;
}

/** LQIP 렌더링 정보 - 실제 렌더링에 사용할 형태 */
export interface LQIPRenderInfo {
  /** CSS 스타일 문자열 또는 스타일 객체 */
  style: string | Record<string, string>;
  /** 이미지 가로세로 비율 */
  aspectRatio: string;
  /** 추가 클래스명 (선택사항) */
  className?: string;
}

/** 4개 픽셀 색상 정보 */
export interface FourPixelData {
  topLeft: RGB;
  topRight: RGB;
  bottomLeft: RGB;
  bottomRight: RGB;
}

/** 5개 색상과 위치 정보 */
export interface FiveColorData {
  colors: ColorWithPositions[];
}

/** 색상과 해당 위치들 */
export interface ColorWithPositions {
  color: RGB;
  positions: Position[];
}

/** 2D 위치 (0.0 ~ 1.0 정규화된 좌표) */
export interface Position {
  x: number;
  y: number;
}

/** RGB 색상 */
export interface RGB {
  r: number;
  g: number;
  b: number;
}

/** LQIP 인코더 인터페이스 */
export interface LQIPEncoder {
  /** 인코더 타입 식별자 */
  readonly type: string;

  /**
   * 이미지에서 LQIP 데이터를 생성
   * @param imagePath 이미지 파일 경로
   * @param metadata 이미지 메타데이터
   * @returns 인코딩된 LQIP 데이터
   */
  encode(imagePath: string, metadata: ImageMetadata): Promise<LQIPData>;
}

/** LQIP 디코더 인터페이스 */
export interface LQIPDecoder {
  /** 디코더 타입 식별자 */
  readonly type: string;

  /**
   * LQIP 데이터를 렌더링 정보로 변환
   * @param data LQIP 데이터
   * @returns 렌더링 정보
   */
  decode(data: LQIPData): LQIPRenderInfo;
}

/** LQIP 프로세서 - 인코더와 디코더를 결합 */
export interface LQIPProcessor {
  encoder: LQIPEncoder;
  decoder: LQIPDecoder;
}
