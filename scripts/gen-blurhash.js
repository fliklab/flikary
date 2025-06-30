// scripts/gen-blurhash.ts
import { encode } from 'blurhash';
import sharp from 'sharp';
import { glob } from 'glob';
import fs from 'fs/promises';

// 함수를 실행하는 부분 추가
async function main() {
  try {
    await generateBlogBlurHashes();
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

async function generateBlogBlurHashes() {
  console.log('🔍 이미지 파일들을 찾는 중...');
  
  // content/blog 폴더에서 모든 이미지 찾기
  const imageFiles = await glob('src/content/blog/**/*.{jpg,jpeg,png,webp}');
  
  if (imageFiles.length === 0) {
    console.log('⚠️ 처리할 이미지를 찾지 못했습니다.');
    return;
  }

  console.log(`📁 총 ${imageFiles.length}개의 이미지를 찾았습니다.`);
  
  const blurHashData = {};
  
  for (const imagePath of imageFiles) {
    console.log(`📸 처리 중: ${imagePath}`);
    
    try {
      // 1. 원본 이미지 크기 정보 얻기
      const originalImageInfo = await sharp(imagePath).metadata();
      
      // 2. 이미지를 32x32 크기로 축소하여 BlurHash 생성
      const { data, info } = await sharp(imagePath)
        .resize(32, 32, { fit: 'cover' })
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      
      // 3. 픽셀 데이터를 BlurHash 문자열로 변환
      const blurHash = encode(
        new Uint8ClampedArray(data),
        info.width,
        info.height,
        4, 4
      );
      
      // 4. 파일 경로를 키로 해서 BlurHash와 크기 정보 저장
      // 'src/content/blog/my-post/hero.jpg' → 'blog/my-post/hero.jpg'
      const relativePath = imagePath.replace('src/content/', '');
      blurHashData[relativePath] = {
        hash: blurHash,
        width: originalImageInfo.width || 0,
        height: originalImageInfo.height || 0
      };
    } catch (error) {
      console.error(`❌ ${imagePath} 처리 중 오류 발생:`, error);
    }
  }
  
  // 4. JSON 파일로 저장
  await fs.writeFile(
    'src/data/blurhash.json',
    JSON.stringify(blurHashData, null, 2)
  );
  
  console.log('✅ BlurHash 생성 완료!');
}

// 스크립트 실행
main();