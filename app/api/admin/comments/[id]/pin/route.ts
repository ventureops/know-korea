import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder"
);

// POST /api/admin/comments/[id]/pin — toggle is_pinned (Level 4 only)
export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || (session.user.role ?? 0) < 4) {
    return NextResponse.json({ error: "Level 4 required" }, { status: 403 });
  }

  const { data: comment } = await supabaseAdmin
    .from("comments")
    .select("is_pinned")
    .eq("id", params.id)
    .single();

  if (!comment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { error } = await supabaseAdmin
    .from("comments")
    .update({ is_pinned: !comment.is_pinned })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ is_pinned: !comment.is_pinned });
}
