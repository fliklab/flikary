interface ArticleCardSkeletonProps {
  count?: number;
}

function SkeletonItem() {
  return (
    <li className="article-card-skeleton">
      <div className="skeleton-card glass-card">
        <div className="skeleton-layout">
          <div className="skeleton-body">
            <div className="skeleton-meta" />
            <div className="skeleton-title" />
            <div className="skeleton-tags">
              <span className="skeleton-tag" />
              <span className="skeleton-tag" />
            </div>
            <div className="skeleton-description">
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
            </div>
          </div>
          <div className="skeleton-media" />
        </div>
      </div>
    </li>
  );
}

export default function ArticleCardSkeleton({
  count = 3,
}: ArticleCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonItem key={i} />
      ))}
    </>
  );
}
