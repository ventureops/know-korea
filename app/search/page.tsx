import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import type { Content } from "@/lib/supabase";
import SearchInput from "@/components/search/SearchInput";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search | Know Korea",
  description: "Search guides and resources for expats in Korea.",
};

const categoryLabels: Record<string, string> = {
  "start-here": "Start Here",
  language: "Language",
  "life-in-korea": "Life",
  "work-business": "Work",
  "practical-guide": "Practical",
  "culture-society": "Culture",
  "travel-places": "Travel",
  "history-politics": "History",
  "economy-money": "Economy",
  comparison: "Comparison",
  "real-stories": "Stories",
  "tools-resources": "Tools",
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
      className={`text-[10px] font-label font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${cls}`}
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

async function searchContents(query: string): Promise<Content[]> {
  if (!query.trim()) return [];
  const { data } = await supabase
    .from("contents")
    .select("*")
    .eq("is_published", true)
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
    .order("view_count", { ascending: false })
    .limit(24);
  return data ?? [];
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = (searchParams.q ?? "").trim();
  const results: Content[] = query ? await searchContents(query) : [];

  return (
    <div className="px-5 md:px-8 py-8 max-w-5xl mx-auto">
      {/* Search Input (client component) */}
      <div className="mb-8">
        <Suspense fallback={null}>
          <SearchInput />
        </Suspense>
      </div>

      {/* Results Header */}
      {query && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-[10px] font-label font-bold uppercase tracking-widest text-outline mb-1">
              Search Results
            </p>
            <h1 className="font-headline font-extrabold text-3xl text-on-surface tracking-tight">
              &ldquo;{query}&rdquo;
            </h1>
            <p className="text-sm font-body text-on-surface-variant mt-1">
              {results.length > 0
                ? `${results.length} guide${results.length === 1 ? "" : "s"} found`
                : "No guides found"}
            </p>
          </div>
        </div>
      )}

      {/* No query state */}
      {!query && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-[64px] text-on-surface-variant/20 mb-4">
            search
          </span>
          <p className="font-headline font-bold text-xl text-on-surface mb-2">
            Search Know Korea
          </p>
          <p className="text-sm font-body text-on-surface-variant max-w-sm">
            Type a topic above — visa, healthcare, banking, apartments, and
            more.
          </p>
        </div>
      )}

      {/* No results state */}
      {query && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-[64px] text-on-surface-variant/20 mb-4">
            search_off
          </span>
          <p className="font-headline font-bold text-xl text-on-surface mb-2">
            No results for &ldquo;{query}&rdquo;
          </p>
          <p className="text-sm font-body text-on-surface-variant max-w-sm mb-6">
            Try different keywords, or{" "}
            <Link
              href="/qa/new"
              className="text-primary hover:text-primary-dim font-bold transition-colors"
            >
              ask the community
            </Link>
            .
          </p>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-surface-container text-on-surface font-body font-medium text-sm hover:bg-surface-container-high transition-all active:scale-95"
          >
            Browse All Guides
          </Link>
        </div>
      )}

      {/* Results Grid */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {results.map((result) => (
            <Link
              key={result.slug}
              href={`/${result.category}/${result.slug}`}
              className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-outline-variant/15 transition-all flex flex-col"
            >
              <div className="h-44 bg-surface-container overflow-hidden flex items-center justify-center">
                {result.cover_image ? (
                  <img
                    src={result.cover_image}
                    alt={result.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <span className="material-symbols-outlined text-[48px] text-on-surface-variant/20">
                    article
                  </span>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CategoryTag category={result.category} />
                  <span className="text-xs font-label text-outline">
                    {estimateReadTime(result.body_mdx)}
                  </span>
                </div>
                <h3 className="font-headline font-bold text-base text-on-surface leading-snug mb-2 line-clamp-2">
                  {result.title}
                </h3>
                <p className="text-xs font-body text-on-surface-variant leading-relaxed line-clamp-2 flex-1">
                  {result.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
