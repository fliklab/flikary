// Radix UI Copy Icon SVG
const COPY_ICON_SVG = `<svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1 9.50006C1 10.3285 1.67157 11.0001 2.5 11.0001H4L4 10.0001H2.5C2.22386 10.0001 2 9.7762 2 9.50006L2 2.50006C2 2.22392 2.22386 2.00006 2.5 2.00006L9.5 2.00006C9.77614 2.00006 10 2.22392 10 2.50006V4.00002H5.5C4.67158 4.00002 4 4.67159 4 5.50002V12.5C4 13.3284 4.67158 14 5.5 14H12.5C13.3284 14 14 13.3284 14 12.5V5.50002C14 4.67159 13.3284 4.00002 12.5 4.00002H11V2.50006C11 1.67163 10.3284 1.00006 9.5 1.00006H2.5C1.67157 1.00006 1 1.67163 1 2.50006V9.50006ZM5 5.50002C5 5.22388 5.22386 5.00002 5.5 5.00002H12.5C12.7761 5.00002 13 5.22388 13 5.50002V12.5C13 12.7762 12.7761 13 12.5 13H5.5C5.22386 13 5 12.7762 5 12.5V5.50002Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"/>
</svg>`;

// Radix UI Check Icon SVG (for copied state)
const CHECK_ICON_SVG = `<svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.5553 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"/>
</svg>`;

const CODE_BLOCK_INITIALIZED_ATTR = "data-code-block-initialized";

const isClipboardSupported = () =>
  typeof navigator !== "undefined" && Boolean(navigator.clipboard);

const copyText = async (text: string) => {
  if (!isClipboardSupported()) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * 복사 버튼을 생성하고 클릭 이벤트를 바인딩한다.
 */
const createCopyButton = (getCodeText: () => string): HTMLButtonElement => {
  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className = "copy-code-btn";
  copyButton.setAttribute("aria-label", "Copy code");
  copyButton.innerHTML = COPY_ICON_SVG;

  copyButton.addEventListener("click", async e => {
    e.stopPropagation();

    const text = getCodeText();
    const didCopy = await copyText(text);

    if (!didCopy) {
      return;
    }

    // Show copied state
    copyButton.innerHTML = CHECK_ICON_SVG;
    copyButton.classList.add("copied");

    setTimeout(() => {
      copyButton.innerHTML = COPY_ICON_SVG;
      copyButton.classList.remove("copied");
    }, 1500);
  });

  return copyButton;
};

/**
 * 코드 블록을 wrapper 구조로 감싼다.
 * data-title이 있으면 header를 추가한다.
 */
export const wrapCodeBlocks = (root: ParentNode = document) => {
  if (typeof window === "undefined") {
    return;
  }

  const codeBlocks = Array.from(
    root.querySelectorAll<HTMLPreElement>(
      "pre:has(code):not(.code-block-wrapper pre)"
    )
  );

  for (const pre of codeBlocks) {
    if (pre.getAttribute(CODE_BLOCK_INITIALIZED_ATTR) === "true") {
      continue;
    }

    // 이미 wrapper 안에 있으면 스킵
    if (pre.parentElement?.classList.contains("code-block-wrapper")) {
      pre.setAttribute(CODE_BLOCK_INITIALIZED_ATTR, "true");
      continue;
    }

    const title = pre.getAttribute("data-title");
    const lang =
      pre.getAttribute("data-language") ||
      pre.querySelector("code")?.className.match(/language-(\w+)/)?.[1] ||
      "";

    // Wrapper 생성
    const wrapper = document.createElement("div");
    wrapper.className = "code-block-wrapper" + (title ? " has-title" : "");

    // Title이 있으면 header 추가
    if (title) {
      const header = document.createElement("div");
      header.className = "code-block-header";

      const titleSpan = document.createElement("span");
      titleSpan.className = "code-block-title";
      titleSpan.textContent = title;

      const meta = document.createElement("div");
      meta.className = "code-block-meta";

      if (lang) {
        const langSpan = document.createElement("span");
        langSpan.className = "code-block-lang";
        langSpan.textContent = lang;
        meta.appendChild(langSpan);
      }

      // 복사 버튼을 header에 추가
      const copyButton = createCopyButton(() => {
        return pre.querySelector("code")?.innerText ?? "";
      });
      meta.appendChild(copyButton);

      header.appendChild(titleSpan);
      header.appendChild(meta);
      wrapper.appendChild(header);

      // data-title 속성 제거 (CSS ::before 방지)
      pre.removeAttribute("data-title");
    } else {
      // Title이 없으면 pre 안에 복사 버튼 추가
      const copyButton = createCopyButton(() => {
        return pre.querySelector("code")?.innerText ?? "";
      });
      pre.appendChild(copyButton);
    }

    // pre를 wrapper로 감싸기
    pre.parentNode?.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    pre.setAttribute(CODE_BLOCK_INITIALIZED_ATTR, "true");
  }
};

/**
 * 코드 블록에 복사 버튼을 추가하여 사용자가 클릭 한 번으로 내용을 복사할 수 있게 한다.
 * wrapCodeBlocks와 함께 사용 - wrapper가 없는 코드블록에 대한 fallback
 */
export const attachCopyButtons = (root: ParentNode = document) => {
  if (typeof window === "undefined") {
    return;
  }

  // 먼저 코드블록을 wrapper로 감싸기
  wrapCodeBlocks(root);

  // wrapper로 감싸지지 않은 남은 코드블록에 복사 버튼 추가 (fallback)
  const codeBlocks = Array.from(
    root.querySelectorAll<HTMLPreElement>("pre:has(code)")
  );

  for (const codeBlock of codeBlocks) {
    if (codeBlock.getAttribute(CODE_BLOCK_INITIALIZED_ATTR) === "true") {
      continue;
    }

    // Check if already has a copy button
    const existingButton =
      codeBlock.querySelector<HTMLButtonElement>(".copy-code-btn");
    if (existingButton) {
      codeBlock.setAttribute(CODE_BLOCK_INITIALIZED_ATTR, "true");
      continue;
    }

    // Create copy button
    const copyButton = createCopyButton(() => {
      return codeBlock.querySelector("code")?.innerText ?? "";
    });

    codeBlock.appendChild(copyButton);
    codeBlock.setAttribute(CODE_BLOCK_INITIALIZED_ATTR, "true");
  }
};

/**
 * 코드 블록에 라인 하이라이팅을 적용한다.
 * data-line 속성을 파싱하여 해당 라인에 highlighted 클래스 추가
 */
export const applyLineHighlighting = (root: ParentNode = document) => {
  if (typeof window === "undefined") {
    return;
  }

  const codeBlocks = Array.from(
    root.querySelectorAll<HTMLPreElement>("pre[data-line]")
  );

  for (const codeBlock of codeBlocks) {
    const lineAttr = codeBlock.getAttribute("data-line");
    if (!lineAttr) continue;

    const codeElement = codeBlock.querySelector("code");
    if (!codeElement) continue;

    // Parse line numbers (e.g., "1,3-5,7" -> [1, 3, 4, 5, 7])
    const linesToHighlight = parseLineNumbers(lineAttr);

    // Get all lines
    const lines = codeElement.querySelectorAll(".line");

    lines.forEach((line, index) => {
      if (linesToHighlight.includes(index + 1)) {
        line.classList.add("highlighted");
      }
    });
  }
};

/**
 * 라인 번호 문자열을 파싱한다.
 * "1,3-5,7" -> [1, 3, 4, 5, 7]
 */
function parseLineNumbers(input: string): number[] {
  const result: number[] = [];
  const parts = input.split(",");

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes("-")) {
      const [start, end] = trimmed.split("-").map(Number);
      for (let i = start; i <= end; i++) {
        result.push(i);
      }
    } else {
      result.push(Number(trimmed));
    }
  }

  return result.filter(n => !isNaN(n));
}
