import Link from "next/link";

const popularGuides = [
  {
    slug: "/life-in-korea/healthcare",
    category: "Life",
    title: "Navigating the Korean Healthcare System: A 2024 Guide",
    excerpt: "Everything you need to know about Korea's health system, from enrollment to hospital visits.",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80",
    completed: false,
  },
  {
    slug: "/life-in-korea/digital-devices",
    category: "Practical",
    title: "Best Digital Devices for Foreigners in Korea",
    excerpt: "A curated list of must-have gadgets for expats navigating life in Seoul and beyond.",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80",
    completed: true,
  },
  {
    slug: "/visa/abc-visa",
    category: "Visa",
    title: "The Ultimate ABC Visa Application",
    excerpt: "Step-by-step guide to securing your visa without the usual headaches and confusion.",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=400&q=80",
    completed: false,
  },
  {
    slug: "/language/korean-workplace",
    category: "Language",
    title: "Mastering Korean Workplace Essentials",
    excerpt: "Key phrases and cultural nuances you need to thrive in a Korean office environment.",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80",
    completed: false,
  },
  {
    slug: "/tools-resources/translation-apps",
    category: "Tools",
    title: "Top 7 Translation Apps That Actually Work",
    excerpt: "Not all translation apps are equal. Here are the ones that actually work for Korean.",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b6f75?w=400&q=80",
    completed: false,
  },
];

const bentoCategories = [
  {
    href: "/life-in-korea",
    label: "Life",
    icon: "home",
    description: "Daily living tips, housing, healthcare, and everything to settle in Korea smoothly.",
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
    description: "Work culture, job hunting, business etiquette, and navigating the Korean workplace.",
    count: 18,
    bg: "bg-surface-container-highest",
    textColor: "text-on-surface",
    mutedColor: "text-on-surface-variant",
    iconColor: "text-on-surface/10",
  },
  {
    href: "/visa",
    label: "Visa",
    icon: "travel_explore",
    description: "Visa types, application procedures, renewals, and immigration office tips.",
    count: 15,
    bg: "bg-tertiary",
    textColor: "text-on-tertiary",
    mutedColor: "text-on-tertiary/70",
    iconColor: "text-on-tertiary/20",
  },
];

const latestGuides = [
  {
    slug: "/practical-guide/food-waste",
    category: "Practical",
    title: "How to correctly sort food waste to regular trash",
    date: "Jul 15, 2024",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=100&q=80",
  },
  {
    slug: "/life-in-korea/apartment-deposit",
    category: "Life",
    title: "Changing your apartment passcode — A step-by-step",
    date: "Jul 14, 2024",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&q=80",
  },
  {
    slug: "/tools-resources/climate-card",
    category: "Tools",
    title: "Getting a climate card (기후카드) for unlimited transport",
    date: "Jul 10, 2024",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100&q=80",
  },
];

const categoryColors: Record<string, string> = {
  Life: "bg-primary/10 text-primary",
  Practical: "bg-surface-container-high text-on-surface-variant",
  Visa: "bg-tertiary/10 text-tertiary",
  Language: "bg-primary-container/60 text-on-primary-container",
  Tools: "bg-surface-container-highest text-on-surface-variant",
};

function CategoryTag({ label }: { label: string }) {
  const cls = categoryColors[label] ?? "bg-surface-container text-on-surface-variant";
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-label font-bold uppercase tracking-wider ${cls}`}>
      {label}
    </span>
  );
}

export default function HomePage() {
  return (
    <div className="px-5 md:px-8 py-8 max-w-5xl mx-auto">
      {/* Hero */}
      <section className="mb-12">
        <p className="text-sm font-body text-on-surface-variant mb-2 leading-relaxed">
          Practical guides for foreigners living, working, and thriving in Korea.<br />
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
          <h2 className="font-headline font-bold text-xl text-on-surface">Popular Guides</h2>
          <Link
            href="/life-in-korea"
            className="text-sm font-body text-primary hover:text-primary-dim transition-colors"
          >
            View All Guides →
          </Link>
        </div>

        {/* Top 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {popularGuides.slice(0, 3).map((guide) => (
            <Link
              key={guide.slug}
              href={guide.slug}
              className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-outline-variant/15 transition-all"
            >
              <div className="h-40 bg-surface-container overflow-hidden">
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <CategoryTag label={guide.category} />
                  {guide.completed && (
                    <span className="text-[10px] font-label font-bold uppercase tracking-wider text-success bg-success-container px-2 py-0.5 rounded-full">
                      Completed
                    </span>
                  )}
                </div>
                <h3 className="font-headline font-bold text-base text-on-surface leading-snug mb-1 line-clamp-2">
                  {guide.title}
                </h3>
                <p className="text-xs font-body text-on-surface-variant line-clamp-2 mb-3">
                  {guide.excerpt}
                </p>
                <span className="text-xs font-label text-outline">{guide.readTime}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom 2 compact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {popularGuides.slice(3).map((guide) => (
            <Link
              key={guide.slug}
              href={guide.slug}
              className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-outline-variant/15 transition-all flex gap-3 p-3"
            >
              <div className="w-20 h-20 bg-surface-container rounded-xl overflow-hidden shrink-0">
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0 py-1">
                <CategoryTag label={guide.category} />
                <h3 className="font-headline font-bold text-sm text-on-surface leading-snug mt-1.5 line-clamp-2">
                  {guide.title}
                </h3>
                <span className="text-xs font-label text-outline mt-1 block">{guide.readTime}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bento Category Cards */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bentoCategories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className={`group relative rounded-3xl p-6 overflow-hidden ${cat.bg} transition-all hover:shadow-xl active:scale-95`}
            >
              {/* Decorative icon */}
              <span
                className={`material-symbols-outlined absolute -bottom-3 -right-3 text-8xl rotate-12 ${cat.iconColor} select-none pointer-events-none`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {cat.icon}
              </span>
              <div className="relative z-10">
                <p className={`text-[10px] font-label font-bold uppercase tracking-widest mb-1 ${cat.mutedColor}`}>
                  Category
                </p>
                <h3 className={`font-headline font-extrabold text-2xl mb-2 ${cat.textColor}`}>
                  {cat.label}
                </h3>
                <p className={`text-sm font-body leading-relaxed mb-4 ${cat.mutedColor}`}>
                  {cat.description}
                </p>
                <span className={`text-sm font-body font-bold ${cat.textColor}`}>
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
          <span className="material-symbols-outlined text-[20px] text-primary">bolt</span>
          <h2 className="font-headline font-bold text-xl text-on-surface">Latest Practical Guides</h2>
        </div>
        <div className="flex flex-col gap-2">
          {latestGuides.map((guide) => (
            <Link
              key={guide.slug}
              href={guide.slug}
              className="group flex items-center gap-4 rounded-2xl p-3 hover:bg-surface-container-lowest transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-surface-container overflow-hidden shrink-0">
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <CategoryTag label={guide.category} />
                <h3 className="font-headline font-bold text-sm text-on-surface leading-snug mt-1 line-clamp-1">
                  {guide.title}
                </h3>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-label text-outline block">{guide.date}</span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant mt-1 block">
                  arrow_forward
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
