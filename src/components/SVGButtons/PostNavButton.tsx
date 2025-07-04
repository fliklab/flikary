import React from "react";

interface PostNavButtonProps {
  direction: "prev" | "next";
  title: string;
  href: string;
  className?: string;
  children?: React.ReactNode;
}

const icons = {
  prev: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left flex-none"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M15 6l-6 6l6 6" />
    </svg>
  ),
  next: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right flex-none"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M9 6l6 6l-6 6" />
    </svg>
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
