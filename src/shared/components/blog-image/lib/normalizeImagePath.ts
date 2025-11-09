import { PATHS } from "@config";

const REGEXP_FS_MATCH = /\/@fs.*?\/src\/content\/(blog\/.+?)(\?|$)/;

// BlurHash 데이터 처리
export const normalizeImagePath = (path: string, slug: string): string => {
  // /@fs/absolute/path/src/content/blog/... -> blog/...
  const fsMatch = path.match(REGEXP_FS_MATCH);
  if (fsMatch) {
    return fsMatch[1];
  }

  // 일반적인 상대 경로 처리
  if (path.startsWith("./")) {
    const cleanSrc = path.replace(/^\.\//, "");
    return `blog/${slug}/${cleanSrc}`;
  }

  if (path.startsWith("blog/")) {
    return path;
  }

  return path;
};

export const getAbsoluteImagePath = (slug: string, imageSrc: string) => {
  return `${PATHS.CONTENT}/${slug}/${imageSrc.replace("./", "")}`;
};
