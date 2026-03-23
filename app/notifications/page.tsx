import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export const metadata = { title: "Notifications — Know Korea" };
export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder"
);

const actionLabel: Record<string, { icon: string; text: string }> = {
  login: { icon: "login", text: "Signed in" },
  view_content: { icon: "visibility", text: "Viewed an article" },
  mark_read: { icon: "check_circle", text: "Marked as read" },
  like: { icon: "favorite", text: "Liked an article" },
  post_comment: { icon: "chat_bubble", text: "Posted a comment" },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default async function NotificationsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { data: logs } = await supabaseAdmin
    .from("activity_logs")
    .select("id, action, target_type, target_id, created_at")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <span className="material-symbols-outlined text-[28px] text-primary">notifications</span>
        <h1 className="font-headline font-extrabold text-2xl text-on-surface">Notifications</h1>
      </div>

      {!logs || logs.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-3 block">notifications_off</span>
          <p className="text-on-surface-variant font-body">No activity yet. Start exploring!</p>
          <Link href="/" className="inline-block mt-4 px-5 py-2 rounded-full bg-primary text-on-primary font-body font-medium text-sm hover:opacity-90 transition-all">
            Explore Korea Guides
          </Link>
        </div>
      ) : (
        <div className="space-y-1">
          {logs.map((log) => {
            const info = actionLabel[log.action] ?? { icon: "info", text: log.action };
            return (
              <div
                key={log.id}
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-surface-container-low transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px] text-primary">{info.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body text-on-surface">{info.text}</p>
                  {log.target_type && (
                    <p className="text-xs text-outline capitalize">{log.target_type.replace("_", " ")}</p>
                  )}
                </div>
                <span className="text-xs font-body text-outline shrink-0">{timeAgo(log.created_at)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
