import { getSession } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/categories";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder"
);

const ROLE_LABELS = ["", "Subscriber", "Contributor", "Moderator", "Admin"];
const ROLE_COLORS = [
  "",
  "bg-surface-container text-on-surface-variant",
  "bg-primary-container text-on-primary-container",
  "bg-tertiary-container/60 text-on-tertiary-container",
  "bg-primary text-on-primary",
];

async function getDashboardData() {
  const [usersRes, contentsRes, qaRes, recentUsersRes, contactUnreadRes] = await Promise.all([
    supabaseAdmin.from("users").select("id", { count: "exact", head: true }),
    supabaseAdmin
      .from("contents")
      .select("view_count, category")
      .eq("is_published", true),
    supabaseAdmin
      .from("qa_posts")
      .select("id", { count: "exact", head: true })
      .eq("is_resolved", false),
    supabaseAdmin
      .from("users")
      .select("id, nickname, email, role, status, last_login_at, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabaseAdmin
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false)
      .eq("is_archived", false),
  ]);

  const totalUsers = usersRes.count ?? 0;
  const activeQA = qaRes.count ?? 0;
  const unreadContact = contactUnreadRes.count ?? 0;
  const contents = contentsRes.data ?? [];
  const monthlyViews = contents.reduce((s, c) => s + (c.view_count ?? 0), 0);

  // Category breakdown
  const catMap: Record<string, number> = {};
  let totalViews = 0;
  for (const c of contents) {
    catMap[c.category] = (catMap[c.category] ?? 0) + (c.view_count ?? 0);
    totalViews += c.view_count ?? 0;
  }
  const categoryViews = Object.entries(catMap)
    .map(([cat, views]) => ({
      cat,
      label: CATEGORY_LABELS[cat] ?? cat,
      views,
      pct: totalViews > 0 ? Math.round((views / totalViews) * 100) : 0,
    }))
    .sort((a, b) => b.views - a.views);

  return {
    totalUsers,
    monthlyViews,
    activeQA,
    unreadContact,
    categoryViews,
    recentUsers: recentUsersRes.data ?? [],
  };
}

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString();
}

export default async function AdminDashboardPage() {
  await getSession(); // layout already guards, just ensure server context
  const { totalUsers, monthlyViews, activeQA, unreadContact, categoryViews, recentUsers } =
    await getDashboardData();

  const stats = [
    {
      label: "Total Users",
      value: fmt(totalUsers),
      icon: "group",
      color: "text-primary",
      bg: "bg-primary-container/30",
    },
    {
      label: "Monthly Page Views",
      value: fmt(monthlyViews),
      icon: "visibility",
      color: "text-success",
      bg: "bg-success-container/40",
    },
    {
      label: "Active Community Posts",
      value: fmt(activeQA),
      icon: "chat_bubble",
      color: "text-tertiary",
      bg: "bg-tertiary-container/30",
    },
    {
      label: "Ko-fi Support Total",
      value: "₩1.45M",
      icon: "favorite",
      color: "text-tertiary",
      bg: "bg-tertiary-container/20",
    },
    {
      label: "Unread Contact",
      value: fmt(unreadContact),
      icon: "mail",
      color: "text-error",
      bg: "bg-error-container/30",
      href: "/admin/contact",
    },
  ];

  return (
    <div className="max-w-6xl mr-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-label text-on-surface-variant uppercase tracking-wider">
          Overview
        </p>
        <h1 className="font-headline text-2xl font-bold text-on-surface mt-1">
          Platform Pulse
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {stats.map((s) => {
          const card = (
            <div
              className={`bg-surface-container-lowest rounded-xl p-5 shadow-sm ${"href" in s ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
            >
            <div className="flex items-center justify-between mb-3">
              <span
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.bg}`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${s.color}`}
                >
                  {s.icon}
                </span>
              </span>
            </div>
            <p className="text-xs text-on-surface-variant font-label">{s.label}</p>
            <p className="font-headline text-xl font-bold text-on-surface mt-0.5">
              {s.value}
            </p>
          </div>
          );
          return "href" in s ? (
            <Link key={s.label} href={(s as { href: string }).href}>{card}</Link>
          ) : (
            <div key={s.label}>{card}</div>
          );
        })}
      </div>

      {/* Views by Category + Global Toggles */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Category views */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline font-semibold text-on-surface">
              Views by Category
            </h2>
            <span className="text-xs text-on-surface-variant bg-success-container/40 text-success px-2 py-0.5 rounded-full font-label">
              Total Engagement: 100%
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {categoryViews.slice(0, 12).map((c) => (
              <div key={c.cat}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-on-surface-variant font-label truncate">
                    {c.label}
                  </span>
                  <span className="text-xs font-semibold text-on-surface ml-2">
                    {c.pct}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-container">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${c.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Toggles */}
        <div className="bg-primary text-on-primary rounded-xl p-5 shadow-sm">
          <h2 className="font-headline font-semibold mb-4">Global Toggles</h2>
          <p className="text-xs text-on-primary/60 mb-4">
            Changes affect all platform users immediately.
          </p>
          <div className="space-y-4">
            {[
              { label: "Ko-fi Support Section", key: "bmc" },
              { label: "Maintenance Mode", key: "maintenance" },
              { label: "Public Registrations", key: "registrations" },
            ].map((t) => (
              <div key={t.key} className="flex items-center justify-between">
                <span className="text-sm text-on-primary/80">{t.label}</span>
                <div className="w-10 h-5 bg-on-primary/20 rounded-full flex items-center px-0.5">
                  <div className="w-4 h-4 bg-on-primary/60 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Community Members */}
      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline font-semibold text-on-surface">
            Recent Community Members
          </h2>
          <Link
            href="/admin/users"
            className="text-xs text-primary font-label hover:underline"
          >
            View All Users
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/15">
                <th className="text-left py-2 px-3 text-xs text-on-surface-variant font-label font-semibold">
                  NICKNAME
                </th>
                <th className="text-left py-2 px-3 text-xs text-on-surface-variant font-label font-semibold">
                  EMAIL
                </th>
                <th className="text-left py-2 px-3 text-xs text-on-surface-variant font-label font-semibold">
                  ROLE
                </th>
                <th className="text-left py-2 px-3 text-xs text-on-surface-variant font-label font-semibold">
                  LAST LOGIN
                </th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-surface-container/40 transition-colors"
                >
                  <td className="py-2.5 px-3">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-primary-container flex items-center justify-center text-xs font-bold text-on-primary-container shrink-0">
                        {(u.nickname ?? "?")[0].toUpperCase()}
                      </div>
                      <span className="font-label text-on-surface text-sm">
                        {u.nickname ?? "—"}
                      </span>
                    </Link>
                  </td>
                  <td className="py-2.5 px-3 text-on-surface-variant text-xs">
                    {u.email}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-label ${ROLE_COLORS[u.role] ?? ""}`}
                    >
                      {ROLE_LABELS[u.role] ?? `Level ${u.role}`}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-on-surface-variant text-xs">
                    {u.last_login_at
                      ? new Date(u.last_login_at).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentUsers.length === 0 && (
            <p className="text-center text-on-surface-variant py-8 text-sm">
              No users yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
