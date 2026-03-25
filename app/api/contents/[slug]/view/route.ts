import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder"
);

export async function POST(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const { data } = await supabaseAdmin
    .from("contents")
    .select("view_count")
    .eq("slug", params.slug)
    .single();

  if (data) {
    await supabaseAdmin
      .from("contents")
      .update({ view_count: data.view_count + 1 })
      .eq("slug", params.slug);
  }

  return NextResponse.json({ ok: true });
}
