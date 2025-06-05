import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { glob } from 'glob';

async function convertImages() {
  try {
    // PNG 파일 찾기
    const pngFiles = await glob('src/content/blog/**/*.png');
    
    for (const pngFile of pngFiles) {
      const dirPath = path.dirname(pngFile);
      const baseName = path.basename(pngFile, '.png');
      const webpPath = path.join(dirPath, `${baseName}.webp`);
      
      // webp로 변환
      await sharp(pngFile)
        .webp({ quality: 80 })
        .toFile(webpPath);
      
      console.log(`Converted: ${pngFile} -> ${webpPath}`);
      
      // 해당 디렉토리의 모든 마크다운 파일 찾기
      const mdFiles = await glob(path.join(dirPath, '*.md'));
      
      for (const mdFile of mdFiles) {
        let content = await fs.readFile(mdFile, 'utf8');
        
        // PNG 파일명을 WEBP로 변경
        const regex = new RegExp(`${baseName}\\.png`, 'g');
        if (content.match(regex)) {
          content = content.replace(regex, `${baseName}.webp`);
          await fs.writeFile(mdFile, content, 'utf8');
          console.log(`Updated references in: ${mdFile}`);
        }
      }
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

convertImages(); 