import React from "react";
import LinkButton from "./Header/LinkButton";
import socialIcons from "@assets/socialIcons";

const shareLinks = [
  {
    name: "WhatsApp",
    href: "https://wa.me/?text=",
    linkTitle: `Share this post via WhatsApp`,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/sharer.php?u=",
    linkTitle: `Share this post on Facebook`,
  },
  {
    name: "X",
    href: "https://x.com/intent/post?url=",
    linkTitle: `Share this post on X`,
  },
  {
    name: "Telegram",
    href: "https://t.me/share/url?url=",
    linkTitle: `Share this post via Telegram`,
  },
  {
    name: "Pinterest",
    href: "https://pinterest.com/pin/create/button/?url=",
    linkTitle: `Share this post on Pinterest`,
  },
  {
    name: "Mail",
    href: "mailto:?subject=See%20this%20post&body=",
    linkTitle: `Share this post via email`,
  },
] as const;

export default function ShareLinks() {
  const url = typeof window !== "undefined" ? window.location.href : "";
  return (
    <div className="social-icons flex flex-col flex-wrap items-center justify-center gap-1 sm:items-start">
      <span className="italic">Share this post on:</span>
      <div className="text-center">
        {shareLinks.map(social => (
          <LinkButton
            key={social.name}
            href={`${social.href}${url}`}
            className="link-button scale-90 p-2 hover:rotate-6 sm:p-1"
            title={social.linkTitle}
          >
            <span
              dangerouslySetInnerHTML={{ __html: socialIcons[social.name] }}
            />
            <span className="sr-only">{social.linkTitle}</span>
          </LinkButton>
        ))}
      </div>
    </div>
  );
}
