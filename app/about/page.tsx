import Link from "next/link";
import type { Metadata } from "next";
import SupportBanner from "@/components/SupportBanner";

export const metadata: Metadata = {
  title: "About",
  description: "Know Korea is a practical information and cultural guide for foreigners living in, moving to, or curious about Korea.",
};

const categories = [
  { name: "Start Here", korean: "시작하기", desc: "New to Korea? Begin here" },
  { name: "Language", korean: "한국어", desc: "Real situational Korean, not textbook drills" },
  { name: "K-Pop", korean: "K-팝", desc: "History, industry, fandoms & artist deep dives" },
  { name: "K-Film", korean: "K-영화", desc: "Directors, genres & the films that defined Korean cinema" },
  { name: "K-Drama", korean: "K-드라마", desc: "Genre guides, must-watch picks & why it hits different" },
  { name: "K-Sports", korean: "K-스포츠", desc: "From taekwondo to esports — how Korea plays to win" },
  { name: "K-Lifestyle", korean: "K-라이프스타일", desc: "K-Beauty, K-Food, webtoons, cafés & daily culture" },
  { name: "Culture & Society", korean: "문화·사회", desc: "The unwritten rules — uri, nunchi, ppalli-ppalli & why" },
  { name: "History & Politics", korean: "역사·정치", desc: "From ancient kingdoms to modern democracy" },
  { name: "Korea in the World", korean: "세계 속 한국", desc: "Semiconductors, shipbuilding, soft power & global influence" },
  { name: "Living in Korea", korean: "한국 생활", desc: "Visas, housing, banks, healthcare & daily logistics" },
  { name: "Work & Business", korean: "일·비즈니스", desc: "How Korean workplaces really function" },
  { name: "Economy & Money", korean: "경제·금융", desc: "Cost of living, chaebols, won & real estate" },
  { name: "Travel & Places", korean: "여행·장소", desc: "Seoul, Busan, Jeju & beyond the tourist trail" },
  { name: "Tools & Resources", korean: "도구·자료", desc: "The apps and services that make life easier" },
];

export default function AboutPage() {
  return (
    <div className="px-5 md:px-8 py-12 max-w-3xl mx-auto">
      {/* Hero */}
      <section className="mb-16">
        <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-on-surface tracking-tight leading-tight mb-4">
          Korea is more than you think.
        </h1>
        <p className="text-base font-body text-on-surface-variant leading-relaxed italic mb-2">
          And we're here to help you discover all of it.
        </p>
        <p className="text-base font-body text-on-surface-variant leading-relaxed italic">
          Discover Curated Korea Insights.
        </p>
      </section>

      {/* Our Story */}
      <section className="mb-12">
        <h2 className="font-headline font-bold text-2xl text-on-surface mb-4">Our Story</h2>
        <div className="space-y-4 font-body text-on-surface-variant leading-relaxed">
          <p>
            I spent over 20 years working in large Korean corporations, traveling constantly for business. In every new country I visited, I had the same thought: <em>I wish I actually understood this place — not just the tourist version, but the real thing.</em>
          </p>
          <p>
            When I turned that question back on Korea — the country I know best — I realized <strong>the answer didn't exist.</strong> Foreigners living here struggled with systems nobody clearly explained. K-Drama and K-Pop fans around the world wanted to understand the culture behind the content they loved. Everyone was piecing things together from scattered blogs, outdated forums, and government sites that read like legal documents.
          </p>
          <p>
            <strong>So I built a one-stop guide — curated, not encyclopedic.</strong>
          </p>
          <p>
            Know Korea isn't trying to be the deepest resource on any single topic. It's designed to give you <strong>a clear, honest picture across everything that matters</strong> — culture, history, daily life, work, travel, and K-Culture — so you can navigate Korea with real understanding, not just survival skills.
          </p>
        </div>
      </section>

      {/* What You'll Find Here */}
      <section className="mb-12">
        <h2 className="font-headline font-bold text-2xl text-on-surface mb-4">What You'll Find Here</h2>
        <div className="space-y-3 font-body text-on-surface-variant leading-relaxed mb-6">
          <p>
            Every guide on this site is written around a single real question — the kind foreigners actually ask, not the kind that makes for a good headline.
          </p>
          <p>
            No filler. No condescending "Korea is a fascinating country" intros. Just clear, honest answers with enough context to actually be useful.
          </p>
          <p className="font-medium text-on-surface">
            15 categories. Nearly 200 guides. One goal.
          </p>
        </div>

        {/* Category Table */}
        <div className="overflow-x-auto rounded-2xl border border-outline-variant/15">
          <table className="w-full text-sm font-body border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="text-left px-4 py-3 font-headline font-bold text-on-surface border-b border-outline-variant/20">Category</th>
                <th className="text-left px-4 py-3 font-headline font-bold text-on-surface border-b border-outline-variant/20">한글</th>
                <th className="text-left px-4 py-3 font-headline font-bold text-on-surface border-b border-outline-variant/20 hidden sm:table-cell">Description</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr key={cat.name} className={i % 2 === 0 ? "bg-surface-container-lowest" : "bg-surface"}>
                  <td className="px-4 py-3 font-medium text-on-surface whitespace-nowrap">{cat.name}</td>
                  <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">{cat.korean}</td>
                  <td className="px-4 py-3 text-on-surface-variant hidden sm:table-cell">{cat.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* How This Works */}
      <section className="mb-12">
        <h2 className="font-headline font-bold text-2xl text-on-surface mb-6">How This Works</h2>
        <div className="space-y-4">
          {[
            {
              step: "01",
              title: "Everything is free.",
              desc: "No paywall. No email gate. No premium tier. Every guide is open to anyone who needs it.",
            },
            {
              step: "02",
              title: "The community makes it better.",
              desc: "Have a question that isn't answered here? Post it in the Community. Other members answer — and the best questions shape future guides.",
            },
            {
              step: "03",
              title: "We're honest about what we don't know.",
              desc: "When something requires a lawyer, a tax accountant, or an immigration specialist, we'll say so clearly. This site is a starting point, not a substitute for professional advice.",
            },
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
      <section className="mb-12">
        <h2 className="font-headline font-bold text-2xl text-on-surface mb-4">A Note on Why This Matters</h2>
        <div className="space-y-4 font-body text-on-surface-variant leading-relaxed">
          <p>
            When you're in a foreign country — whether for a week, a year, or a decade — there's a difference between being <em>present</em> and truly <em>understanding</em>.
          </p>
          <p>
            Understanding why a colleague reacted a certain way in a meeting. Knowing the history behind a neighborhood you're walking through. Recognizing what a political headline actually means for daily life.
          </p>
          <p>
            That kind of knowledge doesn't just make you more effective. It makes the experience richer. It changes how you see people. It turns a foreign place into somewhere that starts to feel like home.
          </p>
          <p>
            That's what Know Korea is for.
          </p>
        </div>
      </section>

      {/* Support */}
      <section className="mb-12">
        <p className="text-sm font-body text-on-surface-variant leading-relaxed mb-6">
          Know Korea is free to use. We don&apos;t run intrusive ads or let sponsors influence what gets written. If contextual recommendations appear — like a language app in a Language article — they&apos;ll always be relevant and clearly marked.
        </p>
        <SupportBanner />
      </section>

      {/* Contact Us */}
      <section className="mb-12">
        <h2 className="font-headline font-bold text-2xl text-on-surface mb-4">Contact Us</h2>
        <p className="text-sm font-body text-on-surface-variant leading-relaxed mb-6">
          Found an error? Have a topic suggestion? Interested in a partnership?
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary font-body font-bold text-sm hover:opacity-90 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">mail</span>
          Contact Us →
        </Link>
      </section>

      {/* 면책조항 */}
      <p className="mt-12 text-sm font-body text-on-surface-variant/70 leading-relaxed italic text-center">
        Know Korea is an independent platform, not affiliated with any government body or institution. All content is for informational purposes based on personal experience and research. Laws, regulations, and procedures may change — always verify important decisions with official sources or qualified professionals.
      </p>
    </div>
  );
}
