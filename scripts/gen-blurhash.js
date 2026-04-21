import { performance } from "node:perf_hooks";
import fs from "node:fs/promises";
import path from "node:path";
import { encode } from "blurhash";
import { glob } from "glob";
import sharp from "sharp";

const BLURHASH_DATA_PATH = "src/data/blurhash.json";
const BLURHASH_MANIFEST_PATH = "src/data/blurhash-manifest.json";
const BLOG_IMAGE_GLOB = "src/content/**/*.{jpg,jpeg,png,webp}";

async function main() {
  try {
    await generateBlogBlurHashes();
  } catch (error) {
    console.error("❌ 오류 발생:", error);
    process.exit(1);
  }
}

async function readJson(filePath, fallback) {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return fallback;
    }

    throw error;
  }
}

function normalizeRelativePath(imagePath) {
  return imagePath.replace(/^src\/content\//, "");
}

function sortObjectByKey(input) {
  return Object.fromEntries(
    Object.entries(input).sort(([left], [right]) => left.localeCompare(right))
  );
}

async function writeJsonIfChanged(filePath, nextValue) {
  const nextContent = `${JSON.stringify(sortObjectByKey(nextValue), null, 2)}\n`;

  try {
    const currentContent = await fs.readFile(filePath, "utf-8");
    if (currentContent === nextContent) {
      return false;
    }
  } catch (error) {
    if (!(error && typeof error === "object" && "code" in error && error.code === "ENOENT")) {
      throw error;
    }
  }

  await fs.writeFile(filePath, nextContent);
  return true;
}

async function generateEntry(imagePath) {
  const originalImageInfo = await sharp(imagePath).metadata();
  const { data, info } = await sharp(imagePath)
    .resize(32, 32, { fit: "cover" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  return {
    hash: encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4),
    width: originalImageInfo.width || 0,
    height: originalImageInfo.height || 0,
  };
}

async function generateBlogBlurHashes() {
  console.log("🔍 이미지 파일들을 찾는 중...");

  const startedAt = performance.now();
  const imageFiles = (await glob(BLOG_IMAGE_GLOB)).sort();

  if (imageFiles.length === 0) {
    console.log("⚠️ 처리할 이미지를 찾지 못했습니다.");
    return;
  }

  console.log(`📁 총 ${imageFiles.length}개의 이미지를 찾았습니다.`);

  const existingBlurhashData = await readJson(BLURHASH_DATA_PATH, {});
  const existingManifest = await readJson(BLURHASH_MANIFEST_PATH, {});
  const nextBlurhashData = {};
  const nextManifest = {};

  let reusedCount = 0;
  let regeneratedCount = 0;
  let failedCount = 0;

  for (const imagePath of imageFiles) {
    const relativePath = normalizeRelativePath(imagePath);
    const fileStat = await fs.stat(imagePath);
    const currentSignature = {
      mtimeMs: fileStat.mtimeMs,
      size: fileStat.size,
    };

    const manifestEntry = existingManifest[relativePath];
    const canReuse =
      manifestEntry &&
      manifestEntry.mtimeMs === currentSignature.mtimeMs &&
      manifestEntry.size === currentSignature.size &&
      existingBlurhashData[relativePath];

    if (canReuse) {
      nextBlurhashData[relativePath] = existingBlurhashData[relativePath];
      nextManifest[relativePath] = manifestEntry;
      reusedCount += 1;
      continue;
    }

    console.log(`📸 처리 중: ${imagePath}`);

    try {
      const blurhashEntry = await generateEntry(imagePath);
      nextBlurhashData[relativePath] = blurhashEntry;
      nextManifest[relativePath] = {
        ...currentSignature,
      };
      regeneratedCount += 1;
    } catch (error) {
      failedCount += 1;
      console.error(`❌ ${imagePath} 처리 중 오류 발생:`, error);
    }
  }

  const blurhashWritten = await writeJsonIfChanged(
    BLURHASH_DATA_PATH,
    nextBlurhashData
  );
  const manifestWritten = await writeJsonIfChanged(
    BLURHASH_MANIFEST_PATH,
    nextManifest
  );

  const finishedAt = performance.now();
  const elapsedMs = Math.round(finishedAt - startedAt);
  const removedCount = Math.max(
    0,
    Object.keys(existingManifest).length - Object.keys(nextManifest).length
  );

  console.log(`♻️ 재사용: ${reusedCount}`);
  console.log(`🆕 재생성: ${regeneratedCount}`);
  console.log(`🗑️ 제거된 항목 정리: ${removedCount}`);
  console.log(`📝 blurhash.json ${blurhashWritten ? "갱신" : "유지"}`);
  console.log(`📝 blurhash-manifest.json ${manifestWritten ? "갱신" : "유지"}`);
  console.log(`⏱️ 총 소요 시간: ${elapsedMs}ms`);

  if (failedCount > 0) {
    console.error(`⚠️ 실패한 이미지 수: ${failedCount}`);
  }

  console.log("✅ BlurHash 생성 완료!");
}

main();
