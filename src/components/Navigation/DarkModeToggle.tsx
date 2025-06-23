import React from "react";

interface DarkModeToggleProps {
  open: boolean;
  navItemsLength: number;
  iconItemsLength: number;
  styleConstants: {
    timing: {
      duration: string;
      ease: string;
      menuDelay: string;
    };
  };
}

export default function DarkModeToggle({
  open,
  navItemsLength,
  iconItemsLength,
  styleConstants,
}: DarkModeToggleProps) {
  const { timing, menuItems } = styleConstants;

  return (
    <li
      className={`styleConstants list-none transition-all ${timing.duration} ${timing.ease} ${open ? menuItems.final : menuItems.initial}`}
      style={{
        transitionDelay: open
          ? `${(navItemsLength + iconItemsLength) * menuItems.delayIncrement + menuItems.delayBase + menuItems.themeDelayOffset}ms`
          : "0ms",
      }}
    >
      <button
        className="flex h-8 w-8 items-center justify-center rounded-full text-skin-base transition-colors duration-200 hover:text-skin-accent md:ml-2"
        onClick={() => {
          const currentTheme = localStorage.getItem("theme");
          const newTheme = currentTheme === "light" ? "dark" : "light";
          localStorage.setItem("theme", newTheme);
          document.firstElementChild?.setAttribute("data-theme", newTheme);
          const body = document.body;
          if (body) {
            const computedStyles = window.getComputedStyle(body);
            const bgColor = computedStyles.backgroundColor;
            document
              .querySelector("meta[name='theme-color']")
              ?.setAttribute("content", bgColor);
          }
        }}
        aria-label="Toggle dark mode"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          className="icon-tabler"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"></path>
        </svg>
      </button>
    </li>
  );
}
