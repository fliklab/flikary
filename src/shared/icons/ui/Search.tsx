import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

interface SearchIconProps {
  className?: string;
  size?: number;
  "aria-hidden"?: boolean;
}

export default function SearchIcon({
  className,
  size = 24,
  "aria-hidden": ariaHidden,
}: SearchIconProps) {
  return (
    <MagnifyingGlassIcon
      width={size}
      height={size}
      className={className}
      aria-hidden={ariaHidden}
    />
  );
}
