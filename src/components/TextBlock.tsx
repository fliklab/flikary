import React from "react";
import MarkdownText from "./MarkdownText";

interface TextBlockProps {
  title?: string;
  content: string | string[];
  contentSize?: "sm" | "m" | "lg";
  asList?: boolean;
  className?: string;
}

export default function TextBlock({
  title,
  content,
  contentSize = "m",
  asList = true,
  className = "",
}: TextBlockProps) {
  return (
    <div className={`text-block ${className}`}>
      {title && <h4 className="mb-1 font-medium">{title}</h4>}
      <MarkdownText
        content={content}
        fontSize={contentSize}
        listType={asList ? "disc" : "none"}
      />
    </div>
  );
}
