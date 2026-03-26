import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Know Korea",
  description:
    "Know Korea is your modern digital curator for expat life in Korea — practical guides, Q&A, and community for foreigners living, working, and thriving here.",
  openGraph: {
    title: "About | Know Korea",
    description:
      "Know Korea is your modern digital curator for expat life in Korea.",
    url: "https://know-korea.vercel.app/about",
    siteName: "Know Korea",
  },
};

export default function AboutPage() {
  return (
    <div className="px-5 md:px-8 py-12 max-w-3xl mx-auto">
      {/* Hero */}
      <section className="mb-16">
        <p className="text-sm font-body text-on-surface-variant mb-3">The Modern Envoy — Your Digital Curator</p>
        <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-on-surface tracking-tight leading-tight mb-6">
          Korea is more than you think.
        </h1>
        <p className="text-base font-body text-on-surface-variant leading-relaxed">
          Know Korea exists to bridge the gap between arriving and thriving. We curate practical, editorial-grade content for the modern expatriate navigating life on the Korean peninsula.
        </p>
      </section>

      {/* Our Story */}
      <section className="mb-12">
        <h2 className="font-headline font-bold text-2xl text-on-surface mb-4">Our Story</h2>
        <div className="space-y-4 font-body text-on-surface-variant leading-relaxed">
          <p>
            Know Korea began as a personal project — a collection of notes, lessons, and hard-won insights gathered over years of living, working, and building in Korea. What started as a private document grew into something larger when friends, colleagues, and strangers started asking the same questions.
          </p>
          <p>
            Korea is one of the world's most dynamic countries, yet information for foreigners is scattered, outdated, or buried behind language barriers. We set out to change that with guides that are honest, up-to-date, and written with the respect that modern expat life deserves.
          </p>
          <p>
            Today, Know Korea is a growing editorial platform — part guide, part community, part digital embassy for those who've chosen Korea as their home, workspace, or adventure.
          </p>
        </div>

        {/* Quote block */}
        <div className="mt-8 bg-surface-container-low rounded-2xl p-6">
          <p className="font-headline font-bold text-lg text-on-surface italic leading-relaxed">
            "A resource where foreigners can navigate Korean culture and daily life without the usual confusion and mistranslations."
          </p>
        </div>
      </section>

      {/* What This Place Is */}
      <section className="mb-12">
        <h2 className="font-headline font-bold text-2xl text-on-surface mb-6">What This Place Is</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: "menu_book", title: "Editorial Guides", desc: "In-depth, researched articles on every aspect of life in Korea — from visa applications to apartment contracts." },
            { icon: "forum", title: "Community Q&A", desc: "Real questions from real people, answered by those who have been through it. No corporate fluff." },
            { icon: "verified", title: "Verified Information", desc: "We fact-check against official Korean government sources and update guides when laws or procedures change." },
            { icon: "translate", title: "Bilingual Resources", desc: "Key terms, official document names, and important phrases are always presented in both English and Korean." },
          ].map((item) => (
            <div key={item.title} className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/15">
              <span className="material-symbols-outlined text-[24px] text-primary mb-3 block">{item.icon}</span>
              <h3 className="font-headline font-bold text-base text-on-surface mb-2">{item.title}</h3>
              <p className="text-sm font-body text-on-surface-variant leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How This Works */}
      <section className="mb-12">
        <h2 className="font-headline font-bold text-2xl text-on-surface mb-6">How This Works</h2>
        <div className="space-y-4">
          {[
            { step: "01", title: "Browse or Search", desc: "Explore 12 categories of curated content, or search for exactly what you need." },
            { step: "02", title: "Read & Learn", desc: "Guides are written to be practical — designed for people in the middle of solving real problems." },
            { step: "03", title: "Ask Questions", desc: "Can't find what you need? Post a question in Q&A and get answers from the community." },
            { step: "04", title: "Track Your Progress", desc: "Create a free account to mark guides as read, bookmark content, and track your learning journey." },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 items-start">
              <span className="font-headline font-extrabold text-2xl text-outline shrink-0 w-8">{item.step}</span>
              <div>
                <h3 className="font-headline font-bold text-base text-on-surface mb-1">{item.title}</h3>
                <p className="text-sm font-body text-on-surface-variant leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* A Note on Why This Matters */}
      <section className="mb-12 rounded-3xl p-8" style={{ backgroundColor: "#000B2D" }}>
        <p className="text-[10px] font-label font-bold uppercase tracking-widest text-on-primary/40 mb-2">
          A Note on Why This Matters
        </p>
        <h2 className="font-headline font-bold text-2xl text-on-primary mb-4">
          Korea deserves better representation.
        </h2>
        <p className="text-sm font-body leading-relaxed mb-4" style={{ color: "rgba(239,242,255,0.7)" }}>
          Too much content about Korea online is filtered through a specific lens — K-pop, K-dramas, or sensationalized expat content. Know Korea exists to offer something different: grounded, respectful, and genuinely useful perspectives on life in one of Asia's most fascinating countries.
        </p>
        <p className="text-sm font-body leading-relaxed" style={{ color: "rgba(239,242,255,0.7)" }}>
          We believe that when people have access to accurate, honest information, they make better decisions — about where to live, how to work, and how to engage with their communities.
        </p>
      </section>

      {/* Support This */}
      <section className="mb-12 text-center">
        <h2 className="font-headline font-bold text-2xl text-on-surface mb-3">Support This</h2>
        <p className="text-sm font-body text-on-surface-variant leading-relaxed mb-6 max-w-md mx-auto">
          Know Korea is independently maintained. If these guides have helped you, consider supporting the work.
        </p>
        <a
          href="https://www.buymeacoffee.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-body font-bold text-sm transition-all active:scale-95 hover:opacity-90"
          style={{ backgroundColor: "#E9C48C", color: "#2D456E" }}
        >
          ☕ Buy Me a Coffee
        </a>
      </section>

      {/* Contact */}
      <section id="contact" className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 bg-surface-container-low rounded-2xl p-5">
          <span className="material-symbols-outlined text-[20px] text-primary mb-2 block">mail</span>
          <h3 className="font-headline font-bold text-base text-on-surface mb-1">Get in Touch</h3>
          <p className="text-sm font-body text-on-surface-variant mb-3">Questions, corrections, or collaboration ideas?</p>
          <a href="mailto:poisian@gmail.com" className="text-sm font-body font-bold text-primary hover:text-primary-dim transition-colors">
            poisian@gmail.com
          </a>
        </div>
        <div id="support" className="flex-1 bg-surface-container-low rounded-2xl p-5">
          <span className="material-symbols-outlined text-[20px] text-primary mb-2 block">help</span>
          <h3 className="font-headline font-bold text-base text-on-surface mb-1">Send Support</h3>
          <p className="text-sm font-body text-on-surface-variant mb-3">Having trouble with the site or need assistance?</p>
          <Link href="/faq" className="text-sm font-body font-bold text-primary hover:text-primary-dim transition-colors">
            Check the FAQ →
          </Link>
        </div>
      </section>
    </div>
  );
}
