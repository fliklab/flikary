import React from "react";

interface RightArrowIconProps {
  className?: string;
  ariaHidden?: boolean;
  title?: string;
}

const RightArrowIcon: React.FC<RightArrowIconProps> = ({
  className = "",
  ariaHidden = true,
  title,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden={ariaHidden}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    {title && <title>{title}</title>}
    <path d="m11.293 17.293 1.414 1.414L19.414 12l-6.707-6.707-1.414 1.414L15.586 11H6v2h9.586z" />
  </svg>
);

export default RightArrowIcon;
