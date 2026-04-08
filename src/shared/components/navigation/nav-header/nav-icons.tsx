import { useState, useEffect } from "react";
import {
  Cross1Icon,
  HamburgerMenuIcon,
  HomeIcon,
  ReaderIcon,
  PersonIcon,
  ArchiveIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  GitHubLogoIcon,
  ChevronLeftIcon,
} from "@radix-ui/react-icons";

// Close icon
export const IconClose = () => (
  <Cross1Icon width={20} height={20} aria-hidden="true" />
);

// Hamburger menu icon
export const IconHamburger = () => (
  <HamburgerMenuIcon width={28} height={28} aria-hidden="true" />
);

// Navigation icons (compact mode)
export const IconHome = () => (
  <HomeIcon width={18} height={18} aria-hidden="true" />
);
export const IconBook = () => (
  <ReaderIcon width={18} height={18} aria-hidden="true" />
);
export const IconBadge = () => (
  <PersonIcon width={18} height={18} aria-hidden="true" />
);

// Action icons
export const IconArchive = () => (
  <ArchiveIcon width={20} height={20} aria-hidden="true" />
);
export const IconSearch = () => (
  <MagnifyingGlassIcon width={20} height={20} aria-hidden="true" />
);
export const IconTheme = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 초기 테마 확인
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute("data-theme");
      setIsDark(theme === "dark");
    };

    checkTheme();

    // MutationObserver로 data-theme 변경 감지
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-theme") {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return isDark ? (
    <MoonIcon width={20} height={20} aria-hidden="true" />
  ) : (
    <SunIcon width={20} height={20} aria-hidden="true" />
  );
};
export const IconGitHub = () => (
  <GitHubLogoIcon width={20} height={20} aria-hidden="true" />
);

// Back navigation icon
export const IconBack = () => (
  <ChevronLeftIcon width={20} height={20} aria-hidden="true" />
);

// Deprecated - keeping for reference
export const IconMenuDots = () => (
  <HamburgerMenuIcon width={18} height={18} aria-hidden="true" />
);
