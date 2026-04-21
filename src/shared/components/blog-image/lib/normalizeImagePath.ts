import { PATHS } from "@config";

const REGEXP_FS_MATCH = /\/@fs.*?\/src\/content\/((?:blog|feed)\/.+?)(\?|$)/;

// BlurHash 데이터 처리
export const normalizeImagePath = (
  path: string,
  slug: string,
  collection: "blog" | "feed"
): string => {
  // /@fs/absolute/path/src/content/blog/... -> blog/...
  const fsMatch = path.match(REGEXP_FS_MATCH);
  if (fsMatch) {
    return fsMatch[1];
  }

  // 일반적인 상대 경로 처리
  if (path.startsWith("./")) {
    const cleanSrc = path.replace(/^\.\//, "");
    return `${collection}/${slug}/${cleanSrc}`;
  }

  if (path.startsWith("blog/") || path.startsWith("feed/")) {
    return path;
  }

  return path;
};

export const getAbsoluteImagePath = (
  collection: "blog" | "feed",
  slug: string,
  imageSrc: string
) => {
  return `${PATHS.CONTENT_ROOT}/${collection}/${slug}/${imageSrc.replace("./", "")}`;
};
