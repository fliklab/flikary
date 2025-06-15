import React from "react";
import LinkButton from "./Header/LinkButton";
import RightArrowButton from "./SVGButtons/RightArrowButton";
import type { Page } from "astro";
import type { CollectionEntry } from "astro:content";
import LeftArrowIcon from "./icons/LeftArrowIcon";

interface PaginationProps {
  page: Page<CollectionEntry<"blog">>;
}

export default function Pagination({ page }: PaginationProps) {
  if (page.lastPage <= 1) return null;
  return (
    <nav
      className="pagination-wrapper mb-8 mt-auto flex justify-center"
      aria-label="Pagination"
    >
      <LinkButton
        disabled={!page.url.prev}
        href={page.url.prev as string}
        className={`mr-4 select-none${page.url.prev ? "" : "disabled pointer-events-none select-none opacity-50 hover:text-skin-base group-hover:fill-skin-base"}`}
        ariaLabel="Previous"
      >
        <LeftArrowIcon
          className={`${!page.url.prev ? "disabled-svg group-hover:!fill-skin-base" : ""}`}
        />
        Prev
      </LinkButton>
      {page.currentPage} / {page.lastPage}
      <LinkButton
        disabled={!page.url.next}
        href={page.url.next as string}
        className={`mx-4 select-none${page.url.next ? "" : "disabled pointer-events-none select-none opacity-50 hover:text-skin-base group-hover:fill-skin-base"}`}
        ariaLabel="Next"
      >
        Next
        <RightArrowButton
          className={`${!page.url.next ? "disabled-svg group-hover:!fill-skin-base" : ""}`}
        />
      </LinkButton>
    </nav>
  );
}
