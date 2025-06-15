import React from "react";

interface LinkButtonProps {
  href: string;
  className?: string;
  ariaLabel?: string;
  title?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export default function LinkButton({
  href,
  className = "",
  ariaLabel,
  title,
  disabled = false,
  children,
}: LinkButtonProps) {
  if (disabled) {
    return (
      <span
        className={`group inline-block ${className}`}
        title={title}
        aria-disabled={disabled}
      >
        {children}
      </span>
    );
  }
  return (
    <a
      href={href}
      className={`group inline-block hover:text-skin-accent ${className}`}
      aria-label={ariaLabel}
      title={title}
    >
      {children}
    </a>
  );
}
