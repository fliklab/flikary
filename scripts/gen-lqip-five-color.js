// scripts/gen-lqip-five-color.js
import { glob } from 'glob';
import { writeFile } from 'fs/promises';
import sharp from 'sharp';

// 5개 색상과 위치 인코더 구현 (JavaScript 버전)
class FiveColorEncoder {
  constructor() {
    this.type = 'five-color';
  }

  async encode(imagePath, metadata) {
    try {
      // 이미지를 16x16 크기로 축소하여 색상 분석
      const { data, info } = await sharp(imagePath)
        .resize(16, 16, { fit: 'cover', kernel: sharp.kernel.nearest })
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      // 5개 대표 색상과 위치 추출
      const fiveColorData = this.extractFiveColorsWithPositions(data, info.width, info.height);
      
      // JSON으로 직렬화 후 base64 인코딩
      const encoded = this.encodeToBase64(fiveColorData);

      return {
        encoded,
        width: metadata.width,
        height: metadata.height,
        encoderType: this.type
      };
    } catch (error) {
      throw new Error(`5개 색상 인코딩 실패: ${error}`);
    }
  }

  /**
   * 16x16 이미지에서 5개 대표 색상과 각 색상의 위치들 추출
   */
  extractFiveColorsWithPositions(data, width, height) {
    const pixels = [];
    const bytesPerPixel = 4; // RGBA

    // 모든 픽셀 정보 수집
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const offset = (y * width + x) * bytesPerPixel;
        const color = {
          r: data[offset],
          g: data[offset + 1],
          b: data[offset + 2]
        };
        const position = {
          x: x / (width - 1), // 0.0 ~ 1.0으로 정규화
          y: y / (height - 1)
        };
        pixels.push({ color, position });
      }
    }

    // K-means 클러스터링으로 5개 대표 색상 찾기
    const clusters = this.kMeansCluster(pixels, 5);
    
    // 각 클러스터에서 대표 색상과 위치들 선택
    const colors = clusters.map(cluster => {
      const centroidColor = this.calculateCentroidColor(cluster.map(p => p.color));
      
      // 각 클러스터에서 최대 3개 위치 선택 (분산되게)
      const selectedPositions = this.selectRepresentativePositions(cluster.map(p => p.position), 3);
      
      return {
        color: centroidColor,
        positions: selectedPositions
      };
    });

    return { colors };
  }

  /**
   * 간단한 K-means 클러스터링 구현
   */
  kMeansCluster(pixels, k) {
    // 초기 중심점들을 랜덤하게 선택
    const centroids = [];
    for (let i = 0; i < k; i++) {
      const randomIndex = Math.floor(Math.random() * pixels.length);
      centroids.push({ ...pixels[randomIndex].color });
    }

    let clusters = [];
    let maxIterations = 10;

    for (let iter = 0; iter < maxIterations; iter++) {
      // 클러스터 초기화
      clusters = Array(k).fill(null).map(() => []);

      // 각 픽셀을 가장 가까운 중심점에 할당
      for (const pixel of pixels) {
        let minDistance = Infinity;
        let closestCluster = 0;

        for (let i = 0; i < centroids.length; i++) {
          const distance = this.colorDistance(pixel.color, centroids[i]);
          if (distance < minDistance) {
            minDistance = distance;
            closestCluster = i;
          }
        }

        clusters[closestCluster].push(pixel);
      }

      // 새로운 중심점 계산
      const newCentroids = clusters.map(cluster => {
        if (cluster.length === 0) return centroids[0]; // 빈 클러스터 방지
        return this.calculateCentroidColor(cluster.map(p => p.color));
      });

      // 수렴 확인
      let converged = true;
      for (let i = 0; i < centroids.length; i++) {
        if (this.colorDistance(centroids[i], newCentroids[i]) > 5) {
          converged = false;
          break;
        }
      }

      centroids.splice(0, centroids.length, ...newCentroids);

      if (converged) break;
    }

    // 빈 클러스터 제거
    return clusters.filter(cluster => cluster.length > 0);
  }

  /**
   * 두 색상 간의 유클리드 거리 계산
   */
  colorDistance(color1, color2) {
    const dr = color1.r - color2.r;
    const dg = color1.g - color2.g;
    const db = color1.b - color2.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  /**
   * 색상들의 중심점(평균) 계산
   */
  calculateCentroidColor(colors) {
    if (colors.length === 0) return { r: 0, g: 0, b: 0 };

    const sum = colors.reduce(
      (acc, color) => ({
        r: acc.r + color.r,
        g: acc.g + color.g,
        b: acc.b + color.b
      }),
      { r: 0, g: 0, b: 0 }
    );

    return {
      r: Math.round(sum.r / colors.length),
      g: Math.round(sum.g / colors.length),
      b: Math.round(sum.b / colors.length)
    };
  }

  /**
   * 위치들 중에서 대표적인 위치 선택 (분산되게)
   */
  selectRepresentativePositions(positions, maxCount) {
    if (positions.length <= maxCount) {
      return positions;
    }

    // 중심에서 가장 먼 위치들을 우선 선택
    const center = { x: 0.5, y: 0.5 };
    const sorted = positions.sort((a, b) => {
      const distA = Math.sqrt((a.x - center.x) ** 2 + (a.y - center.y) ** 2);
      const distB = Math.sqrt((b.x - center.x) ** 2 + (b.y - center.y) ** 2);
      return distB - distA; // 내림차순
    });

    // 분산되게 선택 (거리 기반)
    const selected = [sorted[0]]; // 가장 먼 위치부터
    
    for (let i = 1; i < sorted.length && selected.length < maxCount; i++) {
      const candidate = sorted[i];
      let minDistToSelected = Infinity;
      
      // 이미 선택된 위치들과의 최소 거리 계산
      for (const sel of selected) {
        const dist = Math.sqrt((candidate.x - sel.x) ** 2 + (candidate.y - sel.y) ** 2);
        minDistToSelected = Math.min(minDistToSelected, dist);
      }
      
      // 충분히 떨어져 있으면 선택
      if (minDistToSelected > 0.2) { // 20% 이상 떨어져 있어야 함
        selected.push(candidate);
      }
    }

    return selected;
  }

  /**
   * 5개 색상 데이터를 base64로 인코딩
   */
  encodeToBase64(fiveColorData) {
    const jsonString = JSON.stringify(fiveColorData);
    return Buffer.from(jsonString, 'utf-8').toString('base64');
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
  
  // LQIP 인코더 생성 (5개 색상 방식)
  const encoder = new FiveColorEncoder();
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
  console.log(`📊 총 ${Object.keys(lqipData).length}개 이미지 처리됨 (5개 색상 방식)`);
}

// 스크립트 실행
main(); 