import React from "react";

interface NavMenuWrapperProps {
  open: boolean;
  styleConstants: [];
  children: React.ReactNode;
}

export default function NavMenuWrapper({
  open,
  styleConstants,
  children,
}: NavMenuWrapperProps) {
  const { timing, size, position, background } = styleConstants;

  // md가 테스그탑
  // 모바일은 xs
  return (
    <div
      className={`fixed translate-y-[20px] md:-translate-y-[25px] ${position.mobile.wrapper} flex items-center justify-center overflow-hidden rounded-[28px] ${background.base} shadow-lg ${background.blur} transition-all ${timing.duration} ${timing.ease} md:absolute md:${position.desktop.wrapper} ${
        open
          ? `z-50 min-w-[200px] max-w-[600px] md:${size.menu.desktop.open.height} right-0 max-h-[100px] min-h-14 p-10 md:p-0`
          : `z-50 ${size.menu.mobile.closed.width} md:${size.menu.desktop.closed.width} h-14`
      } ${open ? "md:-translate-y-1/2" : ""} border-red-500`}
      style={{
        transitionProperty:
          "width, height, padding, border-radius, background, box-shadow, transform",
      }}
    >
      {children}
    </div>
  );
}
