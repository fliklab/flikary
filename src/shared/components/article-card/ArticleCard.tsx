import type { ArticleCardProps } from "./types";
import { getDisplayDate } from "./types";
import { TagList } from "./TagPill";

export default function ArticleCard({
  href,
  frontmatter,
  secHeading = true,
}: ArticleCardProps) {
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
    className: "article-card-title",
  };

  return (
    <li className="article-card-wrapper">
      <a
        href={primaryLink}
        target={ulternativeUrl ? "_blank" : undefined}
        rel={ulternativeUrl ? "noopener noreferrer" : undefined}
        className="article-card glass-card focus-visible:outline-none"
      >
        <div className="article-card-layout">
          {/* Content - Left */}
          <div className="article-card-body">
            <div className="article-card-meta">
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
              className="article-card-tags" 
            />

            {description && (
              <p className="article-card-description">{description}</p>
            )}
          </div>

          {/* Thumbnail - Right */}
          <div className="article-card-media" aria-hidden="true">
            <div className="article-media-gradient" />
          </div>
        </div>
      </a>
    </li>
  );
}

