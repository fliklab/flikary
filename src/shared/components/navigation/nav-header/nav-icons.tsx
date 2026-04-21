import {
  ArchiveSvg,
  ChevronLeftSvg,
  CloseSvg,
  FeedSvg,
  GitHubSvg,
  HamburgerSvg,
  HomeSvg,
  MoonSvg,
  PersonSvg,
  ReaderSvg,
  SearchSvg,
  SunSvg,
} from "./icons";

// Close icon
export const IconClose = () => (
  <CloseSvg width={20} height={20} />
);

// Hamburger menu icon
export const IconHamburger = () => (
  <HamburgerSvg width={28} height={28} />
);

// Navigation icons (compact mode)
export const IconHome = () => (
  <HomeSvg width={18} height={18} />
);
export const IconFeed = () => (
  <FeedSvg width={18} height={18} />
);
export const IconBook = () => (
  <ReaderSvg width={18} height={18} />
);
export const IconBadge = () => (
  <PersonSvg width={18} height={18} />
);

// Action icons
export const IconArchive = () => (
  <ArchiveSvg width={20} height={20} />
);
export const IconSearch = () => (
  <SearchSvg width={20} height={20} />
);
export const IconTheme = () => {
  return (
    <>
      <SunSvg className="theme-icon theme-icon--sun" width={20} height={20} />
      <MoonSvg className="theme-icon theme-icon--moon" width={20} height={20} />
    </>
  );
};
export const IconGitHub = () => (
  <GitHubSvg width={20} height={20} />
);

// Back navigation icon
export const IconBack = () => (
  <ChevronLeftSvg width={20} height={20} />
);

// Deprecated - keeping for reference
export const IconMenuDots = () => (
  <HamburgerSvg width={18} height={18} />
);
