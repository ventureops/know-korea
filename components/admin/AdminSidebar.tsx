"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Content", href: "/admin/contents", icon: "article" },
  { label: "Contact", href: "/admin/contact", icon: "mail", badge: true },
  { label: "Users", href: "/admin/users", icon: "group" },
  { label: "Community", href: "/admin/qa", icon: "forum" },
  { label: "Analytics", href: "/admin/analytics", icon: "bar_chart" },
];

export default function AdminSidebar({ role }: { role: number }) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (role < 4) return;
    fetch("/api/admin/contact/unread-count")
      .then((r) => r.json())
      .then((d) => setUnreadCount(d.count ?? 0))
      .catch(() => {});
  }, [role]);

  return (
    <aside className="w-56 bg-surface-container-low flex flex-col shrink-0 min-h-screen sticky top-0">
      {/* Brand */}
      <div className="p-5 pb-4">
        <p className="font-headline font-bold text-xs tracking-wider text-on-surface-variant uppercase">
          AdminPanel
        </p>
        <p className="text-xs text-on-surface-variant/60 mt-0.5">Management Suite</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const showBadge = item.badge && unreadCount > 0 && role >= 4;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-label transition-colors ${
                isActive
                  ? "bg-primary text-on-primary font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[18px] ${isActive ? "filled" : ""}`}
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {showBadge && (
                <span className="bg-error text-on-error text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-none">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 flex flex-col gap-0.5">
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">settings</span>
          Settings
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-tertiary hover:bg-tertiary-container/20 transition-colors w-full text-left"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
