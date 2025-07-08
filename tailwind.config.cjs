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
        '3xl-plus': '2rem', // 32px - 블로그 제목용
        '4xl-plus': '2.5rem', // 40px - 메인 제목용
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
        },

        // 새로운 컨텐츠 색상 시스템
        content: {
          // 기본 배경 및 텍스트
          'bg-primary': withOpacity("--color-fill"),
          'bg-secondary': withOpacity("--color-card"),
          'bg-tertiary': withOpacity("--color-card-muted"),
          'text-primary': withOpacity("--color-text-base"),
          'text-secondary': withOpacity("--color-text-base"),
          'accent': withOpacity("--color-accent"),
          'border': withOpacity("--color-border"),
        },

        // 상태별 색상
        state: {
          'success': 'rgb(34, 197, 94)',
          'warning': 'rgb(251, 191, 36)', 
          'error': 'rgb(239, 68, 68)',
          'info': 'rgb(59, 130, 246)',
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

        // 새로운 컨텐츠 스페이싱
        'content-padding': '1rem',
        'content-padding-lg': '2rem',
        'content-gap': '1.5rem',
        'content-gap-lg': '2.5rem',
      },

      // Header Navigation Border Radius
      borderRadius: {
        'nav': '50px',
        'nav-item': '20px',
        'nav-item-tablet': '22px',
        'nav-item-mobile': '21px',
        
        // 새로운 컨텐츠 라운딩
        'content': '12px',
        'content-lg': '16px',
        'card': '8px',
        'button': '6px',
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
        
        // 새로운 컨텐츠 그림자
        'card': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'content': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'content-lg': '0 4px 16px rgba(0, 0, 0, 0.12)',
      },

      // Header Navigation Animations
      animation: {
        'highlight-fade': 'highlightFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'highlight-fade-dark': 'highlightFadeInDark 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        
        // 새로운 컨텐츠 애니메이션
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
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

        // 새로운 컨텐츠 키프레임
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(16px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        scaleIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
      },

      // Header Navigation Transitions
      transitionDuration: {
        'nav': '300ms',
        'content': '200ms',
        'fast': '150ms',
      },

      transitionTimingFunction: {
        'nav': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'content': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
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
            // 최대 너비 조정
            maxWidth: '768px',
            // 라인 높이 개선
            lineHeight: '1.75',
            // 문단 간격 개선
            'p': {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            // 제목 간격 개선
            'h1, h2, h3, h4': {
              marginTop: '2em',
              marginBottom: '1em',
            },
            // 링크 스타일 개선
            'a': {
              fontWeight: '500',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            },
          },
        },
        lg: {
          css: {
            fontSize: '1.125rem',
            lineHeight: '1.75',
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
