import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";
import { handleLayoutErrors } from "./vite-plugins/handle-layout-errors";
import path from "path";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
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
      // For more themes, visit https://shiki.style/themes
      themes: { light: "min-light", dark: "night-owl" },
      wrap: true,
    },
  },
  vite: {
    resolve: {
      alias: {
        "@layouts": path.resolve("./src/layouts"),
      },
    },
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
    plugins: [handleLayoutErrors()],
  },
  scopedStyleStrategy: "where",
  experimental: {
    contentLayer: true,
  },
});
