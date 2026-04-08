function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["selector", "[data-theme='dark']"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    // Remove the following screen breakpoint or add other breakpoints
    // if one breakpoint is not enough for you
    screens: {
      sm: "640px",
      md: "768px",
      xl: "1280px",
    },

    extend: {
      // Color System
      colors: {
        // Semantic colors using CSS variables
        skin: {
          // Base colors
          fill: withOpacity("--color-fill"),
          base: withOpacity("--color-text-base"),
          accent: withOpacity("--color-accent"),
          card: withOpacity("--color-card"),
          "card-muted": withOpacity("--color-card-muted"),
          border: withOpacity("--color-border"),
        },
        // Navigation colors (from Header component)
        nav: {
          'bg-light': 'rgb(255, 255, 255)',
          'bg-dark': 'rgb(0, 24, 39)',
          'text-light': 'rgb(0, 0, 0)',
          'text-dark': 'rgb(255, 255, 255)',
        },
      },
      textColor: {
        skin: {
          base: withOpacity("--color-text-base"),
          accent: withOpacity("--color-accent"),
          inverted: withOpacity("--color-fill"),
        },
      },
      backgroundColor: {
        skin: {
          fill: withOpacity("--color-fill"),
          accent: withOpacity("--color-accent"),
          inverted: withOpacity("--color-text-base"),
          card: withOpacity("--color-card"),
          "card-muted": withOpacity("--color-card-muted"),
        },
      },
      outlineColor: {
        skin: {
          fill: withOpacity("--color-accent"),
        },
      },
      borderColor: {
        skin: {
          line: withOpacity("--color-border"),
          fill: withOpacity("--color-text-base"),
          accent: withOpacity("--color-accent"),
        },
      },
      fill: {
        skin: {
          base: withOpacity("--color-text-base"),
          accent: withOpacity("--color-accent"),
        },
        transparent: "transparent",
      },
      stroke: {
        skin: {
          accent: withOpacity("--color-accent")
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "NanumBarunPen", "cursive"],
        sans: [
          "var(--font-sans)",
          "Inter",
          "Pretendard Variable",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Apple SD Gothic Neo",
          "sans-serif",
        ],
        serif: ["Nanum Myeongjo", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      // Spacing System
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      // Typography System
      fontSize: {
        '2sm': '0.8125rem', // 13px
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      // Line Heights
      lineHeight: {
        'tighter': '1.1',
        'tight': '1.25',
        'snug': '1.375',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '1.75',
      },
      // Animation
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
      },
      // Container
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      // Typography Plugin Config
      typography: {
        DEFAULT: {
          css: {
            pre: {
              color: false,
            },
            code: {
              color: false,
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
