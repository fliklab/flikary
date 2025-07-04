import React from "react";

interface ChevronRightIconProps {
  className?: string;
  ariaHidden?: boolean;
}

const ChevronRightIcon: React.FC<ChevronRightIconProps> = ({
  className = "",
  ariaHidden = true,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden={ariaHidden}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M9 6l6 6l-6 6" />
  </svg>
);

export default ChevronRightIcon;
