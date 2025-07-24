const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 반응형 이미지 설정
const RESPONSIVE_SIZES = {
  compact: [320, 480, 640, 768, 960],
  full: [480, 768, 1024, 1280, 1536]
};

const OUTPUT_FORMATS = ['webp', 'jpg'];
const QUALITY = 80;

async function generateResponsiveImages() {
  console.log('🖼️  반응형 이미지 생성 시작...');
  
  // 모든 블로그 이미지 찾기
  const imagePattern = 'src/content/blog/**/*.{jpg,jpeg,png,webp,gif}';
  const images = glob.sync(imagePattern);
  
  console.log(`📁 발견된 이미지: ${images.length}개`);
  
  const imageManifest = {};
  
  for (const imagePath of images) {
    const parsed = path.parse(imagePath);
    const relativePath = path.relative('src/content/blog', imagePath);
    const [blogSlug] = relativePath.split('/');
    
    // 출력 디렉토리 생성
    const outputDir = path.join('public/responsive-images', blogSlug);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    console.log(`📸 처리 중: ${relativePath}`);
    
    // 이미지 정보 읽기
    const imageBuffer = fs.readFileSync(imagePath);
    const metadata = await sharp(imageBuffer).metadata();
    
    // 각 사이즈별로 이미지 생성
    const generatedImages = {
      compact: {},
      full: {}
    };
    
    for (const [sizeType, sizes] of Object.entries(RESPONSIVE_SIZES)) {
      for (const width of sizes) {
        // 원본보다 큰 사이즈는 스킵
        if (width > metadata.width) continue;
        
        for (const format of OUTPUT_FORMATS) {
          const filename = `${parsed.name}-${width}w.${format}`;
          const outputPath = path.join(outputDir, filename);
          const publicPath = `/responsive-images/${blogSlug}/${filename}`;
          
          try {
            await sharp(imageBuffer)
              .resize(width, null, { 
                withoutEnlargement: true,
                fit: 'inside'
              })
              .toFormat(format, { quality: QUALITY })
              .toFile(outputPath);
            
            if (!generatedImages[sizeType][format]) {
              generatedImages[sizeType][format] = [];
            }
            
            generatedImages[sizeType][format].push({
              width,
              path: publicPath,
              size: fs.statSync(outputPath).size
            });
            
          } catch (error) {
            console.warn(`⚠️  실패: ${filename}`, error.message);
          }
        }
      }
    }
    
    // 이미지 매니페스트에 추가
    const originalName = `${parsed.name}${parsed.ext}`;
    if (!imageManifest[blogSlug]) {
      imageManifest[blogSlug] = {};
    }
    
    imageManifest[blogSlug][originalName] = {
      original: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format
      },
      responsive: generatedImages
    };
    
    console.log(`✅ 완료: ${originalName} (${Object.values(generatedImages).flat().length}개 사이즈)`);
  }
  
  // 매니페스트 파일 저장
  const manifestPath = 'src/data/responsive-images.json';
  fs.writeFileSync(manifestPath, JSON.stringify(imageManifest, null, 2));
  
  console.log(`🎉 반응형 이미지 생성 완료!`);
  console.log(`📊 총 ${images.length}개 이미지 처리`);
  console.log(`📄 매니페스트 저장: ${manifestPath}`);
}

// 스크립트 실행
if (require.main === module) {
  generateResponsiveImages().catch(console.error);
}

module.exports = { generateResponsiveImages }; 