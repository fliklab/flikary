import React from "react";

interface GoBackButtonProps {
  // onClick?: () => void;
  className?: string;
  label?: string;
}

const GoBackButton = ({ className = "", label }: GoBackButtonProps) => {
  return (
    <button
      type="button"
      className={`focus-outline mb-2 mt-8 flex hover:opacity-75 ${className}`}
      onClick={() => {
        if (window.history.length === 1) window.location.href = "/";
        else window.history.back();
      }}
      aria-label={label}
    >
      <svg xmlns="http://www.w3.org/2000/svg">
        <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z" />
      </svg>
      <span>{label}</span>
    </button>
  );
};

export default GoBackButton;
