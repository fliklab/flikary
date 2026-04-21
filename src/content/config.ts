import { SITE } from "@config";
import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const createBaseContentSchema = ({
  image,
  titleOptional = false,
  descriptionOptional = false,
}) =>
  z.object({
    author: z.string().default(SITE.author),
    pubDatetime: z.date(),
    modDatetime: z.date().optional().nullable(),
    title: titleOptional ? z.string().optional() : z.string(),
    featured: z.boolean().optional(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).default(["others"]),
    ogImage: image()
      .refine(img => img.width >= 1200 && img.height >= 630, {
        message: "OpenGraph image must be at least 1200 X 630 pixels!",
      })
      .or(z.string())
      .optional(),
    thumbnail: image().or(z.string()).optional(),
    description: descriptionOptional ? z.string().optional() : z.string(),
    canonicalURL: z.string().optional(),
    editPost: z
      .object({
        disabled: z.boolean().optional(),
        url: z.string().optional(),
        text: z.string().optional(),
        appendFilePath: z.boolean().optional(),
      })
      .optional(),
    ulternativeUrl: z.string().optional(),
  });

const blog = defineCollection({
  type: "content_layer",
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) => createBaseContentSchema({ image }),
});

const feed = defineCollection({
  type: "content_layer",
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/feed" }),
  schema: ({ image }) =>
    createBaseContentSchema({
      image,
      titleOptional: true,
      descriptionOptional: true,
    }).extend({
      series: z.string().optional(),
      embeds: z
        .array(
          z.object({
            collection: z.enum(["blog", "feed"]),
            slug: z.string(),
          })
        )
        .optional(),
    }),
});

const eduCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { blog, feed, edu: eduCollection };
