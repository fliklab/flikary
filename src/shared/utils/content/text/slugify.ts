/**
 * 문자열을 URL-safe slug로 변환
 * - 소문자로 변환
 * - 공백을 하이픈으로 변환
 * - 특수문자 제거
 * - 연속 하이픈 정리
 */
export const slugifyStr = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // 공백을 하이픈으로
    .replace(/[^\w가-힣\-]/g, "") // 영문, 숫자, 한글, 하이픈만 유지
    .replace(/--+/g, "-") // 연속 하이픈 정리
    .replace(/^-|-$/g, ""); // 시작/끝 하이픈 제거
};

export const slugifyAll = (arr: string[]) => arr.map(str => slugifyStr(str));
