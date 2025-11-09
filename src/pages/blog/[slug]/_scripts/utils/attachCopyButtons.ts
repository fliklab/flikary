const COPY_BUTTON_CLASS =
  "copy-code absolute right-3 -top-3 rounded bg-skin-card px-2 py-1 text-xs leading-4 text-skin-base font-medium";
const COPY_BUTTON_LABEL = "Copy";
const COPY_BUTTON_SUCCESS_LABEL = "Copied";
const CODE_BLOCK_INITIALIZED_ATTR = "data-copy-button-bound";

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
 * 코드 블록에 복사 버튼을 추가하여 사용자가 클릭 한 번으로 내용을 복사할 수 있게 한다.
 */
export const attachCopyButtons = (root: ParentNode = document) => {
  if (typeof window === "undefined") {
    return;
  }

  const codeBlocks = Array.from(root.querySelectorAll<HTMLPreElement>("pre"));

  for (const codeBlock of codeBlocks) {
    if (codeBlock.getAttribute(CODE_BLOCK_INITIALIZED_ATTR) === "true") {
      continue;
    }

    codeBlock.style.position = "relative";

    const existingButton = codeBlock.querySelector<HTMLButtonElement>(
      `button.${COPY_BUTTON_CLASS.split(" ")[0]}`
    );

    if (existingButton) {
      codeBlock.setAttribute(CODE_BLOCK_INITIALIZED_ATTR, "true");
      continue;
    }

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = COPY_BUTTON_CLASS;
    copyButton.innerText = COPY_BUTTON_LABEL;

    codeBlock.setAttribute("tabindex", "0");
    codeBlock.appendChild(copyButton);

    copyButton.addEventListener("click", async () => {
      const codeElement = codeBlock.querySelector("code");
      const text = codeElement?.innerText ?? "";
      const didCopy = await copyText(text);

      if (!didCopy) {
        return;
      }

      copyButton.innerText = COPY_BUTTON_SUCCESS_LABEL;
      setTimeout(() => {
        copyButton.innerText = COPY_BUTTON_LABEL;
      }, 700);
    });

    codeBlock.setAttribute(CODE_BLOCK_INITIALIZED_ATTR, "true");
  }
};
