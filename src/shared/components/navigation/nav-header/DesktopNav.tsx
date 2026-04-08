import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { motion, AnimatePresence } from "framer-motion";
import type { Transition, Variants } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import type { Props } from "./types";
import { ACTION_ICONS, NAV_LINKS, githubLink } from "./nav-data";
import { useDesktopNavState } from "./useDesktopNavState";
import { useThemeToggle } from "./useThemeToggle";
import { IconBack } from "./nav-icons";

// Cubic bezier easing for smooth animations
type CubicBezier = [number, number, number, number];
const EASE_SMOOTH: CubicBezier = [0.4, 0, 0.2, 1];

// Surface morphing with tween (no overshoot)
const surfaceVariants: Variants = {
  expanded: {
    width: 560,
    padding: "0.65rem 1.5rem",
    height: 68,
  },
  compact: {
    width: 280,
    padding: "0.2rem 0.6rem",
    height: 44,
  },
};

// Tween transition - smooth without overshoot
const surfaceTransition: Transition = {
  type: "tween",
  duration: 0.4,
  ease: EASE_SMOOTH,
};

// Content variants - shrink while fading out (for transitions)
const expandedContentVariants: Variants = {
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      delay: 0.1,
      ease: "easeOut",
    },
  },
  hidden: {
    opacity: 0,
    scale: 0.85,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

// Initial load variants - fade only, no scale/position
const initialFadeVariants: Variants = {
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  hidden: {
    opacity: 0,
  },
};

// Compact content variants - grow while fading in
const compactContentVariants: Variants = {
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      delay: 0.1,
      ease: "easeOut",
    },
  },
  hidden: {
    opacity: 0,
    scale: 1.15,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

const DesktopNav = ({ activeNav }: Props) => {
  const navState = useDesktopNavState();
  const isCompact = navState === "compact";
  const toggleTheme = useThemeToggle();

  // 초기 마운트 여부 추적 (첫 로드에서는 fade만 적용)
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    // 첫 렌더 후 마운트 완료 표시
    const timer = setTimeout(() => setHasMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  const renderedLinks = useMemo(() => {
    return NAV_LINKS.map(link => {
      const isActive =
        (link.key === "home" && !activeNav) ||
        (link.key === "blog" && activeNav === "blog") ||
        (link.key === "about" && activeNav === "about");
      return (
        <NavigationMenu.Item key={link.key}>
          <NavigationMenu.Link asChild>
            <a
              href={link.href}
              data-active={isActive}
              className="nav-link"
              aria-current={isActive ? "page" : undefined}
            >
              {link.label}
              <span aria-hidden="true" className="nav-link-underline" />
            </a>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      );
    });
  }, [activeNav]);

  return (
    <>
      <div className="nav-safe-space" aria-hidden="true" />
      <div className="nav-fixed">
        <motion.div
          className="nav-surface"
          variants={surfaceVariants}
          animate={isCompact ? "compact" : "expanded"}
          initial="expanded"
          transition={surfaceTransition}
        >
          {/* Expanded content - fade only on initial, shrink on transitions */}
          <AnimatePresence>
            {!isCompact && (
              <motion.div
                key="expanded-content"
                className="nav-expanded-content"
                variants={
                  hasMounted ? expandedContentVariants : initialFadeVariants
                }
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <button
                  type="button"
                  className="action-button"
                  aria-label="Go back"
                  onClick={handleBack}
                >
                  <IconBack />
                </button>
                <NavigationMenu.Root
                  className="nav-text-links"
                  delayDuration={50}
                >
                  <NavigationMenu.List className="capsule-nav-list">
                    {renderedLinks}
                  </NavigationMenu.List>
                </NavigationMenu.Root>
                <div className="nav-actions">
                  <a
                    className="action-button"
                    href="/archives/"
                    aria-label="Archives"
                    data-active={activeNav === "archives"}
                  >
                    <ACTION_ICONS.archive />
                  </a>
                  <a
                    className="action-button"
                    href="/search/"
                    aria-label="Search"
                    data-active={activeNav === "search"}
                  >
                    <ACTION_ICONS.search />
                  </a>
                  <button
                    type="button"
                    className="action-button"
                    id="theme-btn"
                    aria-label="Toggle theme"
                    onClick={toggleTheme}
                    suppressHydrationWarning
                  >
                    <ACTION_ICONS.theme />
                  </button>
                  <a
                    className="action-button"
                    href={githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  >
                    <ACTION_ICONS.github />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Compact content - grows while fading in */}
          <AnimatePresence>
            {isCompact && (
              <motion.div
                key="compact-content"
                className="nav-compact-content"
                variants={compactContentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <button
                  type="button"
                  className="compact-link"
                  aria-label="Go back"
                  onClick={handleBack}
                >
                  <IconBack />
                </button>
                <div className="nav-icon-group">
                  {NAV_LINKS.map(link => {
                    const isActive =
                      (link.key === "home" && !activeNav) ||
                      activeNav === link.key;
                    return (
                      <a
                        key={`compact-${link.key}`}
                        href={link.href}
                        className="compact-link"
                        aria-label={link.label}
                        data-active={isActive}
                      >
                        <link.Icon />
                      </a>
                    );
                  })}
                </div>
                <div className="nav-icon-group">
                  <button
                    type="button"
                    className="compact-link"
                    aria-label="Toggle theme"
                    onClick={toggleTheme}
                    suppressHydrationWarning
                  >
                    <ACTION_ICONS.theme />
                  </button>
                  <a
                    className="compact-link"
                    href="/search/"
                    aria-label="Search"
                  >
                    <ACTION_ICONS.search />
                  </a>
                  <a
                    className="compact-link"
                    href={githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  >
                    <ACTION_ICONS.github />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
};

export default DesktopNav;
