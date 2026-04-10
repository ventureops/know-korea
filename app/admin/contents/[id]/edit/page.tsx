import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ContentEditor from "@/components/admin/ContentEditor";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder"
);

export default async function EditContentPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session || (session.user.role ?? 0) < 4) redirect("/admin");

  const { data } = await supabaseAdmin
    .from("contents")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!data) notFound();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-headline text-xl font-bold text-on-surface">
          Edit Article
        </h1>
      </div>
      <ContentEditor
        mode="edit"
        initialData={{
          id: data.id,
          title: data.title,
          slug: data.slug,
          category: data.category,
          excerpt: data.excerpt ?? "",
          cover_image: data.cover_image ?? "",
          cover_caption: data.cover_caption ?? "",
          cover_alt: data.cover_alt ?? "",
          body_mdx: data.body_mdx ?? "",
          tags: data.tags ?? [],
          is_published: data.is_published,
          show_bmc: data.show_bmc,
        }}
      />
    </div>
  );
}
