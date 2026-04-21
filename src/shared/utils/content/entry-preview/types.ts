export interface EmbeddedEntryPreviewData {
  kind: "blog" | "feed";
  slug: string;
  href: string;
  title: string;
  description: string;
  ogImage?: string;
}
