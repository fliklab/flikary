import React from "react";

interface RightArrowButtonProps {
  className?: string;
  ariaLabel?: string;
  title?: string;
}

const RightArrowButton = ({
  className = "",
  ariaLabel = "오른쪽 화살표",
  title = "Right Arrow",
}: RightArrowButtonProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label={ariaLabel}
    focusable="false"
    role="img"
  >
    {title && <title>{title}</title>}
    <path d="m11.293 17.293 1.414 1.414L19.414 12l-6.707-6.707-1.414 1.414L15.586 11H6v2h9.586z" />
  </svg>
);

export default RightArrowButton;
