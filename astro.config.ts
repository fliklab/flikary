import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";
import tsconfigPaths from "vite-tsconfig-paths";
import fs from "fs";
import path from "path";

// .noindex 파일에서 제외할 경로 읽기
const getNoindexPaths = () => {
  try {
    const noindexFile = path.join(process.cwd(), ".noindex");
    if (fs.existsSync(noindexFile)) {
      const content = fs.readFileSync(noindexFile, "utf-8");
      return content.split("\n").filter(line => line.trim() !== "");
    }
  } catch (error) {
    console.error("Error reading .noindex file:", error);
  }
  return [];
};

const noindexPaths = getNoindexPaths();

// https://astro.build/config
export default defineConfig({
  site: SITE.website,

  // 이미지 최적화 설정 추가
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        limitInputPixels: false,
      },
    },
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.vercel.app",
      },
    ],
  },

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    mdx({
      syntaxHighlight: "shiki",
      shikiConfig: {
        themes: { light: "min-light", dark: "night-owl" },
        wrap: true,
      },
      remarkPlugins: [
        remarkToc,
        [
          remarkCollapse,
          {
            test: "Table of contents",
          },
        ],
      ],
    }),
    sitemap({
      filter: page => {
        // 기존 필터 로직 유지
        if (!SITE.showArchives && page.endsWith("/archives")) {
          return false;
        }

        // .noindex에 명시된 경로 제외
        for (const noindexPath of noindexPaths) {
          if (page.includes(noindexPath)) {
            return false;
          }
        }

        return true;
      },
      // 크롤링 제한 시간 설정
      lastmod: new Date(),
      changefreq: "weekly",
      priority: 0.7,
    }),
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      wrap: true,
    },
  },
  vite: {
    plugins: [tsconfigPaths()], // 이 플러그인이 tsconfig.json의 paths를 사용
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // 이미지 관련 유틸리티를 별도 청크로 분리
            "image-utils": [
              "src/utils/responsive-images.ts",
              "src/utils/lqip/astro-lqip.ts",
            ],
            // React 컴포넌트를 별도 청크로 분리
            "react-components": [
              "src/components/Search.tsx",
              "src/components/Card.tsx",
            ],
          },
        },
      },
    },
    // 이미지 최적화를 위한 추가 설정
    assetsInclude: ["**/*.webp", "**/*.jpg", "**/*.png", "**/*.svg"],
  },

  // 빌드 최적화
  build: {
    // 정적 에셋 인라인 제한
    inlineStylesheets: "auto",
    assets: "_astro",
  },

  // 서버 설정 (개발 환경 성능 향상)
  server: {
    headers: {
      // 이미지 캐싱 헤더
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  },

  scopedStyleStrategy: "where",
  experimental: {
    contentLayer: true,
  },
});
