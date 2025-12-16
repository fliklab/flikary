#!/usr/bin/env npx tsx
/**
 * 이미지 최적화 스크립트
 *
 * 원본 이미지를 탐색하여 설정된 variants별로 최적화된 이미지를 생성하고,
 * 컴포넌트에서 사용할 수 있는 매니페스트 파일을 출력합니다.
 *
 * 사용법:
 *   pnpm run generate:images
 *   pnpm run generate:images --force  (기존 파일 덮어쓰기)
 */

import fs from "fs";
import path from "path";
import { glob } from "glob";
import sharp from "sharp";
import { imageConfig, type ImageVariantConfig } from "../src/config/image.config";

// ============================================================================
// Types
// ============================================================================

interface GeneratedImage {
  src: string;
  width: number;
  height?: number;
  format: string;
}

interface VariantImages {
  [variantName: string]: GeneratedImage[];
}

interface ImageManifest {
  [imageKey: string]: VariantImages;
}

interface GenerationStats {
  total: number;
  generated: number;
  skipped: number;
  errors: string[];
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * 이미지 경로에서 고유 키 생성
 * src/content/blog/my-post/images/thumb.png → my-post/thumb
 */
function getImageKey(filePath: string): string {
  const normalized = filePath.replace(/\\/g, "/");

  // 블로그 포스트 이미지: src/content/blog/{slug}/images/{name}
  const blogMatch = normalized.match(/src\/content\/blog\/([^/]+)\/images\/([^/]+)\.[^.]+$/);
  if (blogMatch) {
    return `${blogMatch[1]}/${blogMatch[2]}`;
  }

  // assets 이미지: src/assets/images/{path}/{name}
  const assetsMatch = normalized.match(/src\/assets\/images\/(.+)\.[^.]+$/);
  if (assetsMatch) {
    return assetsMatch[1];
  }

  // 기타: 파일명만 사용
  const basename = path.basename(filePath, path.extname(filePath));
  return basename;
}

/**
 * 출력 파일 경로 생성
 */
function getOutputPath(
  imageKey: string,
  variant: string,
  width: number,
  format: string
): string {
  const dir = path.join(imageConfig.outputDir, path.dirname(imageKey));
  const basename = path.basename(imageKey);
  const filename = `${basename}-${variant}-${width}.${format}`;
  return path.join(dir, filename);
}

/**
 * 웹 경로로 변환 (public/ 제거)
 */
function toWebPath(filePath: string): string {
  return "/" + filePath.replace(/^public[\\/]/, "").replace(/\\/g, "/");
}

/**
 * 단일 이미지 변형 생성
 */
async function generateVariant(
  inputPath: string,
  outputPath: string,
  width: number,
  height: number | undefined,
  format: "webp" | "jpg" | "png" | "avif"
): Promise<{ width: number; height: number }> {
  // 출력 디렉토리 생성
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let pipeline = sharp(inputPath);

  // 리사이즈
  pipeline = pipeline.resize(width, height, {
    fit: height ? "cover" : "inside",
    withoutEnlargement: true,
  });

  // 포맷 변환
  const quality = imageConfig.quality[format];
  switch (format) {
    case "webp":
      pipeline = pipeline.webp({ quality });
      break;
    case "jpg":
      pipeline = pipeline.jpeg({ quality });
      break;
    case "png":
      pipeline = pipeline.png({ quality });
      break;
    case "avif":
      pipeline = pipeline.avif({ quality });
      break;
  }

  const result = await pipeline.toFile(outputPath);
  return { width: result.width, height: result.height };
}

/**
 * 단일 이미지에 대한 모든 variants 생성
 */
async function processImage(
  inputPath: string,
  imageKey: string,
  forceRegenerate: boolean,
  stats: GenerationStats
): Promise<VariantImages> {
  const result: VariantImages = {};

  for (const [variantName, variantConfig] of Object.entries(imageConfig.variants)) {
    result[variantName] = [];

    // srcset 너비들 (기본 너비 포함)
    const widths = variantConfig.srcsetWidths
      ? [...new Set([...variantConfig.srcsetWidths, variantConfig.width])].sort((a, b) => a - b)
      : [variantConfig.width];

    // 각 포맷에 대해
    for (const format of imageConfig.formats) {
      // 각 너비에 대해
      for (const width of widths) {
        const height = variantConfig.height
          ? Math.round((width / variantConfig.width) * variantConfig.height)
          : undefined;

        const outputPath = getOutputPath(imageKey, variantName, width, format);
        stats.total++;

        // 이미 존재하면 스킵 (force가 아닌 경우)
        if (!forceRegenerate && fs.existsSync(outputPath)) {
          const webPath = toWebPath(outputPath);
          result[variantName].push({
            src: webPath,
            width,
            height,
            format,
          });
          stats.skipped++;
          continue;
        }

        try {
          const dimensions = await generateVariant(
            inputPath,
            outputPath,
            width,
            height,
            format as "webp" | "jpg"
          );

          const webPath = toWebPath(outputPath);
          result[variantName].push({
            src: webPath,
            width: dimensions.width,
            height: dimensions.height,
            format,
          });
          stats.generated++;

          console.log(`  ✓ ${variantName}/${width}w.${format}`);
        } catch (error) {
          const errorMsg = `Failed to generate ${outputPath}: ${error}`;
          stats.errors.push(errorMsg);
          console.error(`  ✗ ${errorMsg}`);
        }
      }
    }
  }

  return result;
}

/**
 * 매니페스트 파일 생성
 */
function writeManifest(manifest: ImageManifest): void {
  const manifestDir = path.dirname(imageConfig.manifestPath);
  if (!fs.existsSync(manifestDir)) {
    fs.mkdirSync(manifestDir, { recursive: true });
  }

  const content = `// 자동 생성된 파일입니다. 직접 수정하지 마세요.
// 생성 시각: ${new Date().toISOString()}
// 명령어: pnpm run generate:images

import type { ImageManifest } from "./images.types";

export const images: ImageManifest = ${JSON.stringify(manifest, null, 2)};

export default images;
`;

  fs.writeFileSync(imageConfig.manifestPath, content, "utf-8");
  console.log(`\n📄 Manifest written to: ${imageConfig.manifestPath}`);
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  const forceRegenerate = process.argv.includes("--force");

  console.log("🖼️  Image Optimization Script");
  console.log("============================");
  console.log(`Force regenerate: ${forceRegenerate}`);
  console.log(`Output directory: ${imageConfig.outputDir}`);
  console.log(`Formats: ${imageConfig.formats.join(", ")}`);
  console.log(`Variants: ${Object.keys(imageConfig.variants).join(", ")}`);
  console.log("");

  // 원본 이미지 탐색
  const allImages: string[] = [];
  for (const pattern of imageConfig.sourcePatterns) {
    const found = await glob(pattern, { nodir: true });
    allImages.push(...found);
  }

  // 중복 제거
  const uniqueImages = [...new Set(allImages)];
  console.log(`Found ${uniqueImages.length} source images\n`);

  if (uniqueImages.length === 0) {
    console.log("No images to process.");
    return;
  }

  const manifest: ImageManifest = {};
  const stats: GenerationStats = {
    total: 0,
    generated: 0,
    skipped: 0,
    errors: [],
  };

  // 각 이미지 처리
  for (const imagePath of uniqueImages) {
    const imageKey = getImageKey(imagePath);
    console.log(`📷 Processing: ${imageKey}`);

    try {
      manifest[imageKey] = await processImage(imagePath, imageKey, forceRegenerate, stats);
    } catch (error) {
      console.error(`  ✗ Error processing ${imagePath}: ${error}`);
      stats.errors.push(`${imagePath}: ${error}`);
    }
  }

  // 매니페스트 작성
  writeManifest(manifest);

  // 결과 출력
  console.log("\n📊 Summary");
  console.log("==========");
  console.log(`Total variants: ${stats.total}`);
  console.log(`Generated: ${stats.generated}`);
  console.log(`Skipped (cached): ${stats.skipped}`);
  console.log(`Errors: ${stats.errors.length}`);

  if (stats.errors.length > 0) {
    console.log("\n❌ Errors:");
    stats.errors.forEach((err) => console.log(`  - ${err}`));
    process.exit(1);
  }

  console.log("\n✅ Done!");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
