import { getSession } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder"
);

async function getAnalyticsData() {
  const fourteenDaysAgo = new Date(
    Date.now() - 14 * 24 * 60 * 60 * 1000
  ).toISOString();

  const [topContentsRes, logsRes, loginLogsRes, contentLikesRes, qaLikesRes] =
    await Promise.all([
      supabaseAdmin
        .from("contents")
        .select("id, title, category, view_count")
        .eq("is_published", true)
        .order("view_count", { ascending: false })
        .limit(10),
      supabaseAdmin
        .from("activity_logs")
        .select("id, action, target_type, created_at")
        .order("created_at", { ascending: false })
        .limit(30),
      supabaseAdmin
        .from("activity_logs")
        .select("created_at")
        .eq("action", "login")
        .gte("created_at", fourteenDaysAgo),
      supabaseAdmin
        .from("likes")
        .select("id", { count: "exact", head: true })
        .not("content_id", "is", null),
      supabaseAdmin
        .from("likes")
        .select("id", { count: "exact", head: true })
        .not("qa_post_id", "is", null),
    ]);

  // Group logins by day
  const loginByDay: Record<string, number> = {};
  for (const log of loginLogsRes.data ?? []) {
    const day = log.created_at.slice(0, 10);
    loginByDay[day] = (loginByDay[day] ?? 0) + 1;
  }
  const loginTrend = Object.entries(loginByDay)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const maxLogins = Math.max(...loginTrend.map((d) => d.count), 1);

  return {
    topContents: topContentsRes.data ?? [],
    recentLogs: logsRes.data ?? [],
    loginTrend,
    maxLogins,
    totalContentLikes: contentLikesRes.count ?? 0,
    totalQaLikes: qaLikesRes.count ?? 0,
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  "start-here": "Start Here",
  language: "Language",
  "life-in-korea": "Life in Korea",
  "work-business": "Work & Business",
  "practical-guide": "Practical Guide",
  "culture-society": "Culture & Society",
  "travel-places": "Travel & Places",
  "history-politics": "History & Politics",
  "economy-money": "Economy & Money",
  comparison: "Comparison",
  "real-stories": "Real Stories",
  "tools-resources": "Tools & Resources",
};

const ACTION_ICONS: Record<string, string> = {
  login: "login",
  view_content: "visibility",
  post_qa: "help",
  post_comment: "comment",
  like: "favorite",
  read: "menu_book",
};

export default async function AdminAnalyticsPage() {
  await getSession();
  const { topContents, recentLogs, loginTrend, maxLogins, totalContentLikes, totalQaLikes } =
    await getAnalyticsData();

  const maxViews = Math.max(...topContents.map((c) => c.view_count), 1);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-headline text-2xl font-bold text-on-surface">
          Analytics
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Platform engagement overview
        </p>
      </div>

      {/* Likes Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-[22px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
              favorite
            </span>
            <span className="text-xs text-on-surface-variant font-label">Content Likes</span>
          </div>
          <p className="font-headline text-2xl font-bold text-on-surface">
            {totalContentLikes.toLocaleString()}
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-[22px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              thumb_up
            </span>
            <span className="text-xs text-on-surface-variant font-label">Q&A Likes</span>
          </div>
          <p className="font-headline text-2xl font-bold text-on-surface">
            {totalQaLikes.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Login Trend */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
          <h2 className="font-headline font-semibold text-on-surface mb-4">
            Login Trend (Last 14 Days)
          </h2>
          {loginTrend.length === 0 ? (
            <p className="text-sm text-on-surface-variant py-4 text-center">
              No login data available.
            </p>
          ) : (
            <div className="flex items-end gap-1.5 h-32">
              {loginTrend.map((d) => (
                <div key={d.date} className="flex flex-col items-center flex-1 gap-1">
                  <div
                    className="w-full rounded-t bg-primary/70 transition-all"
                    style={{ height: `${(d.count / maxLogins) * 100}%`, minHeight: "4px" }}
                    title={`${d.date}: ${d.count} logins`}
                  />
                  <span className="text-[9px] text-on-surface-variant rotate-45 origin-left">
                    {d.date.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity Log */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
          <h2 className="font-headline font-semibold text-on-surface mb-4">
            Recent Activity
          </h2>
          <div className="space-y-2 overflow-y-auto max-h-52">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                  {ACTION_ICONS[log.action] ?? "bolt"}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-on-surface font-label capitalize">
                    {log.action.replace(/_/g, " ")}
                  </span>
                  {log.target_type && (
                    <span className="text-xs text-on-surface-variant ml-1">
                      · {log.target_type}
                    </span>
                  )}
                </div>
                <span className="text-xs text-on-surface-variant shrink-0">
                  {new Date(log.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
            {recentLogs.length === 0 && (
              <p className="text-sm text-on-surface-variant text-center py-4">
                No activity yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Top Content by Views */}
      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
        <h2 className="font-headline font-semibold text-on-surface mb-4">
          Top 10 Articles by Views
        </h2>
        <div className="space-y-3">
          {topContents.map((c, i) => (
            <div key={c.id} className="flex items-center gap-3">
              <span className="text-xs text-on-surface-variant w-4 shrink-0 text-right font-mono">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-on-surface font-label truncate">{c.title}</p>
                <p className="text-xs text-on-surface-variant">
                  {CATEGORY_LABELS[c.category] ?? c.category}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-24 h-1.5 rounded-full bg-surface-container">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(c.view_count / maxViews) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-on-surface-variant w-12 text-right">
                  {c.view_count.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
          {topContents.length === 0 && (
            <p className="text-sm text-on-surface-variant text-center py-4">
              No published content yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
