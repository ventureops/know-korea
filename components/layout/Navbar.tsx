"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/qa", label: "Q&A" },
  { href: "/about", label: "About" },
];

const mobileMenuLinks = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/qa", label: "Q&A", icon: "forum" },
  { href: "/about", label: "About", icon: "info" },
  { href: "/faq", label: "FAQ", icon: "help" },
  { href: "/search", label: "Search", icon: "search" },
  { href: "/login", label: "Login / Sign up", icon: "person" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

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
        <Link href="/" className="flex items-center gap-1.5 shrink-0" onClick={() => setMobileOpen(false)}>
          <span className="font-headline font-extrabold text-sm tracking-widest text-brand-navy uppercase">
            Know<span className="text-tertiary">Korea</span>
          </span>
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

        {/* Profile / Login */}
        <Link
          href="/login"
          className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all active:scale-95"
          aria-label="Profile"
        >
          <span className="material-symbols-outlined text-[20px]">person</span>
        </Link>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-14 left-0 z-40 w-72 h-[calc(100vh-3.5rem)] bg-surface/95 backdrop-blur-xl md:hidden flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-4 pt-5 pb-6 flex flex-col gap-0.5 overflow-y-auto">
          <p className="text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-3">
            Menu
          </p>
          {mobileMenuLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-surface-container-low text-on-surface font-bold"
                    : "text-on-surface-variant hover:bg-surface-container-lowest hover:text-on-surface"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full" />
                )}
                <span
                  className={`material-symbols-outlined text-[18px] shrink-0 ${isActive ? "text-primary" : "text-on-surface-variant"}`}
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {link.icon}
                </span>
                <span className="text-sm font-body">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
