import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { glob } from 'glob';

// 1. PNG -> WebP 변환
const pngFiles = await glob('src/content/blog/**/*.png');
for (const pngFile of pngFiles) {
  const dirPath = path.dirname(pngFile);
  const baseName = path.basename(pngFile, '.png');
  const webpPath = path.join(dirPath, `${baseName}.webp`);
  await sharp(pngFile).webp({ quality: 80 }).toFile(webpPath);
  console.log(`Converted: ${pngFile} -> ${webpPath}`);
}

// 2. 변환된 webp 경로 인덱스 빌드
const webpSet = new Set();
for (const w of await glob('src/content/blog/**/*.webp')) {
  webpSet.add(path.resolve(w));
}

// 3. 블로그의 모든 md/mdx 본문에서 .png 참조를 .webp로 치환
//    (PNG가 ./images/ 같은 서브디렉토리에 있을 수 있으므로
//     MDX 파일 기준으로 상대 경로를 resolve해 실존하는 webp만 치환)
const mdFiles = await glob('src/content/blog/**/*.{md,mdx}');
for (const mdFile of mdFiles) {
  const original = await fs.readFile(mdFile, 'utf8');
  const mdDir = path.dirname(mdFile);
  const updated = original.replace(/([^\s()"'`]+)\.png/g, (match, stem) => {
    const resolvedWebp = path.resolve(mdDir, stem + '.webp');
    return webpSet.has(resolvedWebp) ? stem + '.webp' : match;
  });
  if (updated !== original) {
    await fs.writeFile(mdFile, updated, 'utf8');
    console.log(`Updated references in: ${mdFile}`);
  }
}
