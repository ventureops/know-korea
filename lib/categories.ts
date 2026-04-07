export interface Category {
  slug: string;
  name: string;
  icon: string;
  subtitle?: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  { slug: "start-here",          name: "Start Here",          icon: "rocket_launch",  description: "Your first steps for life in Korea — the essentials." },
  { slug: "language",            name: "Language",            icon: "font_download",  description: "Korean language guides, tips, and learning resources." },
  { slug: "k-pop",               name: "K-Pop",               icon: "music_note",     description: "Korean pop music, artists, and fan culture." },
  { slug: "k-film",              name: "K-Film",              icon: "movie",          description: "Korean cinema, blockbusters, and indie films." },
  { slug: "k-drama",             name: "K-Drama",             icon: "live_tv",        description: "Korean TV dramas, series, and streaming picks." },
  { slug: "k-sports",            name: "K-Sports",            icon: "sports_soccer",  description: "Korean sports culture, leagues, and major events." },
  { slug: "k-lifestyle",         name: "K-Lifestyle",         icon: "spa",            description: "Korean beauty, food, fashion, and everyday trends." },
  { slug: "culture-society",     name: "Culture & Society",   icon: "theater_comedy", description: "Deep dives into Korean culture, traditions, and social norms." },
  { slug: "history-politics",    name: "History & Politics",  icon: "history_edu",    description: "Understanding Korea's history and contemporary political landscape." },
  { slug: "korea-in-the-world",  name: "Korea in the World",  icon: "public",         description: "Korea's global role, diplomacy, and international influence." },
  { slug: "living-in-korea",     name: "Living in Korea",     icon: "home_pin",       description: "Daily life essentials for foreigners residing in Korea." },
  { slug: "work-business",       name: "Work & Business",     icon: "business_center",description: "Work culture, job hunting, and navigating Korean business." },
  { slug: "economy-money",       name: "Economy & Money",     icon: "payments",       description: "Banking, taxes, investing, and managing finances in Korea." },
  { slug: "travel-places",       name: "Travel & Places",     icon: "explore",        description: "Explore Korea's cities, regions, and hidden gems." },
  { slug: "tools-resources",     name: "Tools & Resources",   icon: "construction",   description: "Apps, websites, and resources every expat should know." },
];

/** { slug → name } 맵 */
export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c.name])
);

/** slug 배열 (순서 보장) */
export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

/** { slug → icon } 맵 */
export const CATEGORY_ICONS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c.icon])
);

/** 카테고리 → 그룹 칩 색상 매핑 (active 상태) */
export const CATEGORY_CHIP_COLORS: Record<string, string> = {
  // Getting Started — Light Blue
  'start-here': 'bg-primary-container text-on-primary-container',
  'language': 'bg-primary-container text-on-primary-container',
  // K-Culture — Dark Blue
  'k-pop': 'bg-primary text-on-primary',
  'k-film': 'bg-primary text-on-primary',
  'k-drama': 'bg-primary text-on-primary',
  'k-sports': 'bg-primary text-on-primary',
  'k-lifestyle': 'bg-primary text-on-primary',
  // Understanding Korea — Dark Green
  'culture-society': 'bg-success text-on-success',
  'history-politics': 'bg-success text-on-success',
  'korea-in-the-world': 'bg-success text-on-success',
  // Life in Korea — Light Green
  'living-in-korea': 'bg-success-container text-success',
  'work-business': 'bg-success-container text-success',
  'economy-money': 'bg-success-container text-success',
  // Travel & Tools — Pink/Red
  'travel-places': 'bg-tertiary-container text-on-tertiary-container',
  'tools-resources': 'bg-tertiary-container text-on-tertiary-container',
};
