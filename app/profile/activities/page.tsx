import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export const metadata = { title: "My Activity — Know Korea" };
export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder"
);

export default async function ActivitiesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const userId = session.user.id;

  const [
    { data: comments },
    { data: likes },
    { data: reads },
  ] = await Promise.all([
    supabaseAdmin
      .from("comments")
      .select("id, body, created_at, contents(title, slug, category)")
      .eq("author_id", userId)
      .is("parent_id", null)
      .order("created_at", { ascending: false })
      .limit(20),
    supabaseAdmin
      .from("likes")
      .select("id, created_at, contents(title, slug, category)")
      .eq("user_id", userId)
      .not("content_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(20),
    supabaseAdmin
      .from("content_reads")
      .select("id, created_at, contents(title, slug, category)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  type ContentRef = { title: string; slug: string; category: string } | null;

  function Section({ title, icon, items, renderItem }: {
    title: string;
    icon: string;
    items: unknown[] | null;
    renderItem: (item: any) => React.ReactNode;
  }) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[20px] text-primary">{icon}</span>
          <h2 className="font-headline font-bold text-base text-on-surface">
            {title}
            <span className="text-on-surface-variant font-body font-normal text-sm ml-2">({items?.length ?? 0})</span>
          </h2>
        </div>
        {!items || items.length === 0 ? (
          <p className="text-sm font-body text-on-surface-variant px-1">Nothing yet.</p>
        ) : (
          <div className="space-y-1">{items.map(renderItem)}</div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mr-auto px-5 md:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/profile" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-all active:scale-95">
          <span className="material-symbols-outlined text-[22px] text-on-surface-variant">arrow_back</span>
        </Link>
        <h1 className="font-headline font-extrabold text-2xl text-on-surface">My Activity</h1>
      </div>

      <Section
        title="Read Articles"
        icon="check_circle"
        items={reads}
        renderItem={(r: any) => {
          const c: ContentRef = Array.isArray(r.contents) ? r.contents[0] : r.contents;
          if (!c) return null;
          return (
            <Link
              key={r.id}
              href={`/${c.category}/${c.slug}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-success" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="text-sm font-body text-on-surface truncate flex-1">{c.title}</span>
            </Link>
          );
        }}
      />

      <Section
        title="Liked Articles"
        icon="favorite"
        items={likes}
        renderItem={(l: any) => {
          const c: ContentRef = Array.isArray(l.contents) ? l.contents[0] : l.contents;
          if (!c) return null;
          return (
            <Link
              key={l.id}
              href={`/${c.category}/${c.slug}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-error" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              <span className="text-sm font-body text-on-surface truncate flex-1">{c.title}</span>
            </Link>
          );
        }}
      />

      <Section
        title="My Comments"
        icon="chat_bubble"
        items={comments}
        renderItem={(cm: any) => {
          const c: ContentRef = Array.isArray(cm.contents) ? cm.contents[0] : cm.contents;
          return (
            <div key={cm.id} className="px-3 py-3 rounded-xl bg-surface-container-low">
              {c && (
                <Link href={`/${c.category}/${c.slug}`} className="text-xs font-body text-primary hover:underline block mb-1 truncate">
                  {c.title}
                </Link>
              )}
              <p className="text-sm font-body text-on-surface line-clamp-2">{cm.body}</p>
            </div>
          );
        }}
      />
    </div>
  );
}
