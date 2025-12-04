import {
  Cross1Icon,
  HamburgerMenuIcon,
  HomeIcon,
  ReaderIcon,
  PersonIcon,
  ArchiveIcon,
  MagnifyingGlassIcon,
  SunIcon,
  GitHubLogoIcon,
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
export const IconTheme = () => (
  <SunIcon width={20} height={20} aria-hidden="true" />
);
export const IconGitHub = () => (
  <GitHubLogoIcon width={20} height={20} aria-hidden="true" />
);

// Deprecated - keeping for reference
export const IconMenuDots = () => (
  <HamburgerMenuIcon width={18} height={18} aria-hidden="true" />
);
