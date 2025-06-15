import React from "react";
import GoBackIcon from "../icons/GoBackIcon";

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
      <GoBackIcon ariaHidden={true} />
      <span>{label}</span>
    </button>
  );
};

export default GoBackButton;
