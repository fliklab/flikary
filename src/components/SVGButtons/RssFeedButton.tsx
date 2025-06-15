import React from "react";

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
    <svg xmlns="http://www.w3.org/2000/svg" className="rss-icon">
      <path d="M19 20.001C19 11.729 12.271 5 4 5v2c7.168 0 13 5.832 13 13.001h2z" />
      <path d="M12 20.001h2C14 14.486 9.514 10 4 10v2c4.411 0 8 3.589 8 8.001z" />
      <circle cx="6" cy="18" r="2" />
    </svg>
    <span className="sr-only">RSS Feed</span>
  </a>
);

export default RssFeedButton;
