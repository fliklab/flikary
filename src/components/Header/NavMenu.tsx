import React from "react";
import LinkButton from "./LinkButton";
import ThemeButton from "../SVGButtons/ThemeButton";
import { SITE } from "@config";
import ArchiveIcon from "../icons/ArchiveIcon";
import SearchIcon from "../icons/SearchIcon";

interface NavMenuProps {
  activeNav?: "blog" | "archives" | "tags" | "resume" | "about" | "search";
  menuOpen: boolean;
}

export default function NavMenu({ activeNav, menuOpen }: NavMenuProps) {
  return (
    <ul
      id="menu-items"
      className={`$${menuOpen ? "" : "display-none sm:flex"} mt-4 grid w-44 grid-cols-2 grid-rows-4 gap-x-2 gap-y-2 sm:ml-0 sm:mt-0 sm:w-auto sm:gap-x-5 sm:gap-y-0`}
    >
      <li className="col-span-2 flex items-center justify-center">
        <a
          href="/blog/"
          className={`w-full px-4 py-3 text-center font-medium hover:text-skin-accent sm:my-0 sm:px-2 sm:py-1 ${activeNav === "blog" ? "active underline decoration-wavy decoration-2 underline-offset-4" : ""}`}
        >
          Blog
        </a>
      </li>
      <li className="col-span-2 flex items-center justify-center">
        <a
          href="/resume/"
          className={`w-full px-4 py-3 text-center font-medium hover:text-skin-accent sm:my-0 sm:px-2 sm:py-1 ${activeNav === "resume" ? "active underline decoration-wavy decoration-2 underline-offset-4" : ""}`}
        >
          Resume
        </a>
      </li>
      <li className="col-span-2 flex items-center justify-center">
        <a
          href="/about/"
          className={`w-full px-4 py-3 text-center font-medium hover:text-skin-accent sm:my-0 sm:px-2 sm:py-1 ${activeNav === "about" ? "active underline decoration-wavy decoration-2 underline-offset-4" : ""}`}
        >
          About
        </a>
      </li>
      {SITE.showArchives && (
        <li className="col-span-1 flex items-center justify-center">
          <LinkButton
            href="/archives/"
            className="focus-outline flex justify-center p-3 sm:p-1"
            ariaLabel="archives"
            title="Archives"
          >
            <ArchiveIcon
              className={`icon icon-tabler icons-tabler-outline !hidden sm:!inline-block${activeNav === "archives" ? "!stroke-skin-accent" : ""}`}
            />
            <span
              className={`sm:sr-only${activeNav === "archives" ? "active" : ""}`}
            >
              Archives
            </span>
          </LinkButton>
        </li>
      )}
      <li className="col-span-1 flex items-center justify-center">
        <LinkButton
          href="/search/"
          className={`focus-outline p-3 sm:p-1${activeNav === "search" ? "active" : ""} flex`}
          ariaLabel="search"
          title="Search"
        >
          <SearchIcon className="scale-125 sm:scale-100" />
          <span className="sr-only">Search</span>
        </LinkButton>
      </li>
      {SITE.lightAndDarkMode && (
        <li className="col-span-1 flex items-center justify-center">
          <ThemeButton />
        </li>
      )}
    </ul>
  );
}
