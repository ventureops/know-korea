import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import ContentsClient from "@/components/admin/ContentsClient";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder"
);

async function getContents(search: string, category: string, status: string, sortBy: string) {
  let query = supabaseAdmin
    .from("contents")
    .select(
      "id, title, slug, category, is_published, show_bmc, view_count, sort_order, created_at, updated_at",
      { count: "exact" }
    );

  if (search) query = query.ilike("title", `%${search}%`);
  if (category) query = query.eq("category", category);
  if (status === "published") query = query.eq("is_published", true);
  if (status === "draft") query = query.eq("is_published", false);

  if (sortBy === "newest") {
    query = query.order("created_at", { ascending: false });
  } else if (sortBy === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else if (sortBy === "category") {
    query = query.order("category", { ascending: true }).order("sort_order", { ascending: true });
  } else if (sortBy === "views") {
    query = query.order("view_count", { ascending: false });
  } else {
    // default: sort_order
    query = query.order("sort_order", { ascending: true });
  }

  const { data, count } = await query;
  return { contents: data ?? [], total: count ?? 0 };
}

export default async function AdminContentsPage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string; status?: string; sortBy?: string };
}) {
  const session = await getSession();
  if (!session || (session.user.role ?? 0) < 4) redirect("/admin");

  const search = searchParams.search ?? "";
  const category = searchParams.category ?? "";
  const status = searchParams.status ?? "";
  const sortBy = searchParams.sortBy ?? "sort_order";

  const { contents, total } = await getContents(search, category, status, sortBy);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl font-bold text-on-surface">
            Content Library
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            {total} articles total
          </p>
        </div>
        <Link
          href="/admin/contents/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-label hover:bg-primary-dim transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create New Post
        </Link>
      </div>

      <ContentsClient
        initialContents={contents}
        initialSearch={search}
        initialCategory={category}
        initialStatus={status}
        initialSortBy={sortBy}
      />
    </div>
  );
}
