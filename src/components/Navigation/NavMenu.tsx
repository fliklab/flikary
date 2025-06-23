import DarkModeToggle from "./DarkModeToggle";
import IconList from "./IconList";
import NavList from "./NavList";

interface NavMenuProps {
  open: boolean;
  navItems: { label: string; href: string }[];
  iconItems: { label: string; href: string; icon: string }[];
  styleConstants: {
    timing: {
      duration: string;
      ease: string;
      menuDelay: string;
    };
  };
}

export default function NavMenu({
  open,
  navItems,
  iconItems,
  styleConstants,
}: NavMenuProps) {
  const { timing } = styleConstants;
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center transition-all ${timing.menuDelay} ${timing.duration} ${timing.ease} md:flex-row md:justify-end ${
        open
          ? "pointer-events-auto opacity-100 md:mr-16"
          : "pointer-events-none opacity-0 md:pointer-events-auto"
      }`}
    >
      <NavList
        open={open}
        navItems={navItems}
        styleConstants={styleConstants}
      />
      <IconList
        open={open}
        iconItems={iconItems}
        navItemsLength={navItems.length}
        styleConstants={styleConstants}
      />
      <DarkModeToggle
        open={open}
        navItemsLength={navItems.length}
        iconItemsLength={iconItems.length}
        styleConstants={styleConstants}
      />
    </div>
  );
}
