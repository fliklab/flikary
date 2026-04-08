import { CalendarIcon as RadixCalendarIcon } from "@radix-ui/react-icons";

interface CalendarIconProps {
  className?: string;
  size?: number;
  "aria-hidden"?: boolean;
}

export default function CalendarIcon({
  className,
  size = 24,
  "aria-hidden": ariaHidden,
}: CalendarIconProps) {
  return (
    <RadixCalendarIcon
      width={size}
      height={size}
      className={className}
      aria-hidden={ariaHidden}
    />
  );
}
