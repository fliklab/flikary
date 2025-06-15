import React from "react";
import { marked } from "marked";

interface MarkdownTextProps {
  content: string | string[];
  classOverride?: string;
  listType?: "disc" | "none";
  fontSize?: "sm" | "m" | "lg";
}

const fontClass = {
  sm: "text-sm",
  m: "text-m",
  lg: "text-lg",
};

export default function MarkdownText({
  content,
  listType = "disc",
  fontSize = "m",
  classOverride = "",
}: MarkdownTextProps) {
  const textClass = `${fontClass[fontSize]} text-gray-700 dark:text-gray-300`;
  const parseMarkdown = (text: string) => marked.parse(text);

  if (typeof content === "string") {
    return (
      <div
        className={`${textClass} ${classOverride}`}
        dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
      />
    );
  }
  if (Array.isArray(content)) {
    return (
      <ul
        className={`${listType === "disc" ? "list-disc pl-5" : ""} space-y-1`}
      >
        {content.map((item, idx) => (
          <li
            key={idx}
            className={`${textClass} ${classOverride}`}
            dangerouslySetInnerHTML={{ __html: parseMarkdown(item) }}
          />
        ))}
      </ul>
    );
  }
  return null;
}
