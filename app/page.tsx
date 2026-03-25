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

// Category label mapping used for tags on cards
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

const bentoCategories = [
  {
    href: "/life-in-korea",
    label: "Life",
    icon: "home",
    description:
      "Daily living tips, housing, healthcare, and everything to settle in Korea smoothly.",
    count: 24,
    bg: "bg-primary",
    textColor: "text-on-primary",
    mutedColor: "text-on-primary/70",
    iconColor: "text-on-primary/20",
  },
  {
    href: "/work-business",
    label: "Work",
    icon: "work",
    description:
      "Work culture, job hunting, business etiquette, and navigating the Korean workplace.",
    count: 18,
    bg: "bg-surface-container-highest",
    textColor: "text-on-surface",
    mutedColor: "text-on-surface-variant",
    iconColor: "text-on-surface/10",
  },
  {
    href: "/practical-guide",
    label: "Practical",
    icon: "travel_explore",
    description:
      "Visa, bank accounts, phones, and all the practical steps for living in Korea.",
    count: 15,
    bg: "bg-tertiary",
    textColor: "text-on-tertiary",
    mutedColor: "text-on-tertiary/70",
    iconColor: "text-on-tertiary/20",
  },
];

export default async function HomePage() {
  // Popular guides: top 4 by view_count
  const { data: popularRaw } = await supabase
    .from("contents")
    .select("*")
    .eq("is_published", true)
    .order("view_count", { ascending: false })
    .limit(5);

  const popularGuides: Content[] = popularRaw ?? [];

  // Latest practical guides: newest 3 in practical-guide category
  const { data: latestRaw } = await supabase
    .from("contents")
    .select("*")
    .eq("is_published", true)
    .eq("category", "practical-guide")
    .order("created_at", { ascending: false })
    .limit(3);

  const latestGuides: Content[] = latestRaw ?? [];

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

      {/* Popular Guides */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-headline font-bold text-xl text-on-surface">
            Popular Guides
          </h2>
          <Link
            href="/life-in-korea"
            className="text-sm font-body text-primary hover:text-primary-dim transition-colors"
          >
            View All Guides →
          </Link>
        </div>

        {popularGuides.length === 0 ? (
          <p className="text-sm font-body text-on-surface-variant">
            No guides yet. Check back soon!
          </p>
        ) : (
          <>
            {/* Top 3 cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {popularGuides.slice(0, 3).map((guide) => (
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

            {/* Bottom 2 compact cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {popularGuides.slice(3, 5).map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/${guide.category}/${guide.slug}`}
                  className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-outline-variant/15 transition-all flex gap-3 p-3"
                >
                  <div className="w-20 h-20 bg-surface-container rounded-xl overflow-hidden shrink-0">
                    {guide.cover_image ? (
                      <img
                        src={guide.cover_image}
                        alt={guide.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[24px] text-on-surface-variant/20">
                          article
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <CategoryTag category={guide.category} />
                    <h3 className="font-headline font-bold text-sm text-on-surface leading-snug mt-1.5 line-clamp-2">
                      {guide.title}
                    </h3>
                    <span className="text-xs font-label text-outline mt-1 block">
                      {estimateReadTime(guide.body_mdx)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Bento Category Cards (static — always visible) */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bentoCategories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className={`group relative rounded-3xl p-6 overflow-hidden ${cat.bg} transition-all hover:shadow-xl active:scale-95`}
            >
              <span
                className={`material-symbols-outlined absolute -bottom-3 -right-3 text-8xl rotate-12 ${cat.iconColor} select-none pointer-events-none`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {cat.icon}
              </span>
              <div className="relative z-10">
                <p
                  className={`text-[10px] font-label font-bold uppercase tracking-widest mb-1 ${cat.mutedColor}`}
                >
                  Category
                </p>
                <h3
                  className={`font-headline font-extrabold text-2xl mb-2 ${cat.textColor}`}
                >
                  {cat.label}
                </h3>
                <p
                  className={`text-sm font-body leading-relaxed mb-4 ${cat.mutedColor}`}
                >
                  {cat.description}
                </p>
                <span
                  className={`text-sm font-body font-bold ${cat.textColor}`}
                >
                  Browse {cat.count} guides →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Practical Guides */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-5">
          <span className="material-symbols-outlined text-[20px] text-primary">
            bolt
          </span>
          <h2 className="font-headline font-bold text-xl text-on-surface">
            Latest Practical Guides
          </h2>
        </div>
        {latestGuides.length === 0 ? (
          <p className="text-sm font-body text-on-surface-variant">
            No practical guides yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {latestGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/${guide.category}/${guide.slug}`}
                className="group flex items-center gap-4 rounded-2xl p-3 hover:bg-surface-container-lowest transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-surface-container overflow-hidden shrink-0">
                  {guide.cover_image ? (
                    <img
                      src={guide.cover_image}
                      alt={guide.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px] text-on-surface-variant/20">
                        article
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <CategoryTag category={guide.category} />
                  <h3 className="font-headline font-bold text-sm text-on-surface leading-snug mt-1 line-clamp-1">
                    {guide.title}
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-label text-outline block">
                    {new Date(guide.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant mt-1 block">
                    arrow_forward
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
