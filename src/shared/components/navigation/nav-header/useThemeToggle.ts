import { useCallback } from "react";

/**
 * 테마 토글을 위한 커스텀 훅
 * toggle-theme.js의 로직을 React에서 직접 구현
 */
export const useThemeToggle = () => {
  const toggleTheme = useCallback(() => {
    // DOM에서 현재 테마 직접 읽기
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "light" ? "dark" : "light";

    // localStorage에 저장
    localStorage.setItem("theme", newTheme);

    // DOM 업데이트
    if (typeof document !== "undefined") {
      // data-theme 속성 업데이트
      document.firstElementChild?.setAttribute("data-theme", newTheme);

      // meta theme-color 업데이트
      const body = document.body;
      if (body) {
        const computedStyles = window.getComputedStyle(body);
        const bgColor = computedStyles.backgroundColor;
        const themeColorMeta = document.querySelector(
          "meta[name='theme-color']"
        );
        if (themeColorMeta) {
          themeColorMeta.setAttribute("content", bgColor);
        }
      }
    }
  }, []);

  return toggleTheme;
};
