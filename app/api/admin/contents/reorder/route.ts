import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder"
);

// POST /api/admin/contents/reorder — swap sort_order of two contents
export async function POST(req: Request) {
  const session = await getSession();
  if (!session || (session.user.role ?? 0) < 4) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id_a, sort_order_a, id_b, sort_order_b } = await req.json();

  const [resA, resB] = await Promise.all([
    supabaseAdmin.from("contents").update({ sort_order: sort_order_b }).eq("id", id_a),
    supabaseAdmin.from("contents").update({ sort_order: sort_order_a }).eq("id", id_b),
  ]);

  if (resA.error || resB.error) {
    return NextResponse.json({ error: "Reorder failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
