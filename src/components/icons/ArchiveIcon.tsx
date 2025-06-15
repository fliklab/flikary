import React from "react";

interface ArchiveIconProps {
  className?: string;
  ariaHidden?: boolean;
}

const ArchiveIcon: React.FC<ArchiveIconProps> = ({
  className = "",
  ariaHidden = true,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
    <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-10" />
    <path d="M10 12l4 0" />
  </svg>
);

export default ArchiveIcon;
