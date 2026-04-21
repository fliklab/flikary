const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

const formatAbsoluteDate = (date: Date) =>
  new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Seoul",
  })
    .format(date)
    .replace(/\.\s?/g, ".")
    .replace(/\.$/, "")
    .replace(/^(\d{4})\.(\d{2})\.(\d{2})$/, "$1년 $2월 $3일");

export const formatFeedDateLabel = (date: Date, now = new Date()) => {
  const diff = now.getTime() - date.getTime();

  if (diff < HOUR) {
    const minutes = Math.max(1, Math.floor(diff / (60 * 1000)));
    return `${minutes}분 전`;
  }

  if (diff < DAY) {
    const hours = Math.max(1, Math.floor(diff / HOUR));
    return `${hours}시간 전`;
  }

  if (diff < WEEK) {
    const days = Math.max(1, Math.floor(diff / DAY));
    return `${days}일 전`;
  }

  if (diff < 30 * DAY) {
    const weeks = Math.max(1, Math.floor(diff / WEEK));
    return `${weeks}주 전`;
  }

  return formatAbsoluteDate(date);
};
