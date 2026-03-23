import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder"
);

// POST /api/admin/badges/check?user_id=xxx
// Checks badge conditions for a specific user (or all if no user_id) and grants missing badges
export async function POST(req: Request) {
  const session = await getSession();
  if (!session || (session.user.role ?? 0) < 3) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");

  const usersToCheck = userId
    ? [userId]
    : await supabaseAdmin
        .from("users")
        .select("id")
        .then((r) => (r.data ?? []).map((u) => u.id));

  const ids = Array.isArray(usersToCheck) ? usersToCheck : [];
  const granted: string[] = [];

  // Get total published content count for Active Reader badge
  const { count: totalPublished } = await supabaseAdmin
    .from("contents")
    .select("id", { count: "exact", head: true })
    .eq("is_published", true);

  const LAUNCH_DATE = new Date("2026-01-01"); // site launch date

  for (const uid of ids) {
    const [userRes, helpfulRes, qaRes, readsRes, existingBadgesRes] = await Promise.all([
      supabaseAdmin.from("users").select("created_at").eq("id", uid).single(),
      // Top Helper: is_helpful comments >= 10
      supabaseAdmin
        .from("comments")
        .select("id", { count: "exact", head: true })
        .eq("author_id", uid)
        .eq("is_helpful", true),
      // Content Creator: qa_posts >= 20
      supabaseAdmin
        .from("qa_posts")
        .select("id, likes:likes(count)")
        .eq("author_id", uid),
      // Active Reader: reads >= 50% of published
      supabaseAdmin
        .from("content_reads")
        .select("id", { count: "exact", head: true })
        .eq("user_id", uid),
      supabaseAdmin.from("user_badges").select("badge_type").eq("user_id", uid),
    ]);

    const existing = new Set((existingBadgesRes.data ?? []).map((b) => b.badge_type));
    const badgesToGrant: string[] = [];

    // Top Helper
    if (!existing.has("top_helper") && (helpfulRes.count ?? 0) >= 10) {
      badgesToGrant.push("top_helper");
    }

    // Content Creator: 20+ Q&A posts with avg likes >= 5
    if (!existing.has("content_creator")) {
      const qaPosts = qaRes.data ?? [];
      if (qaPosts.length >= 20) {
        // Check avg likes — simplified: check total likes / count
        const { count: totalQaLikes } = await supabaseAdmin
          .from("likes")
          .select("id", { count: "exact", head: true })
          .eq("user_id", uid);
        const avgLikes = qaPosts.length > 0 ? (totalQaLikes ?? 0) / qaPosts.length : 0;
        if (avgLikes >= 5) badgesToGrant.push("content_creator");
      }
    }

    // Early Adopter: joined within 3 months of launch
    if (!existing.has("early_adopter") && userRes.data) {
      const joinedAt = new Date(userRes.data.created_at);
      const threeMonthsAfterLaunch = new Date(LAUNCH_DATE);
      threeMonthsAfterLaunch.setMonth(threeMonthsAfterLaunch.getMonth() + 3);
      if (joinedAt <= threeMonthsAfterLaunch) {
        badgesToGrant.push("early_adopter");
      }
    }

    // Active Reader: read >= 50% of published content
    if (!existing.has("active_reader") && (totalPublished ?? 0) > 0) {
      const readCount = readsRes.count ?? 0;
      if (readCount / (totalPublished ?? 1) >= 0.5) {
        badgesToGrant.push("active_reader");
      }
    }

    if (badgesToGrant.length > 0) {
      await supabaseAdmin.from("user_badges").upsert(
        badgesToGrant.map((badge_type) => ({ user_id: uid, badge_type })),
        { onConflict: "user_id,badge_type", ignoreDuplicates: true }
      );
      granted.push(...badgesToGrant.map((b) => `${uid}:${b}`));
    }
  }

  return NextResponse.json({ granted, count: granted.length });
}
