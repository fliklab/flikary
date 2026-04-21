export type ActiveNav = "feed" | "blog" | "archives" | "tags" | "about" | "search" | "resume";

export interface Props {
  activeNav?: ActiveNav;
  hidden?: boolean;
  isInitialLoad?: boolean;
}
