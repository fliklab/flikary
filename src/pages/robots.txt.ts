import type { APIRoute } from "astro";
import { SITE } from "@config";
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

export const GET: APIRoute = () => {
  const noindexPaths = getNoindexPaths();

  let disallowRules = "";

  // .noindex에 명시된 경로 추가
  for (const noindexPath of noindexPaths) {
    disallowRules += `Disallow: ${noindexPath}\n`;
  }

  const robots = `
User-agent: *
${disallowRules}
Crawl-delay: 10

Sitemap: ${new URL("sitemap-index.xml", SITE.website).href}
`.trim();

  return new Response(robots, {
    headers: { "Content-Type": "text/plain" },
  });
};
