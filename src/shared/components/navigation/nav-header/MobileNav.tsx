import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { Props } from "./types";
import { NAV_LINKS } from "./nav-data";
import { IconClose, IconHamburger, IconTheme, IconSearch } from "./nav-icons";

// Panel morphing with fixed border-radius
const panelVariants = {
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
const panelTransition = {
  type: "tween",
  duration: 0.35,
  ease: [0.4, 0, 0.2, 1],
};

// Content fade variants
const contentVariants = {
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
const overlayVariants = {
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

  const triggerThemeToggle = () => {
    document.querySelector<HTMLButtonElement>("#theme-btn")?.click();
  };

  const handleClose = () => setIsOpen(false);

  return (
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
              <button
                type="button"
                className="mobile-close"
                aria-label="Close menu"
                onClick={handleClose}
              >
                <IconClose />
              </button>
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
                    triggerThemeToggle();
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
  );
};

export default MobileNav;
