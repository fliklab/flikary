import React from "react";

interface HamburgerIconProps {
  className?: string;
  ariaHidden?: boolean;
  expanded?: boolean;
}

const HamburgerIcon: React.FC<HamburgerIconProps> = ({
  className = "",
  ariaHidden = true,
  expanded = false,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`menu-icon h-6 w-6 scale-125 fill-skin-base${expanded ? "is-active" : ""} ${className}`}
    aria-hidden={ariaHidden}
  >
    <line x1="7" y1="12" x2="21" y2="12" className="line" />
    <line x1="3" y1="6" x2="21" y2="6" className="line" />
    <line x1="12" y1="18" x2="21" y2="18" className="line" />
    <line x1="18" y1="6" x2="6" y2="18" className="close" />
    <line x1="6" y1="6" x2="18" y2="18" className="close" />
  </svg>
);

export default HamburgerIcon;
