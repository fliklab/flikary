const DEFAULT_SELECTOR = "h2, h3, h4, h5, h6";
const DEFAULT_LINK_CLASS =
  "heading-link ml-2 opacity-0 group-hover:opacity-100 focus:opacity-100";
const DEFAULT_SYMBOL = "#";
const HEADING_INITIALIZED_ATTR = "data-heading-anchor-bound";

export interface HeadingAnchorOptions {
  selector?: string;
  linkClassName?: string;
  symbol?: string;
}

/**
 * 헤딩 엘리먼트에 앵커 링크를 추가해 섹션 단위 공유를 가능하게 한다.
 */
export const attachHeadingAnchors = (
  root: ParentNode = document,
  options: HeadingAnchorOptions = {}
) => {
  if (typeof window === "undefined") {
    return;
  }

  const selector = options.selector ?? DEFAULT_SELECTOR;
  const linkClassName = options.linkClassName ?? DEFAULT_LINK_CLASS;
  const symbol = options.symbol ?? DEFAULT_SYMBOL;

  const headings = Array.from(root.querySelectorAll<HTMLElement>(selector));

  for (const heading of headings) {
    if (!heading.id) {
      continue;
    }

    if (heading.getAttribute(HEADING_INITIALIZED_ATTR) === "true") {
      continue;
    }

    if (!heading.classList.contains("group")) {
      heading.classList.add("group");
    }

    const existingLink = heading.querySelector<HTMLAnchorElement>(
      `a.${linkClassName.split(" ")[0]}`
    );

    if (existingLink) {
      heading.setAttribute(HEADING_INITIALIZED_ATTR, "true");
      continue;
    }

    const link = document.createElement("a");
    link.className = linkClassName;
    link.href = `#${heading.id}`;

    const span = document.createElement("span");
    span.ariaHidden = "true";
    span.innerText = symbol;
    link.appendChild(span);

    heading.appendChild(link);
    heading.setAttribute(HEADING_INITIALIZED_ATTR, "true");
  }
};
