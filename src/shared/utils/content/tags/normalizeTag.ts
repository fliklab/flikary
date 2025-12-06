import tagAliases from "@data/tag-aliases.json";

type TagAliases = typeof tagAliases;

// 별칭에서 정규화된 태그명으로 변환하는 맵 생성
const aliasToCanonicalMap = new Map<string, string>();

// 빌드 타임에 맵 초기화
Object.entries(tagAliases.aliases).forEach(([canonical, aliases]) => {
  // 정규화된 태그 자체도 맵에 추가 (소문자로)
  aliasToCanonicalMap.set(canonical.toLowerCase(), canonical);
  // 모든 별칭을 정규화된 태그로 매핑
  (aliases as string[]).forEach(alias => {
    aliasToCanonicalMap.set(alias.toLowerCase(), canonical);
  });
});

/**
 * 태그명을 정규화된 형태로 변환
 * @param tag - 원본 태그명
 * @returns 정규화된 태그명 (별칭이 없으면 원본 반환)
 */
export function normalizeTag(tag: string): string {
  const canonical = aliasToCanonicalMap.get(tag.toLowerCase());
  return canonical ?? tag;
}

/**
 * 태그 목록을 정규화하고 중복 제거
 * @param tags - 원본 태그 목록
 * @returns 정규화된 고유 태그 목록
 */
export function normalizeTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const tag of tags) {
    const normalized = normalizeTag(tag);
    const key = normalized.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(normalized);
    }
  }

  return result;
}
