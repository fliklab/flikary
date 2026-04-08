// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { slugifyStr } from "@utils/content/text"; // TODO: re-enable for shared element transition
import type { CollectionEntry } from "astro:content";

export interface Props {
  href?: string;
  frontmatter: CollectionEntry<"blog">["data"];
  secHeading?: boolean;
}

export default function ArticleCard({
  href,
  frontmatter,
  secHeading = true,
}: Props) {
  const {
    title,
    pubDatetime,
    modDatetime,
    description,
    ulternativeUrl,
    tags = [],
  } = frontmatter;

  const headerProps = {
    // style: { viewTransitionName: slugifyStr(title) }, // TODO: re-enable shared element transition
    className: "card-title",
  };

  const displayTags = tags.slice(0, 3);
  const primaryLink = ulternativeUrl ?? href;
  const formattedDate = formatCardDate(
    modDatetime && modDatetime > pubDatetime ? modDatetime : pubDatetime
  );

  return (
    <li className="my-10">
      <a
        href={primaryLink}
        target={ulternativeUrl ? "_blank" : undefined}
        rel={ulternativeUrl ? "noopener noreferrer" : undefined}
        className="glass-card focus-visible:outline-none"
      >
        <div className="card-layout">
          <div className="card-media" aria-hidden="true" />
          <div className="card-body">
            <div className="card-meta">
              <span>{formattedDate}</span>
            </div>
            {secHeading ? (
              <h2 {...headerProps}>{title}</h2>
            ) : (
              <h3 {...headerProps}>{title}</h3>
            )}
            <div>
              {displayTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {displayTags.map((tag: string) => (
                    <span className="tag-pill" key={`${title}-${tag}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <p className="card-description">{description}</p>
          </div>
        </div>
      </a>
    </li>
  );
}

const formatCardDate = (value: string | Date) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};
