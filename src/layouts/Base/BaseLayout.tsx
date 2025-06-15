import React, { useMemo } from "react";
import { LOCALE, SITE } from "@config";
import "@styles/base.css";

interface LayoutProps {
  title?: string;
  author?: string;
  profile?: string;
  description?: string;
  ogImage?: string;
  canonicalURL?: string;
  pubDatetime?: Date;
  modDatetime?: Date | null;
  scrollSmooth?: boolean;
  jsonld?: Record<string, unknown> | string;
  shouldNoindex?: boolean;
  children: React.ReactNode;
}

export default function BaseLayout({
  title = SITE.title,
  author = SITE.author,
  profile = SITE.profile,
  description = SITE.desc,
  ogImage = SITE.ogImage,
  canonicalURL,
  pubDatetime,
  modDatetime,
  scrollSmooth = false,
  jsonld,
  shouldNoindex = false,
  children,
}: LayoutProps) {
  // SSR/CSR 모두 지원
  const currentPath =
    typeof window !== "undefined"
      ? window.location.pathname
      : (typeof global !== "undefined" &&
          (global as { location?: { pathname: string } }).location?.pathname) ||
        "/";
  const siteOrigin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.SITE_ORIGIN || "https://flikary.com";
  const canonical =
    canonicalURL ||
    (typeof window !== "undefined"
      ? window.location.href
      : siteOrigin + currentPath);

  const socialImageURL = useMemo(
    () =>
      (ogImage ?? SITE.ogImage ?? "og.png").startsWith("http")
        ? (ogImage ?? SITE.ogImage ?? "og.png")
        : `${siteOrigin}/${ogImage ?? SITE.ogImage ?? "og.png"}`,
    [ogImage, siteOrigin]
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: `${title}`,
    image: `${socialImageURL}`,
    datePublished: pubDatetime?.toISOString(),
    ...(modDatetime && { dateModified: modDatetime.toISOString() }),
    author: [
      {
        "@type": "Person",
        name: `${author}`,
        url: `${profile}`,
      },
    ],
  };

  // 환경변수
  const googleSiteVerification =
    import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION ||
    process.env.PUBLIC_GOOGLE_SITE_VERIFICATION;
  const googleAnalyticsId =
    import.meta.env.PUBLIC_GOOGLE_ANALYTICS_ID ||
    process.env.PUBLIC_GOOGLE_ANALYTICS_ID;

  return (
    <html
      lang={LOCALE.lang ?? "ko"}
      className={scrollSmooth ? "scroll-smooth" : ""}
    >
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="canonical" href={canonical} />
        <meta name="generator" content="React" />

        {jsonld && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }}
          />
        )}

        {/* Google tag (gtag.js) */}
        {googleAnalyticsId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            ></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${googleAnalyticsId}');
                `,
              }}
            />
          </>
        )}

        {/* General Meta Tags */}
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta name="author" content={author} />
        <link rel="sitemap" href="/sitemap-index.xml" />

        {shouldNoindex && <meta name="robots" content="noindex, nofollow" />}

        {/* Open Graph / Facebook */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={socialImageURL} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ko_KR" />

        {/* Article Published/Modified time */}
        {pubDatetime && (
          <meta
            property="article:published_time"
            content={pubDatetime.toISOString()}
          />
        )}
        {modDatetime && (
          <meta
            property="article:modified_time"
            content={modDatetime.toISOString()}
          />
        )}

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={canonical} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={socialImageURL} />

        {/* Google JSON-LD Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        {/* Google Font (주석 처리) */}
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Gowun+Dodum&family=IBM+Plex+Sans+KR:wght200;400;700&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
          rel="stylesheet"
        /> */}

        <meta name="theme-color" content="" />

        {googleSiteVerification && (
          <meta
            name="google-site-verification"
            content={googleSiteVerification}
          />
        )}

        {/* ViewTransitions, toggle-theme.js 등은 필요시 별도 처리 */}
        {/* <script src=\"/toggle-theme.js\" async /> */}
      </head>
      <body>{children}</body>
    </html>
  );
}
