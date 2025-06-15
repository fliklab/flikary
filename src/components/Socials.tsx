import React from "react";
import { SOCIALS } from "@config";
import LinkButton from "./Header/LinkButton";
import socialIcons from "@assets/socialIcons";

interface SocialsProps {
  centered?: boolean;
}

export default function Socials({ centered = false }: SocialsProps) {
  return (
    <div
      className={`social-icons flex-wrap justify-center gap-1${centered ? "flex" : ""}`}
    >
      {SOCIALS.filter(social => social.active).map(social => (
        <LinkButton
          key={social.name}
          href={social.href}
          className="link-button p-2 hover:rotate-6 sm:p-1"
          title={social.linkTitle}
        >
          <span
            dangerouslySetInnerHTML={{ __html: socialIcons[social.name] }}
          />
          <span className="sr-only">{social.linkTitle}</span>
        </LinkButton>
      ))}
    </div>
  );
}
