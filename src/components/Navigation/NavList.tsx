interface NavListProps {
  open: boolean;
  navItems: { label: string; href: string }[];
  styleConstants: {
    timing: {
      duration: string;
      ease: string;
      menuDelay: string;
    };
    menuItems: {
      final: string;
      initial: string;
      delayIncrement: number;
      delayBase: number;
    };
  };
}

export default function NavList({
  open,
  navItems,
  styleConstants,
}: NavListProps) {
  const { timing, menuItems } = styleConstants;
  return (
    <ul className="mt-200 mb-2 ml-4 flex flex-col items-center gap-2 md:mb-0 md:flex-row md:gap-2">
      {navItems.map((item, idx) => (
        <li
          key={item.label}
          className={`transition-all ${timing.duration} ${timing.ease} ${open ? menuItems.final : menuItems.initial}`}
          style={{
            transitionDelay: open
              ? `${idx * menuItems.delayIncrement + menuItems.delayBase}ms`
              : "0ms",
          }}
        >
          <a
            href={item.href}
            className="rounded-lg px-3 py-2 font-medium text-skin-base transition-colors duration-200 hover:text-skin-accent"
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
