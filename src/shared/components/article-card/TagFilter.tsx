interface TagItem {
  slug: string;
  name: string;
}

interface TagFilterProps {
  tags: TagItem[];
  activeTag?: string;
  maxVisible?: number;
  className?: string;
}

/**
 * 태그 필터 버튼 그룹 컴포넌트
 * 블로그 리스트 페이지에서 태그 필터링용으로 사용
 * - 빈도수 순으로 정렬된 태그를 받아 표시
 * - 1줄로 제한하여 표시하고, 더 많은 태그는 "..." 버튼으로 태그 페이지로 이동
 */
export default function TagFilter({
  tags,
  activeTag,
  maxVisible = 6,
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
          key={tag.slug}
          href={`/tags/${tag.slug}/`}
          className={`tag-filter-btn ${activeTag === tag.slug ? "active" : ""}`}
          aria-current={activeTag === tag.slug ? "page" : undefined}
        >
          #{tag.name}
        </a>
      ))}

      {hasMore && (
        <a
          href="/tags/"
          className="tag-filter-btn tag-filter-more"
          title="모든 태그 보기"
        >
          ...
        </a>
      )}
    </nav>
  );
}

