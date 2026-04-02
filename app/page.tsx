import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Content } from "@/lib/supabase";
import type { Metadata } from "next";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { CATEGORY_LABELS, CATEGORY_SLUGS, CATEGORIES } from "@/lib/categories";

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

function CategoryTag({ category }: { category: string }) {
  const label = CATEGORY_LABELS[category] ?? category.replace(/-/g, " ");
  return (
    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-label font-bold uppercase tracking-wider bg-primary/10 text-primary-dim">
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
  // 15개 카테고리별 view_count 최고 콘텐츠 1개씩 가져오기
  const { data: allContents } = await supabase
    .from("contents")
    .select("*")
    .eq("is_published", true)
    .order("view_count", { ascending: false });

  const contents: Content[] = allContents ?? [];

  // 카테고리별 최고 조회수 콘텐츠 1개씩 선택 (CATEGORIES 순서 유지, 없으면 null)
  const categoryCards: (Content | { _empty: true; category: string })[] =
    CATEGORY_SLUGS.map((slug) => {
      const found = contents.find((c) => c.category === slug);
      return found ?? { _empty: true, category: slug };
    });

  return (
    <div className="px-5 md:px-8 py-8 max-w-5xl mr-auto">
      {/* Hero */}
      <section className="mb-8">
        <h1 className="font-headline font-extrabold text-5xl md:text-6xl text-on-surface tracking-tight mb-3">
          Know Korea
        </h1>
        <p className="text-base font-body text-on-surface-variant mb-6">
          Everything you need to navigate Korea
        </p>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-start gap-3 bg-surface-container-lowest border border-outline-variant/15 rounded-xl p-4">
            <span className="material-symbols-outlined text-[20px] text-primary shrink-0 mt-0.5">coffee</span>
            <p className="text-sm font-body text-on-surface-variant leading-relaxed">Free. Independent. Powered by coffee.</p>
          </div>
          <div className="flex items-start gap-3 bg-surface-container-lowest border border-outline-variant/15 rounded-xl p-4">
            <span className="material-symbols-outlined text-[20px] text-primary shrink-0 mt-0.5">person_add</span>
            <p className="text-sm font-body text-on-surface-variant leading-relaxed">Sign up to comment, ask, and track what you&apos;ve read.</p>
          </div>
        </div>
      </section>

      {/* Best Article by Category — 15 categories, 3×5 grid */}
      <section className="mb-12">
        <h2 className="font-headline font-bold text-xl text-on-surface mb-5">
          Best Article by Category
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryCards.map((item) => {
            // Coming Soon 카드
            if ("_empty" in item) {
              const cat = CATEGORIES.find((c) => c.slug === item.category)!;
              return (
                <Link
                  key={item.category}
                  href={`/${item.category}`}
                  className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-outline-variant/15 transition-all"
                >
                  <div className="h-40 bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-[40px] text-on-surface-variant/20">
                      {cat.icon}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="mb-2">
                      <CategoryTag category={item.category} />
                    </div>
                    <p className="text-xs font-label text-outline mt-2">Coming Soon</p>
                  </div>
                </Link>
              );
            }
            // 일반 콘텐츠 카드
            const guide = item as Content;
            return (
              <Link
                key={guide.slug}
                href={`/${guide.category}/${guide.slug}`}
                className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-outline-variant/15 transition-all"
              >
                <div className="h-40 bg-surface-container overflow-hidden">
                  {guide.cover_image ? (
                    <img
                      src={cloudinaryUrl(guide.cover_image, "card")}
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
            );
          })}
        </div>
      </section>

      {/* BMC Block */}
      <section className="mb-8">
        <div
          className="rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ backgroundColor: "#2D456E" }}
        >
          <div>
            <p className="text-xs font-label font-bold uppercase tracking-widest text-on-primary/60 mb-1">
              Was this helpful?
            </p>
            <p className="font-headline font-bold text-lg text-on-primary mb-1">
              Support Know Korea
            </p>
            <p className="text-sm font-body text-on-primary/70">
              Help keep the guides free and up-to-date.
            </p>
          </div>
          <a
            href="https://www.buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-body font-bold text-sm transition-all active:scale-95 hover:opacity-90 shrink-0"
            style={{ backgroundColor: "#E9C48C", color: "#2D456E" }}
          >
            <span>☕</span>
            Buy Me a Coffee
          </a>
        </div>
      </section>
    </div>
  );
}
