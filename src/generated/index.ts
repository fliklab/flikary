/**
 * Generated 모듈 진입점
 *
 * images.manifest.ts가 없어도 에러 없이 동작하도록 처리
 */

import type { ImageManifest } from "./images.types";

// manifest 파일이 없을 수 있으므로 동적 import 사용
let manifestImages: ImageManifest = {};

try {
  const manifest = await import("./images.manifest");
  manifestImages = manifest.images || {};
} catch {
  // manifest 파일이 없으면 빈 객체 사용
  manifestImages = {};
}

export const images = manifestImages;
export * from "./images.types";
