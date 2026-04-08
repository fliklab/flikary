import type { FunctionComponent } from "react";
import {
  IconHome,
  IconBook,
  IconMenuDots,
  IconArchive,
  IconSearch,
  IconTheme,
  IconGitHub,
} from "./nav-icons";

export type NavKey = "home" | "blog" | "about";

export type NavLink = {
  label: string;
  href: string;
  key: NavKey;
  Icon: FunctionComponent;
};

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/", key: "home", Icon: IconHome },
  { label: "Blog", href: "/blog/", key: "blog", Icon: IconBook },
  { label: "About", href: "/about/", key: "about", Icon: IconMenuDots },
];

export const ACTION_ICONS = {
  archive: IconArchive,
  search: IconSearch,
  theme: IconTheme,
  github: IconGitHub,
};

export const githubLink = "https://github.com/fliklab";
