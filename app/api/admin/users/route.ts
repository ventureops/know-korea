import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder"
);

// GET /api/admin/users?search=&dormant=true&page=1
export async function GET(req: Request) {
  const session = await getSession();
  if (!session || (session.user.role ?? 0) < 3) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const dormant = searchParams.get("dormant") === "true";
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const pageSize = 20;

  let query = supabaseAdmin
    .from("users")
    .select("id, nickname, email, role, status, last_login_at, created_at", {
      count: "exact",
    });

  if (search) {
    query = query.or(`nickname.ilike.%${search}%,email.ilike.%${search}%`);
  }

  if (dormant) {
    const thirtyDaysAgo = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    ).toISOString();
    query = query.lt("last_login_at", thirtyDaysAgo);
  }

  const from = (page - 1) * pageSize;
  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ users: data, total: count ?? 0, page, pageSize });
}
