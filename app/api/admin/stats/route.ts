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

  const [usersRes, viewsRes, qaRes] = await Promise.all([
    supabaseAdmin.from("users").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("contents").select("view_count").eq("is_published", true),
    supabaseAdmin
      .from("qa_posts")
      .select("id", { count: "exact", head: true })
      .eq("is_resolved", false),
  ]);

  const totalUsers = usersRes.count ?? 0;
  const monthlyViews = (viewsRes.data ?? []).reduce(
    (sum, c) => sum + (c.view_count ?? 0),
    0
  );
  const activeQA = qaRes.count ?? 0;

  // Category view breakdown
  const categoryViewsRes = await supabaseAdmin
    .from("contents")
    .select("category, view_count")
    .eq("is_published", true);

  const categoryMap: Record<string, number> = {};
  let totalCatViews = 0;
  for (const row of categoryViewsRes.data ?? []) {
    categoryMap[row.category] = (categoryMap[row.category] ?? 0) + (row.view_count ?? 0);
    totalCatViews += row.view_count ?? 0;
  }
  const categoryViews = Object.entries(categoryMap)
    .map(([category, views]) => ({
      category,
      views,
      pct: totalCatViews > 0 ? Math.round((views / totalCatViews) * 100) : 0,
    }))
    .sort((a, b) => b.views - a.views);

  // Recent community members
  const recentUsersRes = await supabaseAdmin
    .from("users")
    .select("id, nickname, email, role, status, last_login_at, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return NextResponse.json({
    totalUsers,
    monthlyViews,
    activeQA,
    bmcTotal: 145, // placeholder (no real BMC API)
    categoryViews,
    recentUsers: recentUsersRes.data ?? [],
  });
}
