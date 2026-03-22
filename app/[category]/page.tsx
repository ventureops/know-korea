import Link from "next/link";

const categoryMeta: Record<string, { label: string; description: string; icon: string }> = {
  "start-here": { label: "Start Here", description: "Your first steps for life in Korea — the essentials.", icon: "flag" },
  "language": { label: "Language", description: "Korean language guides, tips, and learning resources.", icon: "translate" },
  "life-in-korea": { label: "Life in Korea", description: "Navigating daily life in the Land of the Morning Calm. From residential tips to local etiquette, curated for the modern digital nomad.", icon: "location_on" },
  "work-business": { label: "Work & Business", description: "Work culture, job hunting, and navigating Korean business environments.", icon: "work" },
  "practical-guide": { label: "Practical Guide", description: "Hands-on guides for everyday situations you'll encounter in Korea.", icon: "menu_book" },
  "culture-society": { label: "Culture & Society", description: "Deep dives into Korean culture, traditions, and social norms.", icon: "diversity_3" },
  "travel-places": { label: "Travel & Places", description: "Explore Korea's cities, regions, and hidden gems.", icon: "map" },
  "history-politics": { label: "History & Politics", description: "Understanding Korea's history and contemporary political landscape.", icon: "history_edu" },
  "economy-money": { label: "Economy & Money", description: "Banking, taxes, investing, and managing finances in Korea.", icon: "payments" },
  "comparison": { label: "Comparison", description: "Side-by-side comparisons of services, products, and options in Korea.", icon: "compare" },
  "real-stories": { label: "Real Stories", description: "First-hand accounts from expats living and thriving in Korea.", icon: "auto_stories" },
  "tools-resources": { label: "Tools & Resources", description: "Apps, websites, and resources every expat in Korea should know.", icon: "construction" },
};

const dummyArticles = [
  {
    slug: "finding-your-first-hanok",
    category: "Housing",
    title: "Finding Your First Hanok: A Guide to Local Rentals",
    excerpt: "Everything you need to know about jeonse and wolse contracts before you sign anything.",
    readTime: "5 min read",
    date: "Oct 15, 2024",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
    completed: false,
  },
  {
    slug: "mastering-etiquette",
    category: "Dining",
    title: "Mastering the Art of Hoesk: Etiquette 101",
    excerpt: "Don't pour your own drink! Learn the essential social rules for dining with Koreans.",
    readTime: "4 min read",
    date: "Oct 8, 2024",
    image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600&q=80",
    completed: true,
  },
  {
    slug: "public-transit-guide",
    category: "Transport",
    title: "T-Money vs. Credit: Navigating Public Transit",
    excerpt: "A practical comparison of transportation cards and payment options across Korean cities.",
    readTime: "3 min read",
    date: "Sep 30, 2024",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80",
    completed: false,
  },
  {
    slug: "healthcare-insurance",
    category: "Health",
    title: "Understanding the National Health Insurance System",
    excerpt: "How to enroll, what's covered, and how to navigate hospitals without a Korean speaker.",
    readTime: "7 min read",
    date: "Sep 22, 2024",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80",
    completed: false,
  },
  {
    slug: "recycling-guide",
    category: "Practical",
    title: "Recycling Like a Local: The Sseuregi System",
    excerpt: "Avoid fines and confusion with our comprehensive guide to sorting your recycling in Korea.",
    readTime: "4 min read",
    date: "Sep 15, 2024",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80",
    completed: true,
  },
  {
    slug: "convenience-stores",
    category: "Lifestyle",
    title: "24/7 Convenience: Hacks for the Pyeonuijeom Life",
    excerpt: "How convenience stores became the social and functional hub of modern Korean life.",
    readTime: "3 min read",
    date: "Sep 8, 2024",
    image: "https://images.unsplash.com/photo-1567958451986-2de427a4a0be?w=600&q=80",
    completed: false,
  },
];

const categoryColors: Record<string, string> = {
  Housing: "bg-primary/10 text-primary",
  Dining: "bg-tertiary/10 text-tertiary",
  Transport: "bg-surface-container-highest text-on-surface-variant",
  Health: "bg-success-container text-success",
  Practical: "bg-surface-container-high text-on-surface-variant",
  Lifestyle: "bg-primary-container/60 text-on-primary-container",
};

function CategoryTag({ label }: { label: string }) {
  const cls = categoryColors[label] ?? "bg-surface-container text-on-surface-variant";
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-label font-bold uppercase tracking-wider ${cls}`}>
      {label}
    </span>
  );
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const meta = categoryMeta[params.category] ?? {
    label: params.category.replace(/-/g, " "),
    description: "Explore curated guides for expats in Korea.",
    icon: "article",
  };

  return (
    <div className="px-5 md:px-8 py-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-body text-on-surface-variant mb-6">
        <Link href="/" className="hover:text-on-surface transition-colors">Know Korea</Link>
        <span className="text-outline">›</span>
        <span className="text-on-surface font-medium">{meta.label}</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-label font-bold uppercase tracking-widest text-outline">
            — Premium Guide
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {dummyArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/${params.category}/${article.slug}`}
            className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-outline-variant/15 transition-all flex flex-col"
          >
            <div className="h-48 bg-surface-container overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-3">
                <CategoryTag label={article.category} />
                <span className="text-xs font-label text-outline">{article.readTime}</span>
                <span className="text-xs font-label text-outline">·</span>
                <span className="text-xs font-label text-outline">{article.date}</span>
              </div>
              <h3 className="font-headline font-bold text-base text-on-surface leading-snug mb-2 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-sm font-body text-on-surface-variant leading-relaxed line-clamp-3 flex-1">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between mt-4">
                {article.completed ? (
                  <span className="text-[10px] font-label font-bold uppercase tracking-wider text-success bg-success-container px-2.5 py-1 rounded-full">
                    Completed
                  </span>
                ) : (
                  <span className="text-sm font-body font-bold text-primary hover:text-primary-dim transition-colors">
                    Read Article →
                  </span>
                )}
                {article.completed && (
                  <button className="text-xs font-label text-on-surface-variant hover:text-on-surface flex items-center gap-1 transition-colors">
                    <span className="material-symbols-outlined text-[14px]">reviews</span>
                    Review
                  </button>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <button className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all active:scale-95">
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>
        {[1, 2, 3].map((page) => (
          <button
            key={page}
            className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-body font-bold transition-all active:scale-95 ${
              page === 1
                ? "bg-primary text-on-primary"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {page}
          </button>
        ))}
        <button className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all active:scale-95">
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
