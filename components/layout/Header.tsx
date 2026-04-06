"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { cloudinaryUrl } from "@/lib/cloudinary";

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 h-12 bg-surface/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto h-full px-5 md:px-8 flex items-center justify-between">
      {/* 모바일 전용: 햄버거 */}
      <button
        aria-label="Open menu"
        onClick={onMenuToggle}
        className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low transition-all active:scale-95"
      >
        <span className="material-symbols-outlined text-[22px]">menu</span>
      </button>

      {/* 데스크탑: 빈 공간 */}
      <div className="hidden md:block" />

      {/* 우측: 검색 + 프로필 */}
      <div className="flex items-center gap-1">
        <Link
          href="/search"
          aria-label="Search"
          className="w-9 h-9 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
        </Link>

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
                <img
                  src={cloudinaryUrl(session.user.image, "avatar")}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
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
                  onClick={() => {
                    setDropdownOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
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
      </div>
      </div>
    </header>
  );
}
