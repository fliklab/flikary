interface TagFilterProps {
  tags: string[];
  activeTag?: string;
  maxVisible?: number;
  className?: string;
}

/**
 * 태그 필터 버튼 그룹 컴포넌트
 * 블로그 리스트 페이지에서 태그 필터링용으로 사용
 */
export default function TagFilter({
  tags,
  activeTag,
  maxVisible = 4,
  className = "",
}: TagFilterProps) {
  const visibleTags = tags.slice(0, maxVisible);
  const hasMore = tags.length > maxVisible;

  return (
    <nav className={`tag-filter ${className}`} aria-label="Tag filter">
      <a
        href="/blog/"
        className={`tag-filter-btn ${!activeTag ? "active" : ""}`}
        aria-current={!activeTag ? "page" : undefined}
      >
        ALL
      </a>

      {visibleTags.map((tag) => (
        <a
          key={tag}
          href={`/tags/${tag}/`}
          className={`tag-filter-btn ${activeTag === tag ? "active" : ""}`}
          aria-current={activeTag === tag ? "page" : undefined}
        >
          #{tag}
        </a>
      ))}

      {hasMore && (
        <a href="/tags/" className="tag-filter-btn tag-filter-more">
          ...
        </a>
      )}
    </nav>
  );
}

