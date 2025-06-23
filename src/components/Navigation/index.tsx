import { useState } from "react";
import NavMenuWrapper from "./NavMenuWrapper.tsx";
import HamburgerButton from "./HamburgerButton.tsx";
import NavMenu from "./NavMenu.tsx";

// 스타일 상수
const STYLE_CONSTANTS = {
  // 애니메이션 타이밍
  timing: {
    duration: "duration-700",
    ease: "ease-[cubic-bezier(0.34, 1.56, 0.64, 1)]",
    menuDelay: "delay-300",
  },

  // 메뉴 크기
  size: {
    button: {
      width: "w-14",
      height: "h-14",
    },
    menu: {
      mobile: {
        closed: {
          width: "w-14",
          height: "h-14",
        },
        open: {
          width: "w-80",
          height: "max-h-[100]",
        },
      },
      desktop: {
        closed: {
          width: "w-14",
          height: "h-14",
        },
        open: {
          width: "w-[600px]",
          height: "h-14",
        },
      },
    },
  },

  // 위치
  position: {
    mobile: {
      wrapper: "right-0 top-0",
      button: {
        closed: "-translate-y-1/2",
        open: "right-0 top-0", // "-translate-y-[500px]",
      },
    },
    desktop: {
      wrapper: "right-0",
      button: {
        closed: "left-1/2 -translate-x-1/2 ",
        open: "right-0",
      },
    },
  },

  // 배경 및 효과
  background: {
    base: "bg-white/5",
    hover: "hover:bg-white/10",
    blur: "backdrop-blur-md",
  },

  // 메뉴 아이템 트랜지션
  menuItems: {
    initial: "-translate-x-8 opacity-0",
    final: "translate-x-0 opacity-100",
    delayBase: 400,
    delayIncrement: 60,
    iconDelayOffset: 200,
    themeDelayOffset: 400,
  },

  // 햄버거 아이콘
  hamburger: {
    width: "w-6",
    height: "h-6",
    lineHeight: "h-0.5",
    positions: {
      closed: {
        top: "top-1",
        middle: "top-3",
        bottom: "top-5",
      },
      open: {
        all: "top-3 right-0",
      },
    },
  },
} as const;

interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Blog", href: "/blog/" },
  { label: "Resume", href: "/resume/" },
  { label: "About", href: "/about/" },
];

const ICON_ITEMS: NavItem[] = [
  {
    label: "Archives",
    href: "/archives/",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"></path>
      <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-10"></path>
      <path d="M10 12l4 0"></path>
    </svg>`,
  },
  {
    label: "Search",
    href: "/search/",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <circle cx="10" cy="10" r="7"></circle>
      <line x1="21" y1="21" x2="15" y2="15"></line>
    </svg>`,
  },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="relative z-50 flex items-center justify-end">
      <NavMenuWrapper open={open} styleConstants={STYLE_CONSTANTS}>
        <NavMenu
          open={open}
          navItems={NAV_ITEMS}
          iconItems={ICON_ITEMS}
          styleConstants={STYLE_CONSTANTS}
        />
        <HamburgerButton
          open={open}
          setOpen={setOpen}
          styleConstants={STYLE_CONSTANTS}
        />
      </NavMenuWrapper>
    </nav>
  );
}
