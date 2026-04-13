import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import type { FontStyle, FontWeight } from "satori";
import font400Url from "./assets/ibm-plex-sans-kr-400.ttf?url";
import font700Url from "./assets/ibm-plex-sans-kr-700.ttf?url";

export type FontOptions = {
  name: string;
  data: ArrayBuffer;
  weight: FontWeight | undefined;
  style: FontStyle | undefined;
};

async function loadLocalFont(fontUrl: string): Promise<ArrayBuffer> {
  const resolvedUrl = fontUrl.startsWith("/_astro/")
    ? new URL(`..${fontUrl}`, import.meta.url)
    : new URL(fontUrl, import.meta.url);
  const filePath = fileURLToPath(resolvedUrl);
  const fontBuffer = await readFile(filePath);
  return fontBuffer.buffer.slice(
    fontBuffer.byteOffset,
    fontBuffer.byteOffset + fontBuffer.byteLength
  );
}

export async function loadGoogleFonts(
  _text: string
): Promise<
  Array<{ name: string; data: ArrayBuffer; weight: number; style: string }>
> {
  const fontsConfig = [
    {
      name: "IBM Plex Sans KR",
      path: font400Url,
      weight: 400,
      style: "normal",
    },
    {
      name: "IBM Plex Sans KR",
      path: font700Url,
      weight: 700,
      style: "bold",
    },
  ];

  const fonts = await Promise.all(
    fontsConfig.map(async ({ name, path, weight, style }) => {
      const data = await loadLocalFont(path);
      return { name, data, weight, style };
    })
  );

  return fonts;
}
