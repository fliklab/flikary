import type { FeaturedArticleCardProps } from "./types";
import { getDisplayDate } from "./types";
import { TagList } from "./TagPill";

export default function FeaturedArticleCard({
  href,
  frontmatter,
  secHeading = true,
}: FeaturedArticleCardProps) {
  const {
    title,
    pubDatetime,
    modDatetime,
    description,
    ulternativeUrl,
    tags = [],
  } = frontmatter;

  const primaryLink = ulternativeUrl ?? href;
  const formattedDate = getDisplayDate(pubDatetime, modDatetime);

  const headerProps = {
    className: "featured-card-title",
  };

  return (
    <article className="featured-article-card">
      <a
        href={primaryLink}
        target={ulternativeUrl ? "_blank" : undefined}
        rel={ulternativeUrl ? "noopener noreferrer" : undefined}
        className="featured-card-link focus-visible:outline-none"
      >
        <div className="featured-card-layout">
          {/* Thumbnail */}
          <div className="featured-card-media" aria-hidden="true">
            <div className="featured-media-gradient" />
          </div>

          {/* Content */}
          <div className="featured-card-body">
            <div className="featured-card-meta">
              <time dateTime={pubDatetime.toISOString()}>{formattedDate}</time>
            </div>

            {secHeading ? (
              <h2 {...headerProps}>{title}</h2>
            ) : (
              <h3 {...headerProps}>{title}</h3>
            )}

            <TagList 
              tags={tags} 
              maxTags={3} 
              variant="hash" 
              className="featured-card-tags" 
            />

            {description && (
              <p className="featured-card-description">{description}</p>
            )}
          </div>
        </div>
      </a>
    </article>
  );
}

