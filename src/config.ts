import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://flikary.dev/", // replace this with your deployed domain
  author: "Flik",
  profile: "https://flikary.dev/",
  desc: "A minimal, responsive and SEO-friendly Astro blog theme.",
  title: "Flikary",
  ogImage: "flikary-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 8,
  postPerPage: 8,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  editPost: {
    url: "https://github.com/fliklab/astro-paper/edit/main/src/content/posts",
    text: "Suggest Changes",
    appendFilePath: true,
  },
};

export const LOCALE = {
  lang: "ko", // html lang code. Set this empty and default will be "en"
  langTag: ["ko-KR"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/fliklab",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "http://z.ifmage.xyz/2ohq",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:fliklaboratory@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
];
