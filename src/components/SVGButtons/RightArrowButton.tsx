import React from "react";
import RightArrowIcon from "../icons/RightArrowIcon";

interface RightArrowButtonProps {
  className?: string;
  title?: string;
}

const RightArrowButton = ({
  className = "",
  title = "Right Arrow",
}: RightArrowButtonProps) => (
  <RightArrowIcon className={className} ariaHidden={true} title={title} />
);

export default RightArrowButton;
