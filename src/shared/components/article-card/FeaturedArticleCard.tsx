import type { FeaturedArticleCardProps } from "./types";
import { getDisplayDate, getThumbnailSrc } from "./types";
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
    thumbnail,
  } = frontmatter;

  const primaryLink = ulternativeUrl ?? href;
  const formattedDate = getDisplayDate(pubDatetime, modDatetime);
  const thumbnailSrc = getThumbnailSrc(thumbnail);

  const headerProps = {
    className: "featured-card-title",
  };

  return (
    <article className="featured-article-card">
      <a
        href={primaryLink}
        target={ulternativeUrl ? "_blank" : undefined}
        rel={ulternativeUrl ? "noopener noreferrer" : undefined}
        className={`featured-card-link focus-visible:outline-none ${!thumbnailSrc ? "no-thumbnail" : ""}`}
      >
        <div
          className={`featured-card-layout ${!thumbnailSrc ? "no-thumbnail" : ""}`}
        >
          {/* Thumbnail (only if exists) */}
          {thumbnailSrc && (
            <div className="featured-card-media" aria-hidden="true">
              <img
                src={thumbnailSrc}
                alt=""
                className="featured-card-thumbnail"
                loading="lazy"
              />
            </div>
          )}

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
