import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { glob } from 'glob';

// 변환 대상 확장자 (sharp가 모두 지원)
const SOURCE_EXTS = ['png', 'jpg', 'jpeg', 'JPG', 'JPEG'];

// 1. 원본 이미지 -> WebP 변환
const sourceFiles = await glob(
  `src/content/blog/**/*.{${SOURCE_EXTS.join(',')}}`
);
for (const srcFile of sourceFiles) {
  const ext = path.extname(srcFile); // 예: '.png', '.jpeg'
  const dirPath = path.dirname(srcFile);
  const baseName = path.basename(srcFile, ext);
  const webpPath = path.join(dirPath, `${baseName}.webp`);
  await sharp(srcFile).webp({ quality: 80 }).toFile(webpPath);
  console.log(`Converted: ${srcFile} -> ${webpPath}`);
}

// 2. 변환된 webp 경로 인덱스 빌드
const webpSet = new Set();
for (const w of await glob('src/content/blog/**/*.webp')) {
  webpSet.add(path.resolve(w));
}

// 3. 블로그의 모든 md/mdx 본문에서 .png / .jpg / .jpeg 참조를 .webp로 치환
//    (원본이 ./images/ 같은 서브디렉토리에 있을 수 있으므로
//     MDX 파일 기준으로 상대 경로를 resolve해 실존하는 webp만 치환)
const referenceRegex = /([^\s()"'`]+)\.(png|jpe?g)/gi;
const mdFiles = await glob('src/content/blog/**/*.{md,mdx}');
for (const mdFile of mdFiles) {
  const original = await fs.readFile(mdFile, 'utf8');
  const mdDir = path.dirname(mdFile);
  const updated = original.replace(referenceRegex, (match, stem) => {
    const resolvedWebp = path.resolve(mdDir, stem + '.webp');
    return webpSet.has(resolvedWebp) ? stem + '.webp' : match;
  });
  if (updated !== original) {
    await fs.writeFile(mdFile, updated, 'utf8');
    console.log(`Updated references in: ${mdFile}`);
  }
}
