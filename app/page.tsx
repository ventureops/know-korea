import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Content } from "@/lib/supabase";
import type { Metadata } from "next";

export const revalidate = 3600; // 1시간마다 재생성

export const metadata: Metadata = {
  title: "Know Korea — The Modern Envoy",
  description:
    "Everything you need to navigate Korea. Practical guides for foreigners living, working, and thriving in Korea.",
  openGraph: {
    title: "Know Korea — The Modern Envoy",
    description:
      "Everything you need to navigate Korea. Practical guides for foreigners living, working, and thriving in Korea.",
    url: "https://know-korea.vercel.app",
    siteName: "Know Korea",
    type: "website",
  },
};

// SPEC.md §12 순서대로 12개 카테고리
const categoryOrder = [
  "start-here",
  "language",
  "life-in-korea",
  "work-business",
  "practical-guide",
  "culture-society",
  "travel-places",
  "history-politics",
  "economy-money",
  "comparison",
  "real-stories",
  "tools-resources",
] as const;

const categoryLabels: Record<string, string> = {
  "start-here": "Start Here",
  language: "Language",
  "life-in-korea": "Life in Korea",
  "work-business": "Work & Business",
  "practical-guide": "Practical Guide",
  "culture-society": "Culture & Society",
  "travel-places": "Travel & Places",
  "history-politics": "History & Politics",
  "economy-money": "Economy & Money",
  comparison: "Comparison",
  "real-stories": "Real Stories",
  "tools-resources": "Tools & Resources",
};

const categoryColors: Record<string, string> = {
  "start-here": "bg-primary/10 text-primary",
  language: "bg-primary-container/60 text-on-primary-container",
  "life-in-korea": "bg-primary/10 text-primary",
  "work-business": "bg-surface-container-highest text-on-surface-variant",
  "practical-guide": "bg-surface-container-high text-on-surface-variant",
  "culture-society": "bg-tertiary/10 text-tertiary",
  "travel-places": "bg-primary/10 text-primary",
  "history-politics": "bg-surface-container-high text-on-surface-variant",
  "economy-money": "bg-success-container text-success",
  comparison: "bg-primary-container/60 text-on-primary-container",
  "real-stories": "bg-tertiary/10 text-tertiary",
  "tools-resources": "bg-surface-container-highest text-on-surface-variant",
};

function CategoryTag({ category }: { category: string }) {
  const label = categoryLabels[category] ?? category.replace(/-/g, " ");
  const cls =
    categoryColors[category] ?? "bg-surface-container text-on-surface-variant";
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-label font-bold uppercase tracking-wider ${cls}`}
    >
      {label}
    </span>
  );
}

function estimateReadTime(body: string | null): string {
  if (!body) return "3 min read";
  const words = body.replace(/<[^>]+>/g, "").split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

export default async function HomePage() {
  // 12개 카테고리별 view_count 최고 콘텐츠 1개씩 가져오기
  const { data: allContents } = await supabase
    .from("contents")
    .select("*")
    .eq("is_published", true)
    .order("view_count", { ascending: false });

  const contents: Content[] = allContents ?? [];

  // 카테고리별 최고 조회수 콘텐츠 1개씩 선택 (SPEC §12 순서)
  const categoryCards: Content[] = [];
  for (const cat of categoryOrder) {
    const found = contents.find((c) => c.category === cat);
    if (found) categoryCards.push(found);
  }

  return (
    <div className="px-5 md:px-8 py-8 max-w-5xl mx-auto">
      {/* Hero */}
      <section className="mb-12">
        <p className="text-sm font-body text-on-surface-variant mb-2 leading-relaxed">
          Practical guides for foreigners living, working, and thriving in
          Korea.
          <br />
          Current insights for your digital lifestyle in the peninsula.
        </p>
        <h1 className="font-headline font-extrabold text-5xl md:text-6xl text-on-surface tracking-tight mb-6">
          Know Korea
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/start-here"
            className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-body font-bold text-sm hover:bg-primary-dim transition-all active:scale-95"
          >
            Start Here
          </Link>
          <Link
            href="/qa/new"
            className="px-5 py-2.5 rounded-xl bg-surface-container text-on-surface font-body font-medium text-sm hover:bg-surface-container-high transition-all active:scale-95"
          >
            Ask a Question
          </Link>
        </div>
      </section>

      {/* Popular Guides — 12 categories, 3×4 grid */}
      <section className="mb-12">
        <h2 className="font-headline font-bold text-xl text-on-surface mb-5">
          Popular Guides
        </h2>

        {categoryCards.length === 0 ? (
          <p className="text-sm font-body text-on-surface-variant">
            No guides yet. Check back soon!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryCards.map((guide) => (
              <Link
                key={guide.slug}
                href={`/${guide.category}/${guide.slug}`}
                className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-outline-variant/15 transition-all"
              >
                <div className="h-40 bg-surface-container overflow-hidden">
                  {guide.cover_image ? (
                    <img
                      src={guide.cover_image}
                      alt={guide.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-[40px] text-on-surface-variant/20">
                        article
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="mb-2">
                    <CategoryTag category={guide.category} />
                  </div>
                  <h3 className="font-headline font-bold text-base text-on-surface leading-snug mb-1 line-clamp-2">
                    {guide.title}
                  </h3>
                  <p className="text-xs font-body text-on-surface-variant line-clamp-2 mb-3">
                    {guide.excerpt}
                  </p>
                  <span className="text-xs font-label text-outline">
                    {estimateReadTime(guide.body_mdx)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
