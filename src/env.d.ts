/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Vite define으로 주입되는 전역 상수 타입 선언
declare const __CONTENT_PATH__: string;
declare const __IMAGE_GLOB_PATTERN__: string;

interface ImportMetaEnv {
  readonly PUBLIC_GOOGLE_ANALYTICS_ID?: string;
  readonly PUBLIC_ENABLE_ADS?: string;
  readonly GITHUB_COMMENT_TOKEN?: string;
  readonly GITHUB_COMMENT_REPO_OWNER?: string;
  readonly GITHUB_COMMENT_REPO_NAME?: string;
  readonly GITHUB_COMMENT_DISCUSSION_CATEGORY?: string;
  // 향후 추가될 환경 변수들을 위한 공간
  // readonly PUBLIC_CLARITY_PROJECT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
