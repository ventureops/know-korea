import Link from "next/link";

const dummyResults = [
  {
    slug: "/economy-money/bank-account",
    type: "GUIDE",
    category: "Economy",
    title: "The Complete 2024 Guide to Opening a Korean Bank Account",
    excerpt: "Navigating NH, Hana, and Shinhan as an expat. Everything from required documents to online banking setup.",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=400&q=80",
  },
  {
    slug: "/tools-resources/digital-certificates",
    type: "GUIDE",
    category: "Tools",
    title: "Digital Certificates: How to use Toss & Kakao Bank",
    excerpt: "Skip the complicated authentication systems by using these modern alternatives to traditional banking.",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80",
  },
  {
    slug: "/comparison/credit-cards",
    type: "GUIDE",
    category: "Comparison",
    title: "Best Credit Cards for Expats with Low Fees",
    excerpt: "Compare mileage programs and cash-back options from the major providers available to foreign residents.",
    readTime: "15 min read",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
  },
  {
    slug: "/qa/1",
    type: "Q&A",
    category: "Q&A",
    title: "Opening a bank account with just my Passport?",
    excerpt: "I just arrived in Seoul and need to receive a transfer, but my ARC isn't ready yet. Can I open an account?",
    readTime: "34 replies",
    image: null,
  },
  {
    slug: "/qa/2",
    type: "WARNING",
    category: "Q&A",
    title: "Banking scam alert: \"Nonghyup\" SMS",
    excerpt: "A warning to all international students — lots of phishing texts going around pretending to be Nonghyup.",
    readTime: "89 replies",
    image: null,
  },
  {
    slug: "/economy-money/international-transfers",
    type: "GUIDE",
    category: "Finance",
    title: "International Transfers: Wise vs. Swift",
    excerpt: "The most cost-effective ways to send money back home from your Korean bank account.",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&q=80",
  },
];

const typeColors: Record<string, string> = {
  GUIDE: "bg-primary/10 text-primary",
  "Q&A": "bg-surface-container-highest text-on-surface-variant",
  WARNING: "bg-tertiary/10 text-tertiary",
  COMPARISON: "bg-primary-container/60 text-on-primary-container",
  Finance: "bg-success-container text-success",
};

export default function SearchPage() {
  const query = "Bank Account";

  return (
    <div className="px-5 md:px-8 py-8 max-w-5xl mx-auto">
      {/* Search Input */}
      <div className="mb-8">
        <div className="flex items-center gap-3 bg-surface-container-lowest rounded-2xl px-4 py-3 shadow-sm border border-outline-variant/15 max-w-xl">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">search</span>
          <input
            type="text"
            defaultValue={query}
            placeholder="Search guides, Q&A, topics..."
            className="flex-1 bg-transparent font-body text-sm text-on-surface placeholder:text-outline outline-none"
          />
          {query && (
            <button className="text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-[10px] font-label font-bold uppercase tracking-widest text-outline mb-1">
            Search Results
          </p>
          <h1 className="font-headline font-extrabold text-3xl text-on-surface tracking-tight">
            &ldquo;{query}&rdquo;
          </h1>
          <p className="text-sm font-body text-on-surface-variant mt-1">
            Showing 142 relevant guides and community discussions.
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {["All", "Guides", "Q&A", "Relevance"].map((filter, i) => (
            <button
              key={filter}
              className={`px-4 py-1.5 rounded-full text-sm font-body font-medium transition-all active:scale-95 ${
                i === 0
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {dummyResults.map((result) => (
          <Link
            key={result.slug}
            href={result.slug}
            className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-outline-variant/15 transition-all flex flex-col"
          >
            {/* Image or placeholder */}
            <div className="h-44 bg-surface-container overflow-hidden flex items-center justify-center">
              {result.image ? (
                <img
                  src={result.image}
                  alt={result.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : result.type === "WARNING" ? (
                <span className="material-symbols-outlined text-[48px] text-tertiary/40">warning</span>
              ) : (
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant/20">help</span>
              )}
            </div>

            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-label font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${typeColors[result.type] ?? "bg-surface-container text-on-surface-variant"}`}>
                  {result.type}
                </span>
                <span className="text-xs font-label text-outline">{result.readTime}</span>
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
