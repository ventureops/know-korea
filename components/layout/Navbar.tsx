"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { CATEGORIES } from "@/lib/categories";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session, status } = useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Derive current category slug from pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  const currentCategory = pathSegments[0] ?? "";

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav className="fixed top-0 z-50 w-full h-14 bg-surface/70 backdrop-blur-xl flex items-center px-4 md:px-6 gap-4">
        {/* Hamburger — mobile only */}
        <button
          aria-label="Open menu"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[22px]">
            {mobileOpen ? "close" : "menu"}
          </span>
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0" onClick={() => setMobileOpen(false)}>
          <Image src="/brand_logo.png" alt="Know Korea" height={36} width={120} className="h-9 w-auto object-contain" />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-sm font-body transition-colors rounded-lg ${
                  isActive
                    ? "font-bold text-on-surface border-b-2 border-primary"
                    : "font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex-1" />

        {/* Search — Link to /search */}
        <Link
          href="/search"
          aria-label="Search"
          className="w-9 h-9 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
        </Link>

        {/* Auth area */}
        {status === "loading" ? (
          <div className="w-9 h-9 rounded-full bg-surface-container animate-pulse" />
        ) : session ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:ring-2 hover:ring-primary/30 transition-all active:scale-95"
              aria-label="Profile menu"
            >
              {session.user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cloudinaryUrl(session.user.image, "avatar")} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="font-headline font-bold text-sm text-on-surface">
                  {(session.user.nickname ?? session.user.name ?? "?")[0].toUpperCase()}
                </span>
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-11 w-52 bg-surface-container-lowest rounded-2xl shadow-lg border border-outline-variant/15 py-2 z-50">
                <div className="px-4 py-2 border-b border-outline-variant/10">
                  <p className="text-sm font-body font-bold text-on-surface truncate">
                    {session.user.nickname ?? session.user.name}
                  </p>
                  <p className="text-xs font-body text-on-surface-variant truncate">
                    {session.user.email}
                  </p>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-body text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">person</span>
                  Profile
                </Link>
                <Link
                  href="/notifications"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-body text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">notifications</span>
                  Notifications
                </Link>
                {(session.user.role ?? 0) >= 3 && (
                  <Link
                    href="/admin"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-body text-primary hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => { setDropdownOpen(false); signOut({ callbackUrl: "/" }); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-body text-error hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="px-4 py-1.5 rounded-full bg-primary text-on-primary font-body font-medium text-sm hover:opacity-90 transition-all active:scale-95"
          >
            Login
          </Link>
        )}
      </nav>

      {/* Mobile Category Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-inverse-surface/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Category Drawer */}
      <div
        className={`fixed left-0 top-0 h-full w-72 bg-surface/95 backdrop-blur-2xl z-50 md:hidden flex flex-col transition-transform duration-300 ease-out overflow-y-auto py-6 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
              Explore Korea
            </p>
            <h3 className="text-sm font-headline font-bold text-primary">Categories</h3>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-full hover:bg-surface-container-high transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Category List */}
        <nav className="flex flex-col">
          {CATEGORIES.map((cat) => {
            const isActive = currentCategory === cat.slug;
            return (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 py-3 px-6 transition-all border-l-2 ${
                  isActive
                    ? "text-primary font-bold border-primary bg-primary-container/10"
                    : "text-on-surface-variant hover:bg-surface-container-low border-transparent"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[18px] shrink-0 ${isActive ? "text-primary" : "text-on-surface-variant"}`}
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {cat.icon}
                </span>
                <span className="text-sm font-label">{cat.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom links */}
        <div className="mt-6 px-6 pt-4 border-t border-outline-variant/15 flex flex-col gap-1">
          {[
            { href: "/community", icon: "forum", label: "Community" },
            { href: "/about", icon: "info", label: "About" },
          ].map(({ href, icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all ${
                  isActive
                    ? "text-on-surface font-bold bg-surface-container-low"
                    : "text-on-surface-variant hover:bg-surface-container-low"
                }`}
              >
                <span className="material-symbols-outlined text-[18px] shrink-0">{icon}</span>
                <span className="text-sm font-body">{label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => {
              setMobileOpen(false);
              window.open(
                'https://ko-fi.com/knowkorea?hidefeed=true',
                'ko-fi-popup',
                'width=560,height=900,scrollbars=yes'
              );
            }}
            className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-on-surface-variant hover:bg-surface-container-low transition-all w-full"
          >
            <span
              className="material-symbols-outlined text-[18px] shrink-0"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              coffee
            </span>
            <span className="text-sm font-body">Support on Ko-fi</span>
          </button>
        </div>
      </div>
    </>
  );
}
