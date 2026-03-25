import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import type { Content } from "@/lib/supabase";

// ── Category metadata ────────────────────────────────────────
const categoryMeta: Record<
  string,
  { label: string; description: string; icon: string }
> = {
  "start-here": {
    label: "Start Here",
    description: "Your first steps for life in Korea — the essentials.",
    icon: "flag",
  },
  language: {
    label: "Language",
    description:
      "Korean language guides, tips, and learning resources.",
    icon: "translate",
  },
  "life-in-korea": {
    label: "Life in Korea",
    description:
      "Navigating daily life in the Land of the Morning Calm. From residential tips to local etiquette, curated for the modern digital nomad.",
    icon: "location_on",
  },
  "work-business": {
    label: "Work & Business",
    description:
      "Work culture, job hunting, and navigating Korean business environments.",
    icon: "work",
  },
  "practical-guide": {
    label: "Practical Guide",
    description:
      "Hands-on guides for everyday situations you'll encounter in Korea.",
    icon: "menu_book",
  },
  "culture-society": {
    label: "Culture & Society",
    description:
      "Deep dives into Korean culture, traditions, and social norms.",
    icon: "diversity_3",
  },
  "travel-places": {
    label: "Travel & Places",
    description: "Explore Korea's cities, regions, and hidden gems.",
    icon: "map",
  },
  "history-politics": {
    label: "History & Politics",
    description:
      "Understanding Korea's history and contemporary political landscape.",
    icon: "history_edu",
  },
  "economy-money": {
    label: "Economy & Money",
    description:
      "Banking, taxes, investing, and managing finances in Korea.",
    icon: "payments",
  },
  comparison: {
    label: "Comparison",
    description:
      "Side-by-side comparisons of services, products, and options in Korea.",
    icon: "compare",
  },
  "real-stories": {
    label: "Real Stories",
    description: "First-hand accounts from expats living and thriving in Korea.",
    icon: "auto_stories",
  },
  "tools-resources": {
    label: "Tools & Resources",
    description:
      "Apps, websites, and resources every expat in Korea should know.",
    icon: "construction",
  },
};

export const revalidate = 3600; // 1시간마다 재생성

const validCategories = Object.keys(categoryMeta);

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const meta = categoryMeta[params.category];
  if (!meta) return { title: "Know Korea" };
  return {
    title: `${meta.label} | Know Korea`,
    description: meta.description,
    openGraph: {
      title: `${meta.label} | Know Korea`,
      description: meta.description,
      url: `https://know-korea.vercel.app/${params.category}`,
      siteName: "Know Korea",
    },
  };
}

function estimateReadTime(body: string | null): string {
  if (!body) return "3 min read";
  const words = body.replace(/<[^>]+>/g, "").split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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
    <div className="px-5 md:px-8 py-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-body text-on-surface-variant mb-6">
        <Link href="/" className="hover:text-on-surface transition-colors">
          Know Korea
        </Link>
        <span className="text-outline">›</span>
        <span className="text-on-surface font-medium">{meta.label}</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-label font-bold uppercase tracking-widest text-outline">
            — Category Guide
          </span>
        </div>
        <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-on-surface tracking-tight mb-3">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/${params.category}/${article.slug}`}
              className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-outline-variant/15 transition-all flex flex-col"
            >
              <div className="h-48 bg-surface-container overflow-hidden">
                {article.cover_image ? (
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[48px] text-on-surface-variant/20">
                      {meta.icon}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-label text-outline">
                    {estimateReadTime(article.body_mdx)}
                  </span>
                  <span className="text-xs font-label text-outline">·</span>
                  <span className="text-xs font-label text-outline">
                    {formatDate(article.created_at)}
                  </span>
                </div>
                <h3 className="font-headline font-bold text-base text-on-surface leading-snug mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm font-body text-on-surface-variant leading-relaxed line-clamp-3 flex-1">
                  {article.excerpt}
                </p>
                <div className="flex items-center mt-4">
                  <span className="text-sm font-body font-bold text-primary hover:text-primary-dim transition-colors">
                    Read Article →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
