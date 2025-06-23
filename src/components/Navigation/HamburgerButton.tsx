import React from "react";

interface HamburgerButtonProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  styleConstants: {
    timing: {
      duration: string;
      ease: string;
      menuDelay: string;
    };
    size: {
      button: {
        width: string;
        height: string;
      };
    };
    position: {
      desktop: {
        button: {
          open: string;
          closed: string;
        };
      };
    };
  };
}

export default function HamburgerButton({
  open,
  setOpen,
  styleConstants,
}: HamburgerButtonProps) {
  const { timing, size, position } = styleConstants;
  return (
    <button
      aria-label={open ? "Close menu" : "Open menu"}
      className={`absolute right-0 top-0 z-20 flex ${size.button.width} ${size.button.height} rounded-[28px] transition-none ${timing.duration} ${timing.ease} ${
        open
          ? `md:${position.desktop.button.open} md:right-0`
          : position.desktop.button.closed
      }`}
      style={{
        background: "transparent",
        overflow: "visible",
      }}
      onClick={() => setOpen(v => !v)}
    >
      <div className="flex h-full w-full items-center justify-center">✻</div>
      {/* <div
        className={`relative ${hamburger.height} ${hamburger.width} overflow-visible`}
      >
        <span
          className={`absolute left-0 ${hamburger.lineHeight} ${hamburger.width} bg-skin-base color-white origin-center rounded-full transition-all duration-500 ${timing.ease} ${
            open
              ? `${hamburger.positions.open.all} translate-x-1 translate-y-1 rotate-45`
              : hamburger.positions.closed.top
          }`}
        >
          ➖
        </span>
        <span
          className={`absolute left-0 ${hamburger.lineHeight} ${hamburger.width} bg-skin-base color-white origin-center rounded-full transition-all duration-500 ${timing.ease} ${
            open
              ? `${hamburger.positions.open.all} translate-x-1 translate-y-1 rotate-45`
              : hamburger.positions.closed.top
          }`}
        >
          ➖
        </span>
        <span
          className={`absolute left-0 ${hamburger.lineHeight} ${hamburger.width} bg-skin-base origin-center rounded-full transition-all duration-500 ${timing.ease} ${
            open
              ? `${hamburger.positions.open.all} -translate-x-1 translate-y-1 -rotate-45`
              : hamburger.positions.closed.bottom
          }`}
        >
          ➖
        </span>
      </div> */}
    </button>
  );
}
