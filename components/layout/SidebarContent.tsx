"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { CATEGORIES } from "@/lib/categories";
import KoFiButton from "@/components/KoFiButton";

export default function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const [showFade, setShowFade] = useState(true);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const check = () => {
      setShowFade(nav.scrollTop + nav.clientHeight < nav.scrollHeight - 4);
    };
    check();
    nav.addEventListener("scroll", check);
    return () => nav.removeEventListener("scroll", check);
  }, []);

  const primaryLinks = [
    { href: "/", icon: "auto_stories", label: "Guide" },
    { href: "/community", icon: "forum", label: "Community" },
  ];

  const footerLinks = [
    { href: "/about", icon: "info", label: "About" },
    { href: "/contact", icon: "mail", label: "Contact" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* 로고 */}
      <div className="flex-shrink-0 px-6 py-4">
        <Link href="/" onClick={onNavigate} className="block">
          <Image
            src="/brand_logo02.png"
            alt="Know Korea"
            width={425}
            height={155}
            className="h-[52px] w-auto object-contain"
            priority
          />
        </Link>
      </div>
      <div className="flex-shrink-0 border-b border-outline-variant/20" />

      {/* Guide + Community */}
      <div className="flex-shrink-0 px-4 py-1.5 space-y-0.5">
        {primaryLinks.map(({ href, icon, label }) => {
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`group relative flex items-center gap-3 px-4 py-1.5 text-base font-bold uppercase tracking-wider rounded-xl transition-colors ${
                isActive
                  ? "bg-surface-container-low text-on-surface"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full" />
              )}
              <span
                className={`material-symbols-outlined text-xl shrink-0 transition-all ${
                  isActive ? "text-primary" : "text-on-surface-variant group-hover:text-on-surface"
                }`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {icon}
              </span>
              {label}
            </Link>
          );
        })}
      </div>
      <div className="flex-shrink-0 border-b border-outline-variant/20" />

      {/* 카테고리 — 스크롤 영역 + 페이드 그라데이션 */}
      <div className="relative flex-1 min-h-0">
        <nav
          ref={navRef}
          className="sidebar-scroll h-full overflow-y-scroll px-4 py-3 flex flex-col gap-0.5"
        >
          {CATEGORIES.map((cat) => {
            const href = `/${cat.slug}`;
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={cat.slug}
                href={href}
                onClick={onNavigate}
                className={`group relative flex items-center gap-3 px-3 py-1.5 rounded-xl transition-all hover:translate-x-1 ${
                  isActive
                    ? "bg-surface-container-low text-on-surface font-bold"
                    : "text-on-surface-variant hover:bg-surface-container-lowest hover:text-on-surface"
                }`}
              >
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
                <span className="text-sm font-body leading-tight">
                  {cat.name}
                  {cat.subtitle && (
                    <span className="block text-[10px] font-label text-on-surface-variant/60 leading-tight">
                      {cat.subtitle}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>
        {/* 하단 페이드 그라데이션 */}
        {showFade && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-surface to-transparent" />
        )}
      </div>

      {/* 하단 — About + Contact + Support */}
      <div className="flex-shrink-0 border-t border-outline-variant/20 px-4 pt-3 pb-8 space-y-1">
        {footerLinks.map(({ href, icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`group flex items-center gap-3 px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? "text-on-surface bg-surface-container-low"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
              }`}
            >
              <span
                className="material-symbols-outlined text-lg shrink-0"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {icon}
              </span>
              {label}
            </Link>
          );
        })}
        <div className="px-1 pt-2">
          <KoFiButton size="sm" label="Buy Us a Coffee" />
        </div>
      </div>
    </div>
  );
}
