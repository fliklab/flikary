import blurHashData from "@data/blurhash.json";

const REGEXP_SLUG = /\/blog\/([^/]+)/;
const REGEXP_FILE_NAME = /\/([^/?#]+?\.(?:png|jpe?g|webp|gif|svg))/i;
const REGEXP_HAS_HASH = /^(.*)\.[A-Za-z0-9_-]{6,}\.(png|jpe?g|webp|gif|svg)$/i;

export const getSlugFromUrlPath = (urlPath: string) => {
  const slugMatch = urlPath.match(REGEXP_SLUG);
  return slugMatch ? slugMatch[1] : undefined;
};
export const getProperImageSrc = (
  src: string | { src: string; [key: string]: unknown }
) => {
  return typeof src === "object" ? src.src : src;
};

export const genImageUniqueId = () => {
  return `img-${Math.random().toString(36).substring(2, 9)}`;
};

// 파일명 추출 유틸 (프로덕션 빌드의 /_astro/* URL 대응)
export const extractFileName = (path: string): string | undefined => {
  if (!path) return undefined;
  const noQuery = path.split("?")[0];
  const match = noQuery.match(REGEXP_FILE_NAME);
  return match ? match[1] : undefined;
};

// Astro 빌드 해시가 삽입된 파일명에서 해시 제거: name.ABC123.ext -> name.ext
export const normalizeHashedFileName = (fileName: string): string => {
  const m = fileName.match(REGEXP_HAS_HASH);
  if (m) return `${m[1]}.${m[2]}`;
  return fileName;
};

//--------------------------------------------------------

// BlurHash 데이터 타입 정의
export type BlurHashEntry = {
  hash: string;
  width: number;
  height: number;
};

export type BlurHashData = Record<string, BlurHashEntry | undefined>;

// 파일명으로 BlurHash 검색 (slug 하위에서 매칭)
export const findEntryByFileName = (
  fileName: string,
  slug: string
): BlurHashEntry | undefined => {
  const entries = blurHashData as BlurHashData;
  const normalized = normalizeHashedFileName(fileName);

  // 1) 정확히 끝이 일치하는 키 우선
  let key = Object.keys(entries).find(
    k =>
      k.startsWith(`blog/${slug}/`) &&
      k.toLowerCase().endsWith(normalized.toLowerCase())
  );
  if (key) return entries[key];

  // 2) baseName + ext로 느슨 매칭 (혹시 대소문자나 경로 차이 대비)
  const lastDot = normalized.lastIndexOf(".");
  if (lastDot > 0) {
    const base = normalized.slice(0, lastDot).toLowerCase();
    const ext = normalized.slice(lastDot + 1).toLowerCase();
    key = Object.keys(entries).find(k => {
      if (!k.startsWith(`blog/${slug}/`)) return false;
      const name = k.split("/").pop() || "";
      const nameDot = name.lastIndexOf(".");
      if (nameDot <= 0) return false;
      const nBase = name.slice(0, nameDot).toLowerCase();
      const nExt = name.slice(nameDot + 1).toLowerCase();
      return nBase === base && nExt === ext;
    });
    if (key) return entries[key];
  }

  return undefined;
};
