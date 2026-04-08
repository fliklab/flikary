import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { attachCopyButtons, applyLineHighlighting } from "./attachCopyButtons";

// Test Utilities
const mockWriteText = vi.fn().mockResolvedValue(undefined);

/** 테스트용 DOM 컨테이너를 생성하고 document.body에 추가한다 */
function createTestContainer(): HTMLDivElement {
  const container = document.createElement("div");
  document.body.appendChild(container);
  return container;
}

function cleanupTestContainer(container: HTMLDivElement): void {
  document.body.removeChild(container);
}

function mockClipboardAPI(): void {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: mockWriteText },
    writable: true,
    configurable: true,
  });
}

const CodeBlockFixtures = {
  /** 단일 코드 블록 HTML을 생성한다 */
  single: (code: string) => `<pre><code>${code}</code></pre>`,

  /** 이미 초기화된 코드 블록 HTML을 생성한다 */
  alreadyInitialized: (code: string) =>
    `<pre data-copy-button-bound="true"><code>${code}</code></pre>`,

  /** 여러 코드 블록 HTML을 생성한다 */
  multiple: (codes: string[]) =>
    codes.map(code => `<pre><code>${code}</code></pre>`).join("\n"),

  /** code 요소 없는 pre 태그를 생성한다 */
  withoutCodeElement: (text: string) => `<pre>${text}</pre>`,

  /** 라인 하이라이팅용 코드 블록을 생성한다 */
  withLineHighlight: (lineCount: number, dataLine?: string) => {
    const lines = Array.from(
      { length: lineCount },
      (_, i) => `<span class="line">line ${i + 1}</span>`
    ).join("\n");

    const dataLineAttr = dataLine ? ` data-line="${dataLine}"` : "";
    return `<pre${dataLineAttr}><code>${lines}</code></pre>`;
  },
};

const QueryHelpers = {
  /** 복사 버튼을 찾는다 */
  copyButton: (container: HTMLElement) =>
    container.querySelector<HTMLButtonElement>(".copy-code-btn"),

  /** 모든 복사 버튼을 찾는다 */
  allCopyButtons: (container: HTMLElement) =>
    container.querySelectorAll<HTMLButtonElement>(".copy-code-btn"),

  /** 모든 라인 요소를 찾는다 */
  allLines: (container: HTMLElement) =>
    container.querySelectorAll<HTMLElement>(".line"),
};

const AssertionHelpers = {
  /** 라인들의 하이라이트 상태를 검증한다 (1-indexed) */
  lineHighlights: (
    lines: NodeListOf<HTMLElement>,
    expectedHighlightedLines: number[]
  ) => {
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const shouldBeHighlighted = expectedHighlightedLines.includes(lineNumber);
      expect(
        line.classList.contains("highlighted"),
        `Line ${lineNumber} should ${shouldBeHighlighted ? "" : "not "}be highlighted`
      ).toBe(shouldBeHighlighted);
    });
  },
};

describe("attachCopyButtons", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = createTestContainer();
    mockClipboardAPI();
  });

  afterEach(() => {
    cleanupTestContainer(container);
    mockWriteText.mockClear();
  });

  describe("버튼 생성", () => {
    it("코드 블록에 복사 버튼을 추가한다", () => {
      container.innerHTML = CodeBlockFixtures.single('const hello = "world";');

      attachCopyButtons(container);

      const button = QueryHelpers.copyButton(container);
      expect(button).not.toBeNull();
      expect(button?.getAttribute("aria-label")).toBe("Copy code");
    });

    it("여러 코드 블록에 각각 복사 버튼을 추가한다", () => {
      container.innerHTML = CodeBlockFixtures.multiple([
        "const a = 1;",
        "const b = 2;",
        "const c = 3;",
      ]);

      attachCopyButtons(container);

      const buttons = QueryHelpers.allCopyButtons(container);
      expect(buttons.length).toBe(3);
    });

    it("code 요소가 없는 pre 태그에는 버튼을 추가하지 않는다", () => {
      container.innerHTML = CodeBlockFixtures.withoutCodeElement(
        "plain preformatted text"
      );

      attachCopyButtons(container);

      expect(QueryHelpers.copyButton(container)).toBeNull();
    });
  });

  describe("중복 방지", () => {
    it("이미 초기화된 코드 블록에는 버튼을 추가하지 않는다", () => {
      container.innerHTML = CodeBlockFixtures.alreadyInitialized(
        'const hello = "world";'
      );

      attachCopyButtons(container);

      expect(QueryHelpers.allCopyButtons(container).length).toBe(0);
    });
  });

  describe("복사 기능", () => {
    it("버튼 클릭 시 코드 내용을 클립보드에 복사한다", async () => {
      const code = 'const hello = "world";';
      container.innerHTML = CodeBlockFixtures.single(code);
      attachCopyButtons(container);

      QueryHelpers.copyButton(container)?.click();

      await vi.waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith(code);
      });
    });

    it("복사 성공 시 copied 클래스가 추가되고 아이콘이 변경된다", async () => {
      container.innerHTML = CodeBlockFixtures.single("test code");
      attachCopyButtons(container);

      const button = QueryHelpers.copyButton(container);
      const originalHTML = button?.innerHTML;

      button?.click();

      await vi.waitFor(() => {
        expect(button?.classList.contains("copied")).toBe(true);
        expect(button?.innerHTML).not.toBe(originalHTML);
      });
    });
  });
});

describe("applyLineHighlighting", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = createTestContainer();
  });

  afterEach(() => {
    cleanupTestContainer(container);
  });

  describe("단일 라인 지정", () => {
    it("쉼표로 구분된 라인 번호에 하이라이트를 적용한다", () => {
      container.innerHTML = CodeBlockFixtures.withLineHighlight(3, "1,3");

      applyLineHighlighting(container);

      AssertionHelpers.lineHighlights(QueryHelpers.allLines(container), [1, 3]);
    });
  });

  describe("범위 지정", () => {
    it("하이픈으로 지정된 범위의 모든 라인에 하이라이트를 적용한다", () => {
      container.innerHTML = CodeBlockFixtures.withLineHighlight(5, "2-4");

      applyLineHighlighting(container);

      AssertionHelpers.lineHighlights(
        QueryHelpers.allLines(container),
        [2, 3, 4]
      );
    });
  });

  describe("혼합 지정", () => {
    it("단일 라인과 범위를 혼합하여 지정할 수 있다", () => {
      container.innerHTML = CodeBlockFixtures.withLineHighlight(7, "1,3-5,7");

      applyLineHighlighting(container);

      AssertionHelpers.lineHighlights(
        QueryHelpers.allLines(container),
        [1, 3, 4, 5, 7]
      );
    });
  });

  describe("예외 케이스", () => {
    it("data-line 속성이 없는 코드 블록은 무시한다", () => {
      container.innerHTML = CodeBlockFixtures.withLineHighlight(2);

      applyLineHighlighting(container);

      AssertionHelpers.lineHighlights(QueryHelpers.allLines(container), []);
    });
  });
});
