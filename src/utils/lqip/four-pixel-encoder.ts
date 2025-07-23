import * as sharp from "sharp";
import type {
  LQIPEncoder,
  LQIPData,
  ImageMetadata,
  FourPixelData,
  RGB,
} from "../../types/lqip";

/** 4개 픽셀 방식 LQIP 인코더 */
export class FourPixelEncoder implements LQIPEncoder {
  readonly type = "four-pixel";

  async encode(imagePath: string, metadata: ImageMetadata): Promise<LQIPData> {
    try {
      // 이미지를 4x4 크기로 축소하여 픽셀 데이터 추출
      const { data, info } = await sharp(imagePath)
        .resize(4, 4, { fit: "cover", kernel: sharp.kernel.nearest })
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
        encoderType: this.type,
      };
    } catch (error) {
      throw new Error(`4개 픽셀 인코딩 실패: ${error}`);
    }
  }

  /**
   * 4x4 이미지에서 4개 모서리 픽셀 색상 추출
   */
  private extractCornerPixels(
    data: Buffer,
    width: number,
    height: number
  ): FourPixelData {
    const bytesPerPixel = 4; // RGBA

    // 4x4 이미지에서 모서리 좌표
    const corners = {
      topLeft: { x: 0, y: 0 },
      topRight: { x: width - 1, y: 0 },
      bottomLeft: { x: 0, y: height - 1 },
      bottomRight: { x: width - 1, y: height - 1 },
    };

    const getPixelColor = (x: number, y: number): RGB => {
      const offset = (y * width + x) * bytesPerPixel;
      return {
        r: data[offset],
        g: data[offset + 1],
        b: data[offset + 2],
        // Alpha 채널은 무시
      };
    };

    return {
      topLeft: getPixelColor(corners.topLeft.x, corners.topLeft.y),
      topRight: getPixelColor(corners.topRight.x, corners.topRight.y),
      bottomLeft: getPixelColor(corners.bottomLeft.x, corners.bottomLeft.y),
      bottomRight: getPixelColor(corners.bottomRight.x, corners.bottomRight.y),
    };
  }

  /**
   * 4개 픽셀 데이터를 base64로 인코딩
   */
  private encodeToBase64(pixelData: FourPixelData): string {
    // 각 색상을 바이트 배열로 변환 (RGB: 3바이트 * 4픽셀 = 12바이트)
    const buffer = new Uint8Array(12);
    let offset = 0;

    const colors = [
      pixelData.topLeft,
      pixelData.topRight,
      pixelData.bottomLeft,
      pixelData.bottomRight,
    ];

    for (const color of colors) {
      buffer[offset++] = Math.round(color.r);
      buffer[offset++] = Math.round(color.g);
      buffer[offset++] = Math.round(color.b);
    }

    // Buffer를 base64로 인코딩
    return Buffer.from(buffer).toString("base64");
  }
}
