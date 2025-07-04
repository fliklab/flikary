import React from "react";
import RssIcon from "../icons/RssIcon";

interface RssFeedButtonProps {
  href?: string;
  className?: string;
  ariaLabel?: string;
  title?: string;
}

const RssFeedButton = ({
  href = "/rss.xml",
  className = "",
  ariaLabel = "rss feed",
  title = "RSS Feed",
}: RssFeedButtonProps) => (
  <a
    target="_blank"
    rel="noopener noreferrer"
    href={href}
    className={`rss-link ${className}`}
    aria-label={ariaLabel}
    title={title}
  >
    <RssIcon className="rss-icon" ariaHidden={true} />
    <span className="sr-only">RSS Feed</span>
  </a>
);

export default RssFeedButton;
