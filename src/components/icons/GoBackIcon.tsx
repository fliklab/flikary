import React from "react";

interface GoBackIconProps {
  className?: string;
  ariaHidden?: boolean;
}

const GoBackIcon: React.FC<GoBackIconProps> = ({
  className = "",
  ariaHidden = true,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden={ariaHidden}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z" />
  </svg>
);

export default GoBackIcon;
