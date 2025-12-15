export type ActiveNav = "blog" | "archives" | "tags" | "about" | "search" | "resume";

export interface Props {
  activeNav?: ActiveNav;
  isInitialLoad?: boolean;
  hidden?: boolean;
}
