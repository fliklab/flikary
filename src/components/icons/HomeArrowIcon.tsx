import React from "react";

interface HomeArrowIconProps {
  className?: string;
  ariaHidden?: boolean;
}

const HomeArrowIcon: React.FC<HomeArrowIconProps> = ({
  className = "",
  ariaHidden = true,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden={ariaHidden}
  >
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

export default HomeArrowIcon;
