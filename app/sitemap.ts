import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { CATEGORY_SLUGS } from "@/lib/categories";

const BASE_URL = "https://know-korea.vercel.app";

const staticRoutes = [
  { url: BASE_URL, priority: 1.0 },
  { url: `${BASE_URL}/about`, priority: 0.7 },
  { url: `${BASE_URL}/faq`, priority: 0.7 },
  { url: `${BASE_URL}/legal`, priority: 0.5 },
  { url: `${BASE_URL}/search`, priority: 0.6 },
  { url: `${BASE_URL}/community`, priority: 0.8 },
];

const categoryRoutes = CATEGORY_SLUGS.map((slug) => ({
  url: `${BASE_URL}/${slug}`,
  priority: 0.8,
}));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let contentRoutes: MetadataRoute.Sitemap = [];

  try {
    const { data: contents } = await supabase
      .from("contents")
      .select("category, slug, updated_at")
      .eq("is_published", true)
      .order("updated_at", { ascending: false });

    contentRoutes = (contents ?? []).map((c) => ({
      url: `${BASE_URL}/${c.category}/${c.slug}`,
      lastModified: new Date(c.updated_at),
      priority: 0.9,
      changeFrequency: "weekly" as const,
    }));
  } catch {
    // If DB is unreachable (e.g. during build without env vars), skip content routes
  }

  return [
    ...staticRoutes.map((r) => ({
      url: r.url,
      lastModified: new Date(),
      priority: r.priority,
      changeFrequency: "weekly" as const,
    })),
    ...categoryRoutes.map((r) => ({
      url: r.url,
      lastModified: new Date(),
      priority: r.priority,
      changeFrequency: "weekly" as const,
    })),
    ...contentRoutes,
  ];
}
