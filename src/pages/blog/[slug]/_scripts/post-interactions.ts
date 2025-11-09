import { attachHeadingAnchors } from "./utils/attachHeadingAnchors";
import { attachCopyButtons } from "./utils/attachCopyButtons";

const PROGRESS_CONTAINER_ID = "post-progress-container";
const PROGRESS_BAR_ID = "post-progress-bar";
const INIT_ATTR = "data-post-interactions-initialized";

type ProgressElements = {
  container: HTMLDivElement;
  bar: HTMLDivElement;
};

const ensureProgressElements = (): ProgressElements | null => {
  const body = document.body;

  if (!body) {
    return null;
  }

  let container = document.getElementById(
    PROGRESS_CONTAINER_ID
  ) as HTMLDivElement | null;
  let bar = document.getElementById(PROGRESS_BAR_ID) as HTMLDivElement | null;

  if (container && bar) {
    return { container, bar };
  }

  container = document.createElement("div");
  container.id = PROGRESS_CONTAINER_ID;
  container.className = "fixed top-0 z-10 h-1 w-full bg-skin-fill green";

  bar = document.createElement("div");
  bar.id = PROGRESS_BAR_ID;
  bar.className = "h-1 w-0 bg-skin-accent";

  container.appendChild(bar);
  body.appendChild(container);

  return { container, bar };
};

const createScrollProgressController = () => {
  const elements = ensureProgressElements();

  if (!elements) {
    return { update: () => undefined };
  }

  const { bar } = elements;
  let ticking = false;

  const update = () => {
    const docElement = document.documentElement;
    const scrollTop = document.body.scrollTop || docElement.scrollTop;
    const scrollableHeight = docElement.scrollHeight - docElement.clientHeight;
    const progress = scrollableHeight
      ? Math.min((scrollTop / scrollableHeight) * 100, 100)
      : 0;

    bar.style.width = `${progress}%`;
  };

  const onScroll = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  update();

  return { update };
};

const initBackToTop = () => {
  const button = document.querySelector<HTMLButtonElement>("#back-to-top");

  if (!button) {
    return;
  }

  if (button.dataset.postInteractionsBound === "true") {
    return;
  }

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  button.dataset.postInteractionsBound = "true";
};

const scrollToTopInstantly = () => {
  window.scrollTo({ left: 0, top: 0, behavior: "auto" });
};

const applyEnhancements = (updateProgress: () => void) => {
  attachHeadingAnchors();
  attachCopyButtons();
  initBackToTop();
  updateProgress();
};

/**
 * 블로그 포스트 상세 페이지에서 스크롤 진행바, 헤딩 앵커, 코드 복사 버튼,
 * Back to Top 등 상호작용 기능을 초기화한다.
 */
const init = () => {
  if (typeof window === "undefined") {
    return;
  }

  const body = document.body;

  if (!body || body.getAttribute(INIT_ATTR) === "true") {
    return;
  }

  body.setAttribute(INIT_ATTR, "true");

  const progressController = createScrollProgressController();

  applyEnhancements(progressController.update);

  document.addEventListener("astro:after-swap", () => {
    applyEnhancements(progressController.update);
    scrollToTopInstantly();
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
