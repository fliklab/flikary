import React from "react";

interface IconListProps {
  open: boolean;
  iconItems: { label: string; href: string; icon: string }[];
  navItemsLength: number;
  styleConstants: {
    timing: {
      duration: string;
      ease: string;
      menuDelay: string;
    };
  };
}

export default function IconList({
  open,
  iconItems,
  navItemsLength,
  styleConstants,
}: IconListProps) {
  const { timing, menuItems } = styleConstants;
  return (
    <ul className="ml-0 mt-0 flex items-center gap-2">
      {iconItems.map((item, idx) => (
        <li
          key={item.label}
          className={`transition-all ${timing.duration} ${timing.ease} ${open ? menuItems.final : menuItems.initial}`}
          style={{
            transitionDelay: open
              ? `${(idx + navItemsLength) * menuItems.delayIncrement + menuItems.delayBase + menuItems.iconDelayOffset}ms`
              : "0ms",
          }}
        >
          <a
            href={item.href}
            className="flex h-8 w-8 items-center justify-center rounded-[28px] text-skin-base transition-colors duration-200 hover:text-skin-accent"
            aria-label={item.label}
            dangerouslySetInnerHTML={{ __html: item.icon || "" }}
          />
        </li>
      ))}
    </ul>
  );
}
