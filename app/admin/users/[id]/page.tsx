import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import UserDetailClient from "@/components/admin/UserDetailClient";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder"
);

const BADGE_META: Record<string, { icon: string; label: string; color: string }> = {
  top_helper: { icon: "emoji_events", label: "Top Helper", color: "text-yellow-600" },
  content_creator: { icon: "edit_note", label: "Content Creator", color: "text-primary" },
  early_adopter: { icon: "rocket_launch", label: "Early Adopter", color: "text-tertiary" },
  active_reader: { icon: "menu_book", label: "Active Reader", color: "text-success" },
};

async function getUserDetail(id: string) {
  const [userRes, qaCountRes, commentCountRes, likesRes, readsRes, badgesRes, activityRes] =
    await Promise.all([
      supabaseAdmin.from("users").select("*").eq("id", id).single(),
      supabaseAdmin
        .from("qa_posts")
        .select("id", { count: "exact", head: true })
        .eq("author_id", id),
      supabaseAdmin
        .from("comments")
        .select("id", { count: "exact", head: true })
        .eq("author_id", id),
      supabaseAdmin
        .from("likes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", id),
      supabaseAdmin
        .from("content_reads")
        .select("id", { count: "exact", head: true })
        .eq("user_id", id),
      supabaseAdmin.from("user_badges").select("*").eq("user_id", id),
      supabaseAdmin
        .from("activity_logs")
        .select("*")
        .eq("user_id", id)
        .order("created_at", { ascending: false })
        .limit(15),
    ]);

  if (!userRes.data) return null;

  const user = userRes.data;
  const qaCount = qaCountRes.count ?? 0;
  const commentCount = commentCountRes.count ?? 0;
  const likeCount = likesRes.count ?? 0;
  const readCount = readsRes.count ?? 0;

  const createdAt = new Date(user.created_at);
  const daysSinceJoin = Math.max(
    1,
    Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
  );
  const A = qaCount * 5;
  const B = commentCount * 2;
  const C = likeCount + readCount;
  const D = Math.max(10, daysSinceJoin * 0.5);
  const participationRate = Math.min(100, Math.round(((A + B + C) / D) * 100));
  const monthsSinceJoin = daysSinceJoin / 30;

  return {
    user,
    stats: { qaCount, commentCount, likeCount, readCount },
    participationRate,
    upgradeHints: {
      level2: participationRate >= 60,
      level3: participationRate >= 70 && monthsSinceJoin >= 3,
    },
    badges: badgesRes.data ?? [],
    recentActivity: activityRes.data ?? [],
  };
}

const ROLE_LABELS = ["", "Subscriber", "Contributor", "Moderator", "Admin"];

export default async function AdminUserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  const callerRole = session?.user?.role ?? 0;

  const detail = await getUserDetail(params.id);
  if (!detail) notFound();

  const { user, stats, participationRate, upgradeHints, badges, recentActivity } = detail;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-4">
        <Link href="/admin/users" className="hover:text-primary transition-colors">
          Members
        </Link>
        <span>/</span>
        <span>Member Detail</span>
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline text-2xl font-bold text-on-surface">
          {user.nickname ?? user.email}
        </h1>
        <div className="flex items-center gap-2">
          <Link
            href={`/profile`}
            className="px-4 py-2 rounded-lg bg-surface-container text-on-surface text-sm font-label hover:bg-surface-container-high transition-colors"
          >
            View Public Profile
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Posts", value: stats.qaCount, icon: "article" },
          { label: "Total Comments", value: stats.commentCount, icon: "chat" },
          { label: "Content Reads", value: stats.readCount, icon: "menu_book" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-surface-container-lowest rounded-xl p-4 shadow-sm text-center"
          >
            <p className="font-headline text-2xl font-bold text-on-surface">
              {s.value}
            </p>
            <p className="text-xs text-on-surface-variant font-label mt-1 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[14px]">{s.icon}</span>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Profile + Account Management */}
        <div className="space-y-4">
          {/* Profile Card */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
            <div className="flex flex-col items-center text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-xl font-bold text-on-primary-container mb-3">
                {(user.nickname ?? user.email)[0].toUpperCase()}
              </div>
              <p className="font-headline font-semibold text-on-surface">
                {user.nickname ?? "—"}
              </p>
              <p className="text-xs text-on-surface-variant mt-0.5">{user.email}</p>
            </div>
            <div className="space-y-1.5 text-xs text-on-surface-variant">
              <div className="flex items-center justify-between">
                <span>JOIN DATE</span>
                <span className="text-on-surface">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>LAST LOGIN</span>
                <span className="text-on-surface">
                  {user.last_login_at
                    ? new Date(user.last_login_at).toLocaleDateString()
                    : "Never"}
                </span>
              </div>
            </div>
          </div>

          {/* Account Management */}
          <UserDetailClient
            userId={user.id}
            currentRole={user.role}
            currentStatus={user.status}
            callerRole={callerRole}
          />

          {/* Engagement Metrics */}
          <div className="bg-primary text-on-primary rounded-xl p-5 shadow-sm">
            <p className="text-xs font-label font-semibold uppercase tracking-wider text-on-primary/60 mb-3">
              Engagement Metrics
            </p>
            <p className="font-headline text-3xl font-bold mb-1">
              {participationRate}%
            </p>
            <p className="text-xs text-on-primary/60 mb-3">Participation Rate</p>
            <div className="h-2 rounded-full bg-on-primary/20 mb-4">
              <div
                className="h-full rounded-full bg-on-primary transition-all"
                style={{ width: `${participationRate}%` }}
              />
            </div>
            {/* Upgrade Hints */}
            <div className="space-y-1.5 mb-4">
              {upgradeHints.level2 && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="material-symbols-outlined text-[14px] text-on-primary">
                    check_circle
                  </span>
                  <span>Level 2 eligible (60%+)</span>
                </div>
              )}
              {upgradeHints.level3 && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="material-symbols-outlined text-[14px] text-on-primary">
                    check_circle
                  </span>
                  <span>Level 3 eligible (70%+ · 3mo+)</span>
                </div>
              )}
            </div>
            {/* Badges */}
            <p className="text-xs text-on-primary/60 mb-2">BADGES EARNED</p>
            {badges.length === 0 ? (
              <p className="text-xs text-on-primary/50">No badges yet</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {badges.map((b) => {
                  const meta = BADGE_META[b.badge_type];
                  return (
                    <div
                      key={b.badge_type}
                      className="flex items-center gap-1.5 bg-on-primary/10 rounded-lg px-2.5 py-1.5"
                      title={meta?.label}
                    >
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {meta?.icon ?? "star"}
                      </span>
                      <span className="text-xs">{meta?.label ?? b.badge_type}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Recent Activity */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-5 shadow-sm">
          <h2 className="font-headline font-semibold text-on-surface mb-4">
            Recent Activity Feed
          </h2>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-on-surface-variant py-8 text-center">
              No activity recorded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-surface-container/50"
                >
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant mt-0.5">
                    {log.action === "login"
                      ? "login"
                      : log.action === "post_qa"
                      ? "help"
                      : log.action === "post_comment"
                      ? "comment"
                      : log.action === "view_content"
                      ? "visibility"
                      : "bolt"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-on-surface font-label capitalize">
                      {log.action.replace(/_/g, " ")}
                    </p>
                    {log.target_type && (
                      <p className="text-xs text-on-surface-variant">
                        {log.target_type} · {log.target_id?.slice(0, 8)}…
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-on-surface-variant shrink-0">
                    {new Date(log.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
