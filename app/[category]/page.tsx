import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import type { Content } from "@/lib/supabase";
import ContentGrid from "@/components/content/ReadStatusCards";
import { CATEGORIES } from "@/lib/categories";

const categoryMeta = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, { label: c.name, description: c.description, icon: c.icon }])
);

export const revalidate = 3600; // 1시간마다 재생성

const validCategories = CATEGORIES.map((c) => c.slug);

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const meta = categoryMeta[params.category];
  if (!meta) return {};
  return {
    title: meta.label,
    description: meta.description,
  };
}


export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  // 404 for unknown category slugs
  if (!validCategories.includes(params.category)) {
    notFound();
  }

  const meta = categoryMeta[params.category];

  const { data: articlesRaw } = await supabase
    .from("contents")
    .select("*")
    .eq("category", params.category)
    .eq("is_published", true)
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  const articles: Content[] = articlesRaw ?? [];

  return (
    <div className="px-5 md:px-8 py-8 max-w-5xl mr-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-headline font-extrabold text-4xl text-on-surface tracking-tight mb-3">
          {meta.label}
        </h1>
        <p className="text-base font-body text-on-surface-variant leading-relaxed max-w-2xl">
          {meta.description}
        </p>
      </div>

      {/* Article Grid */}
      {articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30 mb-4">
            article
          </span>
          <p className="font-headline font-bold text-lg text-on-surface mb-1">
            No guides yet
          </p>
          <p className="text-sm font-body text-on-surface-variant">
            Check back soon — we're adding new guides regularly.
          </p>
        </div>
      ) : (
        <ContentGrid articles={articles} category={params.category} icon={meta.icon} />
      )}
    </div>
  );
}
