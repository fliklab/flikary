import React from "react";
import { LOGO_IMAGE, SITE } from "@config";

export default function Logo() {
  return (
    <a
      href="/"
      className="logo absolute whitespace-nowrap py-1 text-xl font-semibold sm:static sm:text-2xl"
    >
      {LOGO_IMAGE.enable ? (
        <img
          src={`/assets/${LOGO_IMAGE.svg ? "logo.svg" : "logo.png"}`}
          alt={SITE.title}
          width={LOGO_IMAGE.width}
          height={LOGO_IMAGE.height}
        />
      ) : (
        SITE.title
      )}
    </a>
  );
}
