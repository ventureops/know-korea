"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
  { href: "/start-here", label: "Start Here", icon: "flag" },
  { href: "/language", label: "Language", icon: "font_download" },
  { href: "/life-in-korea", label: "Life in Korea", icon: "location_on" },
  { href: "/work-business", label: "Work & Business", icon: "work" },
  { href: "/practical-guide", label: "Practical Guide", icon: "menu_book" },
  { href: "/culture-society", label: "Culture & Society", icon: "diversity_3" },
  { href: "/travel-places", label: "Travel & Places", icon: "map" },
  { href: "/history-politics", label: "History & Politics", icon: "history_edu" },
  { href: "/economy-money", label: "Economy & Money", icon: "payments" },
  { href: "/comparison", label: "Comparison", icon: "compare" },
  { href: "/real-stories", label: "Real Stories", icon: "auto_stories" },
  { href: "/tools-resources", label: "Tools & Resources", icon: "construction" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-14 z-40 hidden h-[calc(100vh-3.5rem)] w-64 bg-surface/70 backdrop-blur-xl md:flex md:flex-col overflow-y-auto">
      <div className="px-4 pt-5 pb-3">
        <p className="text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-1">
          Categories
        </p>
        <p className="text-xs font-body text-on-surface-variant/70 mb-4">
          Explore Korea
        </p>

        <nav className="flex flex-col gap-0.5">
          {categories.map((cat) => {
            const isActive = pathname === cat.href || pathname.startsWith(cat.href + "/");
            return (
              <Link
                key={cat.href}
                href={cat.href}
                className={`group relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all hover:translate-x-1 ${
                  isActive
                    ? "bg-surface-container-low text-on-surface font-bold"
                    : "text-on-surface-variant hover:bg-surface-container-lowest hover:text-on-surface"
                }`}
              >
                {/* Active pill indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full" />
                )}
                <span
                  className={`material-symbols-outlined text-[18px] shrink-0 transition-all ${
                    isActive ? "text-primary" : "text-on-surface-variant group-hover:text-on-surface"
                  }`}
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {cat.icon}
                </span>
                <span className="text-sm font-body">{cat.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* BMC Link */}
        <div className="mt-2 pt-2 border-t border-outline-variant/15">
          <a
            href="https://www.buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container-lowest hover:text-on-surface transition-all"
          >
            <span className="material-symbols-outlined text-[18px] shrink-0 text-on-surface-variant">
              coffee
            </span>
            <span className="text-sm font-body">Buy me a Coffee</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
