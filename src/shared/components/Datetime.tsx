import { LOCALE } from "@config";
import type { CollectionEntry } from "astro:content";
import CalendarIcon from "@icons/content/Calendar";

interface DatetimesProps {
  pubDatetime: string | Date;
  modDatetime: string | Date | undefined | null;
}

interface EditPostProps {
  editPost?: CollectionEntry<"blog">["data"]["editPost"];
  postId?: CollectionEntry<"blog">["id"];
}

interface Props extends DatetimesProps, EditPostProps {
  size?: "sm" | "lg";
  className?: string;
}

export default function Datetime({
  pubDatetime,
  modDatetime,
  size = "sm",
  className = "",
}: Props) {
  return (
    <div
      className={`flex items-center space-x-2 opacity-80 ${className}`.trim()}
    >
      <CalendarIcon
        className={`${
          size === "sm" ? "scale-90" : "scale-100"
        } inline-block h-6 w-6 min-w-[1.375rem] fill-skin-base`}
        aria-hidden={true}
      />
      {modDatetime && modDatetime > pubDatetime ? (
        <span className={`italic ${size === "sm" ? "text-sm" : "text-base"}`}>
          Updated:
        </span>
      ) : (
        <span className="sr-only">Published:</span>
      )}
      <span className={`italic ${size === "sm" ? "text-sm" : "text-base"}`}>
        <FormattedDatetime
          pubDatetime={pubDatetime}
          modDatetime={modDatetime}
        />
      </span>
    </div>
  );
}

const FormattedDatetime = ({ pubDatetime, modDatetime }: DatetimesProps) => {
  const myDatetime = new Date(
    modDatetime && modDatetime > pubDatetime ? modDatetime : pubDatetime
  );

  const date = myDatetime.toLocaleDateString(LOCALE.langTag, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <time dateTime={myDatetime.toISOString()}>{date}</time>
    </>
  );
};
