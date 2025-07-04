import React from "react";
import LinkButton from "./LinkButton";
import ThemeButton from "./ThemeButton";
import { SITE } from "@config";

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`icon icon-tabler icons-tabler-outline !hidden sm:!inline-block${activeNav === "archives" ? "!stroke-skin-accent" : ""}`}
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
              <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-10" />
              <path d="M10 12l4 0" />
            </svg>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="scale-125 sm:scale-100"
          >
            <path d="M19.023 16.977a35.13 35.13 0 0 1-1.367-1.384c-.372-.378-.596-.653-.596-.653l-2.8-1.337A6.962 6.962 0 0 0 16 9c0-3.859-3.14-7-7-7S2 5.141 2 9s3.14 7 7 7c1.763 0 3.37-.66 4.603-1.739l1.337 2.8s.275.224.653.596c.387.363.896.854 1.384 1.367l1.358 1.392.604.646 2.121-2.121-.646-.604c-.379-.372-.885-.866-1.391-1.36zM9 14c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z" />
          </svg>
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
