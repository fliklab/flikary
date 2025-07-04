import React from "react";
import HamburgerIcon from "../icons/HamburgerIcon";

interface HamburgerButtonProps {
  expanded: boolean;
  onClick: () => void;
}

export default function HamburgerButton({
  expanded,
  onClick,
}: HamburgerButtonProps) {
  return (
    <button
      className="hamburger-menu focus-outline self-end p-2 sm:hidden"
      aria-label={expanded ? "Close Menu" : "Open Menu"}
      aria-expanded={expanded}
      aria-controls="menu-items"
      onClick={onClick}
      type="button"
    >
      <HamburgerIcon expanded={expanded} />
    </button>
  );
}
