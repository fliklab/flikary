interface TagPillProps {
  tag: string;
  variant?: "default" | "hash"; // default: 태그만, hash: #태그 형태
  className?: string;
}

/**
 * 카드 내에서 사용하는 태그 표시 컴포넌트
 * 기존 Tag.astro와 달리 링크가 아닌 단순 표시용
 */
export default function TagPill({
  tag,
  variant = "default",
  className = "",
}: TagPillProps) {
  const displayText = variant === "hash" ? `#${tag}` : tag;

  return (
    <span className={`tag-pill ${className}`}>
      {displayText}
    </span>
  );
}

interface TagListProps {
  tags: string[];
  maxTags?: number;
  variant?: "default" | "hash";
  className?: string;
}

/**
 * 여러 태그를 표시하는 컴포넌트
 */
export function TagList({
  tags,
  maxTags = 3,
  variant = "hash",
  className = "",
}: TagListProps) {
  const displayTags = tags.slice(0, maxTags);

  if (displayTags.length === 0) return null;

  return (
    <div className={`tag-list ${className}`}>
      {displayTags.map((tag) => (
        <TagPill key={tag} tag={tag} variant={variant} />
      ))}
    </div>
  );
}

