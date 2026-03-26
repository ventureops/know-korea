import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder"
);

// GET /api/admin/contents?page=1&search=
export async function GET(req: Request) {
  const session = await getSession();
  if (!session || (session.user.role ?? 0) < 4) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const pageSize = 20;

  let query = supabaseAdmin
    .from("contents")
    .select("id, title, slug, category, is_published, show_bmc, view_count, created_at, updated_at", {
      count: "exact",
    });

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  const from = (page - 1) * pageSize;
  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ contents: data, total: count ?? 0, page, pageSize });
}

// POST /api/admin/contents — create new content
export async function POST(req: Request) {
  const session = await getSession();
  if (!session || (session.user.role ?? 0) < 4) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { title, slug, category, excerpt, cover_image, body_mdx, tags } = body;

  if (!title || !slug || !category) {
    return NextResponse.json(
      { error: "title, slug, category required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("contents")
    .insert({
      title,
      slug,
      category,
      excerpt: excerpt ?? null,
      cover_image: cover_image ?? null,
      body_mdx: body_mdx ?? null,
      tags: tags ?? [],
      is_published: false,
      show_bmc: false,
      author_id: session.user.id,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/");
  revalidatePath(`/${category}`);

  return NextResponse.json({ content: data });
}
