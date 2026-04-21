import type { FunctionComponent } from "react";
import {
  IconHome,
  IconBook,
  IconBadge,
  IconArchive,
  IconSearch,
  IconTheme,
  IconGitHub,
  IconHome as IconHomeAction,
} from "./nav-icons";

export type NavKey = "feed" | "blog" | "about";

export type NavLink = {
  label: string;
  href: string;
  key: NavKey;
  Icon: FunctionComponent;
};

export const isNavLinkActive = (
  activeNav: "feed" | "blog" | "archives" | "tags" | "about" | "search" | "resume" | undefined,
  key: NavKey
) => activeNav === key;

export const NAV_LINKS: NavLink[] = [
  { label: "Feed", href: "/feed/", key: "feed", Icon: IconHome },
  { label: "Blog", href: "/blog/", key: "blog", Icon: IconBook },
  { label: "About", href: "/about/", key: "about", Icon: IconBadge },
];

export const ACTION_ICONS = {
  home: IconHomeAction,
  archive: IconArchive,
  search: IconSearch,
  theme: IconTheme,
  github: IconGitHub,
};

export const githubLink = "https://github.com/fliklab";
