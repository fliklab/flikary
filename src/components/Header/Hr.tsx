import React from "react";

interface HrProps {
  noPadding?: boolean;
  ariaHidden?: boolean;
}

export default function Hr({ noPadding = false, ariaHidden = true }: HrProps) {
  return (
    <div className={`mx-auto max-w-3xl ${noPadding ? "px-0" : "px-4"}`}>
      <hr className="border-skin-line" aria-hidden={ariaHidden} />
    </div>
  );
}
