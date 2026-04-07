import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder"
);

// GET /api/admin/users/[id] — user detail + participation metrics
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || (session.user.role ?? 0) < 3) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = params;

  const [userRes, qaCountRes, commentCountRes, likesReadRes, badgesRes, activityRes] =
    await Promise.all([
      supabaseAdmin
        .from("users")
        .select("*")
        .eq("id", id)
        .single(),
      supabaseAdmin
        .from("qa_posts")
        .select("id", { count: "exact", head: true })
        .eq("author_id", id),
      supabaseAdmin
        .from("comments")
        .select("id", { count: "exact", head: true })
        .eq("author_id", id),
      // likes + reads combined count
      Promise.all([
        supabaseAdmin
          .from("likes")
          .select("id", { count: "exact", head: true })
          .eq("user_id", id),
        supabaseAdmin
          .from("content_reads")
          .select("id", { count: "exact", head: true })
          .eq("user_id", id),
      ]),
      supabaseAdmin.from("user_badges").select("*").eq("user_id", id),
      supabaseAdmin
        .from("activity_logs")
        .select("*")
        .eq("user_id", id)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

  if (!userRes.data) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const user = userRes.data;
  const qaCount = qaCountRes.count ?? 0;
  const commentCount = commentCountRes.count ?? 0;
  const [likesRes, readsRes] = likesReadRes;
  const likeCount = likesRes.count ?? 0;
  const readCount = readsRes.count ?? 0;

  // Participation rate formula (SPEC.md §14)
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

  // Upgrade eligibility hints
  const monthsSinceJoin = daysSinceJoin / 30;
  const upgradeHints = {
    level2: participationRate >= 60,
    level3:
      participationRate >= 70 && monthsSinceJoin >= 3,
  };

  return NextResponse.json({
    user,
    stats: { qaCount, commentCount, likeCount, readCount },
    participationRate,
    upgradeHints,
    badges: badgesRes.data ?? [],
    recentActivity: activityRes.data ?? [],
  });
}

// PATCH /api/admin/users/[id] — update role or status
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || (session.user.role ?? 0) < 3) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = params;
  const body = await req.json();
  const { role, status, is_supporter } = body;
  const callerRole = session.user.role ?? 3;

  const updates: Record<string, unknown> = {};

  if (role !== undefined) {
    if (callerRole < 4) {
      return NextResponse.json(
        { error: "Level 4 required to change role" },
        { status: 403 }
      );
    }
    if (role < 1 || role > 4) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    updates.role = role;
  }

  if (status !== undefined) {
    if (status === "banned" && callerRole < 4) {
      return NextResponse.json(
        { error: "Level 4 required to ban" },
        { status: 403 }
      );
    }
    if (!["active", "suspended", "banned"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    updates.status = status;
  }

  if (is_supporter !== undefined) {
    if (callerRole < 4) {
      return NextResponse.json(
        { error: "Level 4 required to change supporter status" },
        { status: 403 }
      );
    }
    updates.is_supporter = Boolean(is_supporter);
  }

  const { error } = await supabaseAdmin
    .from("users")
    .update(updates)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
