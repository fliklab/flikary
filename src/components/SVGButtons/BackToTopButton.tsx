import React from "react";

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
    <svg xmlns="http://www.w3.org/2000/svg" className="rotate-90">
      <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z" />
    </svg>
    {children}
  </button>
);

export default BackToTopButton;
