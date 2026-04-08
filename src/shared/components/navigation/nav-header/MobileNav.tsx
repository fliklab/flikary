import { motion, AnimatePresence } from "framer-motion";
import type { Transition, Variants } from "framer-motion";
import { useState } from "react";
import type { Props } from "./types";
import { NAV_LINKS } from "./nav-data";
import { useThemeToggle } from "./useThemeToggle";
import {
  IconClose,
  IconHamburger,
  IconTheme,
  IconSearch,
  IconBack,
} from "./nav-icons";

// Cubic bezier easing for smooth animations
type CubicBezier = [number, number, number, number];
const EASE_SMOOTH: CubicBezier = [0.4, 0, 0.2, 1];

// Panel morphing with fixed border-radius
const panelVariants: Variants = {
  closed: {
    width: 56,
    height: 56,
    borderRadius: 28, // Absolute pixel value (half of height)
  },
  open: {
    width: 280,
    height: "auto",
    borderRadius: 28, // Keep same absolute border-radius
  },
};

// Tween transition - smooth without overshoot
const panelTransition: Transition = {
  type: "tween",
  duration: 0.35,
  ease: EASE_SMOOTH,
};

// Content fade variants
const contentVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.1,
      ease: "easeIn",
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      delay: 0.12,
      ease: "easeOut",
    },
  },
};

// Overlay variants
const overlayVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.25,
    },
  },
};

const MobileNav = ({ activeNav }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleTheme = useThemeToggle();

  const handleClose = () => setIsOpen(false);

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <>
      {/* Fixed back button (top left) */}
      <div className="mobile-back-fixed">
        <button
          type="button"
          className="mobile-back-btn"
          aria-label="Go back"
          onClick={handleBack}
        >
          <IconBack />
        </button>
      </div>

      <div className="mobile-nav">
        {/* Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="mobile-overlay"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={handleClose}
            />
          )}
        </AnimatePresence>

        {/* Morphing panel */}
        <motion.div
          className="mobile-panel"
          variants={panelVariants}
          animate={isOpen ? "open" : "closed"}
          initial="closed"
          transition={panelTransition}
        >
          {/* Hamburger button (visible when closed) */}
          <AnimatePresence mode="wait">
            {!isOpen && (
              <motion.button
                key="hamburger"
                type="button"
                className="mobile-hamburger-btn"
                aria-label="Open navigation"
                onClick={() => setIsOpen(true)}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <IconHamburger />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Navigation content (visible when open) */}
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                key="nav-content"
                className="mobile-content"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="mobile-header">
                  <button
                    type="button"
                    className="mobile-back"
                    aria-label="Go back"
                    onClick={() => {
                      handleClose();
                      handleBack();
                    }}
                  >
                    <IconBack />
                  </button>
                  <button
                    type="button"
                    className="mobile-close"
                    aria-label="Close menu"
                    onClick={handleClose}
                  >
                    <IconClose />
                  </button>
                </div>
                <nav className="mobile-list">
                  {NAV_LINKS.map(link => (
                    <a
                      key={`mobile-${link.key}`}
                      href={link.href}
                      className="mobile-link"
                      data-active={
                        (link.key === "home" && !activeNav) ||
                        activeNav === link.key
                      }
                      onClick={handleClose}
                    >
                      {link.label}
                    </a>
                  ))}
                  <a
                    href="/archives/"
                    className="mobile-link"
                    onClick={handleClose}
                  >
                    Archives
                  </a>
                </nav>
                <div className="mobile-actions">
                  <button
                    type="button"
                    aria-label="Toggle theme"
                    onClick={() => {
                      toggleTheme();
                      handleClose();
                    }}
                  >
                    <IconTheme />
                  </button>
                  <a href="/search/" aria-label="Search" onClick={handleClose}>
                    <IconSearch />
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

export default MobileNav;
