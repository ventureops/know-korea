import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder"
);

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.user.role ?? 0) < 4) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const archived = searchParams.get("archived") ?? "false";
  const search = searchParams.get("search");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20"));
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from("contact_submissions")
    .select("*", { count: "exact" })
    .eq("is_archived", archived === "true");

  if (category) query = query.eq("category", category);

  if (status === "unread") query = query.eq("is_read", false);
  else if (status === "read") query = query.eq("is_read", true).eq("is_replied", false);
  else if (status === "replied") query = query.eq("is_replied", true);

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,message.ilike.%${search}%`
    );
  }

  query = query
    .order("is_read", { ascending: true })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [], total: count ?? 0 });
}
