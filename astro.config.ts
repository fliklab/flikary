import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/serverless";
import { SITE, PATHS } from "./src/config";
import tsconfigPaths from "vite-tsconfig-paths";
import * as fs from "node:fs";
import * as path from "node:path";
import {
  transformerNotationHighlight,
  transformerMetaHighlight,
} from "@shikijs/transformers";

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

const sitemapFilter = (page: string) => {
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
};

const noindexPaths = getNoindexPaths();

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  output: "hybrid", // API 라우트에서 쿼리 파라미터 처리를 위해 hybrid 모드 사용
  adapter: vercel(),
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "tap", // hover 대신 클릭 시에만 prefetch
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
        langs: [],
        langAlias: {
          processing: "java",
        },
        transformers: [
          transformerNotationHighlight(),
          transformerMetaHighlight(),
          {
            name: "transformer-title",
            pre(node) {
              const meta = this.options.meta?.__raw;
              if (!meta) return;

              const titleMatch = meta.match(/title="([^"]+)"/);
              if (titleMatch) {
                node.properties["data-title"] = titleMatch[1];
              }
            },
          },
        ],
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
      filter: sitemapFilter,
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
      langs: [],
      langAlias: {
        processing: "java",
      },
      transformers: [
        transformerNotationHighlight(),
        transformerMetaHighlight(),
        {
          name: "transformer-title",
          pre(node) {
            const meta = this.options.meta?.__raw;
            if (!meta) return;

            const titleMatch = meta.match(/title="([^"]+)"/);
            if (titleMatch) {
              node.properties["data-title"] = titleMatch[1];
            }
          },
        },
      ],
    },
  },
  vite: {
    plugins: [tsconfigPaths()], // tsconfig.json의 paths를 사용
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
    define: {
      // import.meta.glob에서 사용할 빌드 타임 상수
      __CONTENT_PATH__: JSON.stringify(PATHS.CONTENT),
      __IMAGE_GLOB_PATTERN__: JSON.stringify(PATHS.IMAGE_GLOB),
    },
  },
  scopedStyleStrategy: "where",
  experimental: {
    contentLayer: true,
  },
});
