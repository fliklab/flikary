import React from "react";
import TagIcon from "./icons/TagIcon";

interface TagProps {
  tag: string;
  tagName: string;
  size?: "sm" | "lg";
}

const Tag: React.FC<TagProps> = ({ tag, tagName, size = "sm" }) => (
  <li
    className={`inline-block ${
      size === "sm" ? "my-1 underline-offset-4" : "mx-1 my-3 underline-offset-8"
    }`}
  >
    <a
      href={`/tags/${tag}/`}
      className={`${size === "sm" ? "text-sm" : "text-lg"} group relative flex items-center pr-2 underline decoration-dashed hover:-top-0.5 hover:text-skin-accent focus-visible:p-1`}
    >
      <TagIcon
        className={`inline-block ${size === "sm" ? "h-5 w-5" : "h-6 w-6"} text-skin-base opacity-80 group-hover:fill-skin-accent`}
        ariaHidden={true}
      />
      &nbsp;<span>{tagName}</span>
    </a>
  </li>
);

export default Tag;
