function getBreadcrumbList(pathname: string): string[] {
  const currentUrlPath = pathname.replace(/\/+$/, "");
  const breadcrumbList = currentUrlPath.split("/").slice(1);

  if (breadcrumbList[0] === "blog") {
    breadcrumbList.splice(0, 2, `Blog (page ${breadcrumbList[1] || 1})`);
  }
  if (breadcrumbList[0] === "tags" && !isNaN(Number(breadcrumbList[2]))) {
    breadcrumbList.splice(
      1,
      3,
      `${breadcrumbList[1]} ${
        Number(breadcrumbList[2]) === 1
          ? ""
          : "(page " + breadcrumbList[2] + ")"
      }`
    );
  }
  return breadcrumbList;
}

interface BreadcrumbsProps {
  pathname?: string;
}

export default function Breadcrumbs({ pathname }: BreadcrumbsProps) {
  // 기본값: window.location.pathname (SSR/CSR 모두 지원)
  const path =
    typeof window !== "undefined" ? window.location.pathname : pathname || "/";
  const breadcrumbList = getBreadcrumbList(path);

  return (
    <nav
      className="breadcrumb mx-auto mb-1 mt-8 w-full max-w-3xl px-4"
      aria-label="breadcrumb"
    >
      <ul>
        <li className="inline">
          <a href="/" className="capitalize opacity-70 hover:opacity-100">
            Home
          </a>
          <span aria-hidden="true" className="opacity-70">
            &raquo;
          </span>
        </li>
        {breadcrumbList.map((breadcrumb, index) =>
          index + 1 === breadcrumbList.length ? (
            <li className="inline" key={index}>
              <span
                className={`${index > 0 ? "lowercase" : "capitalize"} opacity-70`}
                aria-current="page"
              >
                {decodeURIComponent(breadcrumb)}
              </span>
            </li>
          ) : (
            <li className="inline" key={index}>
              <a
                href={`/${breadcrumb}/`}
                className="capitalize opacity-70 hover:opacity-100"
              >
                {breadcrumb}
              </a>
              <span aria-hidden="true" className="opacity-70">
                &raquo;
              </span>
            </li>
          )
        )}
      </ul>
    </nav>
  );
}
