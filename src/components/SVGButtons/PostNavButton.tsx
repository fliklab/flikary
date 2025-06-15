import React from "react";
import ChevronLeftIcon from "../icons/ChevronLeftIcon";
import ChevronRightIcon from "../icons/ChevronRightIcon";

interface PostNavButtonProps {
  direction: "prev" | "next";
  title: string;
  href: string;
  className?: string;
  children?: React.ReactNode;
}

const icons = {
  prev: (
    <ChevronLeftIcon
      className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left flex-none"
      ariaHidden={true}
    />
  ),
  next: (
    <ChevronRightIcon
      className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right flex-none"
      ariaHidden={true}
    />
  ),
};

const PostNavButton = ({
  direction,
  title,
  href,
  className = "",
  children,
}: PostNavButtonProps) => (
  <a
    href={href}
    className={`flex w-full gap-1 hover:opacity-75 ${direction === "next" ? "justify-end text-right sm:col-start-2" : ""} ${className}`}
  >
    {direction === "prev" && icons.prev}
    <div>
      {children}
      <div className="text-sm text-skin-accent/85">{title}</div>
    </div>
    {direction === "next" && icons.next}
  </a>
);

export default PostNavButton;
