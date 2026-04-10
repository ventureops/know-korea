import Link from "next/link";
import type { Metadata } from "next";
import SupportBanner from "@/components/SupportBanner";

export const revalidate = 3600;

export const metadata: Metadata = {
  description: "Discover Curated Korea Insights.",
};

const starterCategories = [
  {
    slug: "start-here",
    icon: "rocket_launch",
    name: "Start Here",
    description:
      "New to Korea or Know Korea? This is your starting point — the essentials, the basics, and where to go next.",
  },
  {
    slug: "language",
    icon: "font_download",
    name: "Language",
    description:
      "From reading Hangul to survival phrases and K-Pop slang — real Korean for real situations.",
  },
  {
    slug: "culture-society",
    icon: "theater_comedy",
    name: "Culture & Society",
    description:
      "The unwritten rules that make Korea tick — uri, nunchi, ppalli-ppalli, and everything in between.",
  },
];

const themeGroups = [
  {
    title: "Getting Started",
    description:
      "The foundations — language, culture basics, and your first steps in Korea.",
    categories: [
      { slug: "start-here", name: "Start Here" },
      { slug: "language", name: "Language" },
    ],
  },
  {
    title: "K-Culture",
    description:
      "The music, films, dramas, sports, and lifestyle that put Korea on the world stage.",
    categories: [
      { slug: "k-pop", name: "K-Pop" },
      { slug: "k-film", name: "K-Film" },
      { slug: "k-drama", name: "K-Drama" },
      { slug: "k-sports", name: "K-Sports" },
      { slug: "k-lifestyle", name: "K-Lifestyle" },
    ],
  },
  {
    title: "Understanding Korea",
    description:
      "The history, politics, society, and global influence that shaped modern Korea.",
    categories: [
      { slug: "culture-society", name: "Culture & Society" },
      { slug: "history-politics", name: "History & Politics" },
      { slug: "korea-in-the-world", name: "Korea in the World" },
    ],
  },
  {
    title: "Life in Korea",
    description:
      "Practical guides for living, working, and managing money in Korea.",
    categories: [
      { slug: "living-in-korea", name: "Living in Korea" },
      { slug: "work-business", name: "Work & Business" },
      { slug: "economy-money", name: "Economy & Money" },
    ],
  },
  {
    title: "Travel & Tools",
    description:
      "City guides, travel tips, and the apps that make everything easier.",
    categories: [
      { slug: "travel-places", name: "Travel & Places" },
      { slug: "tools-resources", name: "Tools & Resources" },
    ],
  },
];

export default function HomePage() {
  return (
    <div className="px-5 md:px-8 py-8 max-w-5xl mx-auto">
      {/* Hero */}
      <section className="mb-12">
        <h1 className="font-headline font-extrabold text-4xl text-on-surface tracking-tight uppercase mb-2">
          Know Korea Guide
        </h1>
        <p className="text-base font-body text-on-surface-variant">
          Discover Curated Korea Insights
        </p>
      </section>

      {/* Where to Start */}
      <section className="mb-16">
        <h2 className="font-headline font-bold text-xl text-on-surface mb-6">
          Where to Start
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {starterCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group bg-primary rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-on-primary text-2xl">
                  {cat.icon}
                </span>
                <h3 className="text-lg font-bold font-headline text-on-primary">
                  {cat.name}
                </h3>
              </div>
              <p className="text-sm font-body text-on-primary/80 mb-4">
                {cat.description}
              </p>
              <span className="text-sm font-bold text-primary-container">Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Explore by Theme */}
      <section className="mb-16">
        <h2 className="font-headline font-bold text-xl text-on-surface mb-6">
          Explore by Theme
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {themeGroups.map((group, index) => (
            <div
              key={group.title}
              className={`bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 ${
                index === themeGroups.length - 1 ? "md:col-span-2" : ""
              }`}
            >
              <h3 className="font-headline font-bold text-lg text-on-surface mb-2">
                {group.title}
              </h3>
              <p className="text-sm font-body text-on-surface-variant mb-4">
                {group.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/${cat.slug}`}
                    className="text-xs font-body font-medium px-3 py-1.5 rounded-full bg-primary text-on-primary hover:opacity-80 transition-opacity"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community */}
      <section className="mb-12">
        <div className="bg-surface-container-low rounded-2xl p-8 text-center">
          <h2 className="font-headline font-bold text-xl text-on-surface mb-2">
            Join the Community
          </h2>
          <p className="text-sm font-body text-on-surface-variant mb-6 max-w-md mx-auto">
            Share your experiences and start discussions with others who love Korea.
          </p>
          <Link
            href="/community"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-body font-bold text-sm hover:opacity-90 transition-opacity active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">forum</span>
            Visit the Community
          </Link>
        </div>
      </section>

      {/* Support */}
      <section className="mb-12">
        <SupportBanner />
      </section>
    </div>
  );
}
