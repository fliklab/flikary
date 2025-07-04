import React from "react";
import GoBackIcon from "../icons/GoBackIcon";

interface BackToTopButtonProps {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const BackToTopButton = ({
  onClick,
  className = "",
  children,
}: BackToTopButtonProps) => (
  <button
    type="button"
    className={`focus-outline whitespace-nowrap py-1 hover:opacity-75 ${className}`}
    onClick={onClick}
  >
    <GoBackIcon className="rotate-90" ariaHidden={true} />
    {children}
  </button>
);

export default BackToTopButton;
