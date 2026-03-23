import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder"
);

export async function GET() {
  const session = await getSession();
  if (!session || (session.user.role ?? 0) < 3) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Top 10 contents by view_count
  const topContentsRes = await supabaseAdmin
    .from("contents")
    .select("id, title, category, view_count")
    .eq("is_published", true)
    .order("view_count", { ascending: false })
    .limit(10);

  // Recent 50 activity logs
  const logsRes = await supabaseAdmin
    .from("activity_logs")
    .select("id, action, target_type, target_id, created_at, user_id")
    .order("created_at", { ascending: false })
    .limit(50);

  // Login activity: group by day (last 14 days)
  const fourteenDaysAgo = new Date(
    Date.now() - 14 * 24 * 60 * 60 * 1000
  ).toISOString();
  const loginLogsRes = await supabaseAdmin
    .from("activity_logs")
    .select("created_at")
    .eq("action", "login")
    .gte("created_at", fourteenDaysAgo);

  // Group logins by day
  const loginByDay: Record<string, number> = {};
  for (const log of loginLogsRes.data ?? []) {
    const day = log.created_at.slice(0, 10);
    loginByDay[day] = (loginByDay[day] ?? 0) + 1;
  }
  const loginTrend = Object.entries(loginByDay)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Likes summary
  const contentLikesRes = await supabaseAdmin
    .from("likes")
    .select("content_id", { count: "exact" });

  const qaLikesRes = await supabaseAdmin
    .from("likes")
    .select("qa_post_id", { count: "exact" });

  return NextResponse.json({
    topContents: topContentsRes.data ?? [],
    recentLogs: logsRes.data ?? [],
    loginTrend,
    totalContentLikes: contentLikesRes.count ?? 0,
    totalQaLikes: qaLikesRes.count ?? 0,
  });
}
