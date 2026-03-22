import Link from "next/link";

const dummyContent = {
  category: "Language",
  categoryHref: "/language",
  title: "Mastering the Art of Nuance: Beyond Standard Korean",
  description: "Learning a language isn't just about grammar — it's about life. It's about the way people speak, the tone of traditional Korea. The way you speak reflects your position.",
  readTime: "7 min read",
  date: "Oct 8, 2024",
  image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80",
  likeCount: 84,
  commentCount: 12,
  toc: [
    { id: "hierarchical", label: "The Hierarchical Nature of Speech" },
    { id: "regional", label: "Regional Variations: Satoori" },
    { id: "tips", label: "Key Pro Tips" },
  ],
  relatedQA: [
    { id: "1", title: "Have a specific question about learning Korean?" },
    { id: "2", title: "Ask a Question" },
  ],
  relatedArticles: [
    {
      slug: "/language/korean-workplace",
      title: "Mastering Korean Workplace Essentials",
      readTime: "4 min read",
    },
    {
      slug: "/language/honorifics",
      title: "A Complete Guide to Korean Honorifics",
      readTime: "6 min read",
    },
  ],
};

export default function ContentDetailPage({
  params,
}: {
  params: { category: string; slug: string };
}) {
  const article = dummyContent;

  return (
    <div className="px-5 md:px-8 py-8 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-body text-on-surface-variant mb-6">
        <Link href="/" className="hover:text-on-surface transition-colors">Know Korea</Link>
        <span className="text-outline">›</span>
        <Link href={article.categoryHref} className="hover:text-on-surface transition-colors capitalize">
          {article.category}
        </Link>
        <span className="text-outline">›</span>
        <span className="text-on-surface font-medium line-clamp-1">{article.title}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Main Content */}
        <article className="lg:col-span-8">
          {/* Header */}
          <header className="mb-8">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-label font-bold uppercase tracking-wider bg-primary/10 text-primary mb-3">
              {article.category}
            </span>
            <h1 className="font-headline font-extrabold text-3xl md:text-4xl text-on-surface tracking-tight leading-tight mb-3">
              {article.title}
            </h1>
            <p className="text-base font-body text-on-surface-variant leading-relaxed mb-4">
              {article.description}
            </p>
            <div className="flex items-center gap-4 text-xs font-label text-outline">
              <span>{article.readTime}</span>
              <span>·</span>
              <span>{article.date}</span>
            </div>
          </header>

          {/* Hero Image */}
          <div className="rounded-2xl overflow-hidden mb-8 h-64 md:h-80 bg-surface-container">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Body */}
          <div className="prose-custom font-body text-on-surface leading-relaxed space-y-6 mb-10">
            <h2 id="hierarchical" className="font-headline font-bold text-xl text-on-surface scroll-mt-20">
              The Hierarchical Nature of Speech
            </h2>
            <p className="text-[15px] leading-relaxed text-on-surface-variant">
              Korean language isn't just about grammar — it's about social structure. The way you speak to your boss, your friends, and strangers follows entirely different rules. Understanding these layers isn't optional; it's the foundation of meaningful communication in Korea.
            </p>
            <p className="text-[15px] leading-relaxed text-on-surface-variant">
              There are six formal speech levels in Korean, though modern speakers typically use two or three in daily life. The key distinction is between <strong className="text-on-surface">formal polite (합쇼체)</strong> and <strong className="text-on-surface">informal polite (해요체)</strong> — both appropriate in professional settings.
            </p>

            {/* Key Tip Box */}
            <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[16px] text-primary">lightbulb</span>
                <span className="text-xs font-label font-bold uppercase tracking-wider text-primary">Key Pro Tip</span>
              </div>
              <p className="text-sm font-body text-on-surface-variant leading-relaxed">
                When in doubt, use 해요체 (haeyoche). It's polite enough for most situations without sounding overly stiff. Native speakers will appreciate the effort and usually switch to a more casual form if they're comfortable with you.
              </p>
            </div>

            <h2 id="regional" className="font-headline font-bold text-xl text-on-surface scroll-mt-20">
              Regional Variations: Satoori
            </h2>
            <p className="text-[15px] leading-relaxed text-on-surface-variant">
              Beyond formal speech, Korea has rich regional dialects known as <em>satoori</em> (사투리). The Busan dialect (경상도 사투리) is particularly distinctive, with a musical intonation that differs dramatically from Seoul Korean. Jeolla Province has its own warm cadence, while Jeju Island's dialect is so distinct it can be nearly incomprehensible to mainlanders.
            </p>
            <p className="text-[15px] leading-relaxed text-on-surface-variant">
              For learners, understanding satoori isn't essential early on, but recognizing it exists helps explain why some conversations in dramas or with regional speakers might sound unfamiliar.
            </p>
          </div>

          {/* Like / Share actions */}
          <div className="flex items-center gap-4 py-6 mb-6">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all active:scale-95">
              <span className="material-symbols-outlined text-[18px]">favorite</span>
              <span className="text-sm font-body font-medium">{article.likeCount}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all active:scale-95">
              <span className="material-symbols-outlined text-[18px]">share</span>
              <span className="text-sm font-body font-medium">Share</span>
            </button>
          </div>

          {/* BMC Section */}
          <div
            className="rounded-3xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-4"
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
                Help us keep guides free and up to date.
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

          {/* Comments Section */}
          <section className="mb-10">
            <h2 className="font-headline font-bold text-lg text-on-surface mb-4">
              Join the Conversation
            </h2>
            <div className="bg-surface-container-low rounded-2xl p-5 mb-4">
              <textarea
                placeholder="Add a comment..."
                rows={3}
                className="w-full bg-transparent font-body text-sm text-on-surface placeholder:text-outline resize-none outline-none"
              />
              <div className="flex justify-end mt-2">
                <button className="px-4 py-2 rounded-xl bg-primary text-on-primary font-body font-bold text-sm hover:bg-primary-dim transition-all active:scale-95">
                  Post Comment
                </button>
              </div>
            </div>

            {/* Dummy comment */}
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-surface-container-high shrink-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">person</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-body font-bold text-on-surface">John Kim</span>
                  <span className="text-xs font-label text-outline">2 days ago</span>
                </div>
                <p className="text-sm font-body text-on-surface-variant leading-relaxed">
                  Really helpful guide! The distinction between formal and informal speech tripped me up for months. Wish I had this when I first arrived.
                </p>
              </div>
            </div>
          </section>

          {/* Related Articles */}
          <section className="mb-8">
            <h2 className="font-headline font-bold text-lg text-on-surface mb-4">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {article.relatedArticles.map((rel) => (
                <Link
                  key={rel.slug}
                  href={rel.slug}
                  className="group bg-surface-container-lowest rounded-2xl p-4 shadow-sm hover:shadow-xl border border-outline-variant/15 transition-all"
                >
                  <h3 className="font-headline font-bold text-sm text-on-surface leading-snug mb-1 group-hover:text-primary transition-colors">
                    {rel.title}
                  </h3>
                  <span className="text-xs font-label text-outline">{rel.readTime}</span>
                </Link>
              ))}
            </div>
          </section>
        </article>

        {/* Sidebar */}
        <aside className="hidden lg:block lg:col-span-4">
          <div className="sticky top-20 space-y-6">
            {/* Ask a question CTA */}
            <div className="bg-surface-container-low rounded-2xl p-5">
              <p className="text-xs font-label font-bold uppercase tracking-wider text-outline mb-2">
                Have a question?
              </p>
              <p className="text-sm font-body text-on-surface-variant mb-4 leading-relaxed">
                Have a specific question about this topic? Our community is here to help.
              </p>
              <Link
                href="/qa/new"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary text-on-primary font-body font-bold text-sm hover:bg-primary-dim transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Ask a Question
              </Link>
            </div>

            {/* Table of Contents */}
            <div className="bg-surface-container-low rounded-2xl p-5">
              <p className="text-xs font-label font-bold uppercase tracking-wider text-outline mb-3">
                In this article
              </p>
              <nav className="space-y-2">
                {article.toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-sm font-body text-on-surface-variant hover:text-on-surface transition-colors py-1 leading-snug"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Related Q&A */}
            <div className="bg-surface-container-low rounded-2xl p-5">
              <p className="text-xs font-label font-bold uppercase tracking-wider text-outline mb-3">
                Related Q&A
              </p>
              <div className="space-y-3">
                <Link href="/qa/1" className="block text-sm font-body text-on-surface-variant hover:text-on-surface transition-colors leading-snug">
                  How do I sound more natural when speaking formal Korean at work?
                </Link>
                <Link href="/qa/2" className="block text-sm font-body text-on-surface-variant hover:text-on-surface transition-colors leading-snug">
                  What's the difference between 합쇼체 and 해요체 in practical terms?
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
