// scripts/gen-lqip.ts
import { glob } from 'glob';
import { writeFile } from 'fs/promises';
import * as sharp from 'sharp';
import { getDefaultLQIPProcessor } from '../src/utils/lqip/lqip-processor';
import type { LQIPData, ImageMetadata } from '../src/types/lqip';

// LQIP 데이터 저장 형식
type LQIPDataStorage = Record<string, LQIPData>;

async function main() {
  try {
    await generateLQIPData();
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

async function generateLQIPData() {
  console.log('🔍 이미지 파일들을 찾는 중...');
  
  // content/blog 폴더에서 모든 이미지 찾기
  const imageFiles = await glob('src/content/blog/**/*.{jpg,jpeg,png,webp}');
  
  if (imageFiles.length === 0) {
    console.log('⚠️ 처리할 이미지를 찾지 못했습니다.');
    return;
  }

  console.log(`📁 총 ${imageFiles.length}개의 이미지를 찾았습니다.`);
  
  // LQIP 프로세서 가져오기
  const processor = getDefaultLQIPProcessor();
  const lqipData: LQIPDataStorage = {};
  
  for (const imagePath of imageFiles) {
    console.log(`📸 처리 중: ${imagePath}`);
    
    try {
      // 1. 원본 이미지 메타데이터 얻기
      const imageInfo = await sharp(imagePath).metadata();
      
      if (!imageInfo.width || !imageInfo.height) {
        console.warn(`⚠️ ${imagePath}: 이미지 크기 정보를 읽을 수 없습니다.`);
        continue;
      }

      // 2. 이미지 메타데이터 생성
      const metadata: ImageMetadata = {
        width: imageInfo.width,
        height: imageInfo.height,
        path: imagePath
      };
      
      // 3. LQIP 데이터 인코딩
      const lqipInfo = await processor.encoder.encode(imagePath, metadata);
      
      // 4. 파일 경로를 키로 해서 LQIP 데이터 저장
      // 'src/content/blog/my-post/hero.jpg' → 'blog/my-post/hero.jpg'
      const relativePath = imagePath.replace('src/content/', '');
      lqipData[relativePath] = lqipInfo;
      
      console.log(`✅ ${relativePath}: 완료 (${lqipInfo.encoderType})`);
    } catch (error) {
      console.error(`❌ ${imagePath} 처리 중 오류 발생:`, error);
    }
  }
  
  // 5. JSON 파일로 저장
  const outputPath = 'src/data/lqip-data.json';
  await writeFile(
    outputPath,
    JSON.stringify(lqipData, null, 2)
  );
  
  console.log(`✅ LQIP 데이터 생성 완료! (${outputPath})`);
  console.log(`📊 총 ${Object.keys(lqipData).length}개 이미지 처리됨`);
}

// 스크립트 실행
main(); 