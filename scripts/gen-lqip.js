// scripts/gen-lqip.js
import { glob } from 'glob';
import { writeFile } from 'fs/promises';
import sharp from 'sharp';

// 4개 픽셀 인코더 구현 (JavaScript 버전)
class FourPixelEncoder {
  constructor() {
    this.type = 'four-pixel';
  }

  async encode(imagePath, metadata) {
    try {
      // 이미지를 4x4 크기로 축소하여 픽셀 데이터 추출
      const { data, info } = await sharp(imagePath)
        .resize(4, 4, { fit: 'cover', kernel: sharp.kernel.nearest })
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      // 4개 모서리 픽셀의 색상 추출
      const pixelData = this.extractCornerPixels(data, info.width, info.height);
      
      // base64로 인코딩
      const encoded = this.encodeToBase64(pixelData);

      return {
        encoded,
        width: metadata.width,
        height: metadata.height,
        encoderType: this.type
      };
    } catch (error) {
      throw new Error(`4개 픽셀 인코딩 실패: ${error}`);
    }
  }

  /**
   * 4x4 이미지에서 4개 모서리 픽셀 색상 추출
   */
  extractCornerPixels(data, width, height) {
    const bytesPerPixel = 4; // RGBA
    
    // 4x4 이미지에서 모서리 좌표
    const corners = {
      topLeft: { x: 0, y: 0 },
      topRight: { x: width - 1, y: 0 },
      bottomLeft: { x: 0, y: height - 1 },
      bottomRight: { x: width - 1, y: height - 1 }
    };

    const getPixelColor = (x, y) => {
      const offset = (y * width + x) * bytesPerPixel;
      return {
        r: data[offset],
        g: data[offset + 1],
        b: data[offset + 2]
        // Alpha 채널은 무시
      };
    };

    return {
      topLeft: getPixelColor(corners.topLeft.x, corners.topLeft.y),
      topRight: getPixelColor(corners.topRight.x, corners.topRight.y),
      bottomLeft: getPixelColor(corners.bottomLeft.x, corners.bottomLeft.y),
      bottomRight: getPixelColor(corners.bottomRight.x, corners.bottomRight.y)
    };
  }

  /**
   * 4개 픽셀 데이터를 base64로 인코딩
   */
  encodeToBase64(pixelData) {
    // 각 색상을 바이트 배열로 변환 (RGB: 3바이트 * 4픽셀 = 12바이트)
    const buffer = new Uint8Array(12);
    let offset = 0;

    const colors = [
      pixelData.topLeft,
      pixelData.topRight,
      pixelData.bottomLeft,
      pixelData.bottomRight
    ];

    for (const color of colors) {
      buffer[offset++] = Math.round(color.r);
      buffer[offset++] = Math.round(color.g);
      buffer[offset++] = Math.round(color.b);
    }

    // Buffer를 base64로 인코딩
    return Buffer.from(buffer).toString('base64');
  }
}

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
  
  // LQIP 인코더 생성
  const encoder = new FourPixelEncoder();
  const lqipData = {};
  
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
      const metadata = {
        width: imageInfo.width,
        height: imageInfo.height,
        path: imagePath
      };
      
      // 3. LQIP 데이터 인코딩
      const lqipInfo = await encoder.encode(imagePath, metadata);
      
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