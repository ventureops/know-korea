import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder"
);

// GET /api/admin/contents/[id]
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || (session.user.role ?? 0) < 4) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from("contents")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ content: data });
}

// PATCH /api/admin/contents/[id] — update content fields
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || (session.user.role ?? 0) < 4) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { title, slug, category, excerpt, cover_image, cover_caption, cover_alt, body_mdx, tags, is_published, show_bmc, sort_order } = body;

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (title !== undefined) updates.title = title;
  if (slug !== undefined) updates.slug = slug;
  if (category !== undefined) updates.category = category;
  if (excerpt !== undefined) updates.excerpt = excerpt;
  if (cover_image !== undefined) updates.cover_image = cover_image;
  if (cover_caption !== undefined) updates.cover_caption = cover_caption;
  if (cover_alt !== undefined) updates.cover_alt = cover_alt;
  if (body_mdx !== undefined) updates.body_mdx = body_mdx;
  if (tags !== undefined) updates.tags = tags;
  if (is_published !== undefined) updates.is_published = is_published;
  if (show_bmc !== undefined) updates.show_bmc = show_bmc;
  if (sort_order !== undefined) updates.sort_order = sort_order;

  const { error } = await supabaseAdmin
    .from("contents")
    .update(updates)
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/");
  if (category) revalidatePath(`/${category}`);
  if (category && slug) revalidatePath(`/${category}/${slug}`);

  return NextResponse.json({ ok: true });
}

// DELETE /api/admin/contents/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || (session.user.role ?? 0) < 4) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // fetch category/slug before deleting to revalidate correct paths
  const { data: existing } = await supabaseAdmin
    .from("contents")
    .select("category, slug")
    .eq("id", params.id)
    .single();

  const { error } = await supabaseAdmin
    .from("contents")
    .delete()
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/");
  if (existing?.category) revalidatePath(`/${existing.category}`);
  if (existing?.category && existing?.slug) revalidatePath(`/${existing.category}/${existing.slug}`);

  return NextResponse.json({ ok: true });
}
