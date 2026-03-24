import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder"
);

// POST /api/admin/contents/reorder — bulk update sort_order for drag-and-drop
export async function POST(req: Request) {
  const session = await getSession();
  if (!session || (session.user.role ?? 0) < 4) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { items } = await req.json() as { items: { id: string; sort_order: number }[] };

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Invalid items" }, { status: 400 });
  }

  const results = await Promise.all(
    items.map((item) =>
      supabaseAdmin.from("contents").update({ sort_order: item.sort_order }).eq("id", item.id)
    )
  );

  const failed = results.find((r) => r.error);
  if (failed) {
    return NextResponse.json({ error: "Reorder failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
