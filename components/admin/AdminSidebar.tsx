"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Users", href: "/admin/users", icon: "group" },
  { label: "Content", href: "/admin/contents", icon: "article" },
  { label: "Community", href: "/admin/qa", icon: "forum" },
  { label: "Analytics", href: "/admin/analytics", icon: "bar_chart" },
];

export default function AdminSidebar({ role }: { role: number }) {
  const pathname = usePathname();

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
              {item.label}
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
