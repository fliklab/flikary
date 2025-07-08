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
        sans: ["IBM Plex Sans KR", "sans-serif"],
        serif: ["Gowun Dodum", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        '2sm': '0.8125rem', // 13px
      },
      
      // Header Navigation Colors
      colors: {
        nav: {
          // Light mode colors
          'bg-light': 'rgb(255, 255, 255)',
          'border-light': 'rgb(226, 232, 240)',
          'text-light': 'rgb(30, 41, 59)',
          'accent-light': 'rgb(59, 130, 246)',
          'shadow-light': 'rgb(71, 85, 105)',
          'selection-bg-light': 'rgb(219, 234, 254)',
          'hover-bg-light': 'rgb(241, 245, 249)',
          
          // Dark mode colors  
          'bg-dark': 'rgb(0, 24, 39)',
          'border-dark': 'rgb(51, 65, 85)',
          'text-dark': 'rgb(248, 250, 252)',
          'accent-dark': 'rgb(0, 211, 252)',
          'shadow-dark': 'rgb(0, 0, 0)',
          'selection-bg-dark': 'rgb(30, 64, 175)',
          'hover-bg-dark': 'rgb(51, 65, 85)',
        }
      },

      // Header Navigation Spacing
      spacing: {
        'nav-mini-height': '48px',
        'nav-expanded-height': '56px',
        'nav-mini-height-mobile': '24px', 
        'nav-expanded-height-mobile': '52px',
        'nav-icon': '32px',
        'nav-icon-mobile': '28px',
        'nav-icon-svg': '16px',
        'nav-icon-svg-mobile': '14px',
        'nav-top': '4px',
        'body-padding': '70px',
        'body-padding-mobile': '65px',
      },

      // Header Navigation Border Radius
      borderRadius: {
        'nav': '50px',
        'nav-item': '20px',
        'nav-item-tablet': '22px',
        'nav-item-mobile': '21px',
      },

      // Header Navigation Backdrop Blur
      backdropBlur: {
        'nav': '20px',
        'nav-strong': '28px',
        'mobile-menu': '8px',
      },

      // Header Navigation Box Shadows
      boxShadow: {
        'nav': `
          0 8px 32px rgba(71, 85, 105, 0.08),
          0 4px 16px rgba(71, 85, 105, 0.048),
          0 2px 8px rgba(71, 85, 105, 0.032),
          inset 0 1px 0 rgba(226, 232, 240, 0.6),
          inset 0 -1px 0 rgba(226, 232, 240, 0.18)
        `,
        'nav-dark': `
          0 8px 32px rgba(0, 0, 0, 0.16),
          0 4px 16px rgba(0, 0, 0, 0.096),
          0 2px 8px rgba(0, 0, 0, 0.064),
          inset 0 1px 0 rgba(51, 65, 85, 0.24),
          inset 0 -1px 0 rgba(51, 65, 85, 0.12)
        `,
        'mobile-hamburger': '0 2px 10px rgba(0, 0, 0, 0.2)',
      },

      // Header Navigation Animations
      animation: {
        'highlight-fade': 'highlightFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'highlight-fade-dark': 'highlightFadeInDark 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      },

      keyframes: {
        highlightFadeIn: {
          '0%': {
            background: 'transparent',
            transform: 'scale(0.95)',
            opacity: '0',
          },
          '100%': {
            background: 'rgba(219, 234, 254, 0.9)',
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        highlightFadeInDark: {
          '0%': {
            background: 'transparent', 
            transform: 'scale(0.95)',
            opacity: '0',
          },
          '100%': {
            background: 'rgba(30, 64, 175, 0.3)',
            transform: 'scale(1)',
            opacity: '1',
          },
        },
      },

      // Header Navigation Transitions
      transitionDuration: {
        'nav': '300ms',
      },

      transitionTimingFunction: {
        'nav': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

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
