import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ReadingActivityClient from "./ReadingActivityClient";

export const metadata = { title: "Reading Activity" };
export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder"
);

export default async function ReadingActivityPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const userId = session.user.id;

  const [
    { data: reads, count: readTotal },
    { data: saves, count: saveTotal },
    { data: likes, count: likeTotal },
    { data: comments, count: commentTotal },
  ] = await Promise.all([
    supabaseAdmin
      .from("content_reads")
      .select("id, created_at, contents(title, slug, category)", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(0, 9),
    supabaseAdmin
      .from("content_saves")
      .select("id, created_at, content_id, contents(title, slug, category)", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(0, 9),
    supabaseAdmin
      .from("likes")
      .select("id, created_at, contents(title, slug, category)", { count: "exact" })
      .eq("user_id", userId)
      .not("content_id", "is", null)
      .order("created_at", { ascending: false })
      .range(0, 9),
    supabaseAdmin
      .from("comments")
      .select("id, body, created_at, contents(title, slug, category)", { count: "exact" })
      .eq("author_id", userId)
      .is("parent_id", null)
      .order("created_at", { ascending: false })
      .range(0, 9),
  ]);

  return (
    <ReadingActivityClient
      initialReads={reads ?? []}
      readTotal={readTotal ?? 0}
      initialSaves={saves ?? []}
      saveTotal={saveTotal ?? 0}
      initialLikes={likes ?? []}
      likeTotal={likeTotal ?? 0}
      initialComments={comments ?? []}
      commentTotal={commentTotal ?? 0}
    />
  );
}
