import { useState } from "react";
import HamburgerButton from "./HamburgerButton";
import Hr from "./Hr";
import Logo from "./Logo";
import NavMenu from "./NavMenu";

export interface HeaderProps {
  activeNav?: "blog" | "archives" | "tags" | "resume" | "about" | "search";
}

export default function Header({ activeNav }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header>
      <a
        id="skip-to-content"
        href="#main-content"
        className="absolute -top-full left-16 z-50 bg-skin-accent px-3 py-2 text-skin-inverted transition-all focus:top-4"
      >
        Skip to content
      </a>
      <div className="nav-container mx-auto flex max-w-3xl flex-col items-center justify-between sm:flex-row">
        <div className="top-nav-wrap relative flex w-full items-start justify-between p-4 sm:items-center sm:py-8">
          <Logo />
          <nav
            id="nav-menu"
            className="flex w-full flex-col items-center sm:ml-2 sm:flex-row sm:justify-end sm:space-x-4 sm:py-0"
          >
            <HamburgerButton
              expanded={menuOpen}
              onClick={() => setMenuOpen(v => !v)}
            />
            <NavMenu activeNav={activeNav} menuOpen={menuOpen} />
          </nav>
        </div>
      </div>
      <Hr />
    </header>
  );
}
