const primaryColorScheme = ""; // "light" | "dark"

// Get theme data from local storage
const currentTheme = localStorage.getItem("theme");

function getPreferTheme() {
  // return theme value in local storage if it is set
  if (currentTheme) return currentTheme;

  // return primary color scheme if it is set
  if (primaryColorScheme) return primaryColorScheme;

  // return user device's prefer color scheme
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

let themeValue = getPreferTheme();

function setPreference() {
  localStorage.setItem("theme", themeValue);
  reflectPreference();
}

function reflectPreference() {
  document.firstElementChild.setAttribute("data-theme", themeValue);

  // aria-label은 고정값으로 유지하고, 현재 테마는 data-theme으로 표시
  const themeBtn = document.querySelector("#theme-btn");
  if (themeBtn) {
    themeBtn.setAttribute("data-current-theme", themeValue);
    // aria-label은 React hydration과 일치하도록 고정값 사용
    if (themeBtn.getAttribute("aria-label") !== "Toggle theme") {
      themeBtn.setAttribute("aria-label", "Toggle theme");
    }
  }

  // Get a reference to the body element
  const body = document.body;

  // Check if the body element exists before using getComputedStyle
  if (body) {
    // Get the computed styles for the body element
    const computedStyles = window.getComputedStyle(body);

    // Get the background color property
    const bgColor = computedStyles.backgroundColor;

    // Set the background color in <meta theme-color ... />
    document
      .querySelector("meta[name='theme-color']")
      ?.setAttribute("content", bgColor);
  }
}

// 테마 토글 핸들러 (중복 등록 방지를 위해 named function 사용)
function handleThemeToggle() {
  themeValue = themeValue === "light" ? "dark" : "light";
  setPreference();
}

// React 컴포넌트에서 직접 호출할 수 있도록 전역으로 노출
window.toggleTheme = handleThemeToggle;

function setThemeFeature() {
  // set on load so screen readers can get the latest value on the button
  reflectPreference();

  // 기존 리스너 제거 후 새로 등록 (View Transitions 후 요소가 교체될 수 있음)
  // React 컴포넌트에서 직접 처리하므로 여기서는 fallback으로만 등록
  const themeBtn = document.querySelector("#theme-btn");
  if (themeBtn && !themeBtn.onclick) {
    // React onClick이 없는 경우에만 vanilla JS 이벤트 리스너 등록
    themeBtn.removeEventListener("click", handleThemeToggle);
    themeBtn.addEventListener("click", handleThemeToggle);
  }
}

// set early so no page flashes / CSS is made aware
reflectPreference();

window.onload = () => {
  setThemeFeature();

  // Runs on view transitions navigation
  document.addEventListener("astro:after-swap", setThemeFeature);
};

// sync with system changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches: isDark }) => {
    themeValue = isDark ? "dark" : "light";
    setPreference();
  });
