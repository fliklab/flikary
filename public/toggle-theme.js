const primaryColorScheme = ""; // "light" | "dark"

function getPreferTheme() {
  // return theme value in local storage if it is set
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) return storedTheme;

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

  // aria-label is fixed, current theme is shown via data-theme
  const themeBtn = document.querySelector("#theme-btn");
  if (themeBtn) {
    themeBtn.setAttribute("data-current-theme", themeValue);
    if (themeBtn.getAttribute("aria-label") !== "Toggle theme") {
      themeBtn.setAttribute("aria-label", "Toggle theme");
    }
  }

  // Update meta theme-color
  const body = document.body;
  if (body) {
    const computedStyles = window.getComputedStyle(body);
    const bgColor = computedStyles.backgroundColor;
    document
      .querySelector("meta[name='theme-color']")
      ?.setAttribute("content", bgColor);
  }
}

function handleThemeToggle() {
  themeValue = themeValue === "light" ? "dark" : "light";
  setPreference();
}

// Expose globally for React components
window.toggleTheme = handleThemeToggle;

function setThemeFeature() {
  // Re-read theme from localStorage on each page load/swap
  themeValue = getPreferTheme();
  reflectPreference();

  const themeBtn = document.querySelector("#theme-btn");
  if (themeBtn && !themeBtn.onclick) {
    themeBtn.removeEventListener("click", handleThemeToggle);
    themeBtn.addEventListener("click", handleThemeToggle);
  }
}

// Set early so no page flashes
reflectPreference();

window.onload = () => {
  setThemeFeature();
  document.addEventListener("astro:after-swap", setThemeFeature);
};

// Sync with system changes (only if user hasn't manually set theme)
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches: isDark }) => {
    // Only auto-switch if no user preference is stored
    if (!localStorage.getItem("theme")) {
      themeValue = isDark ? "dark" : "light";
      setPreference();
    }
  });
