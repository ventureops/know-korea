import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { cloudinaryUrl } from "@/lib/cloudinary";

export const metadata = { title: "Profile" };
export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder"
);

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id, email, nickname, avatar_url, role, created_at")
    .eq("email", session.user.email)
    .single();

  const roleLabel = ["Visitor", "Subscriber", "Contributor", "Moderator", "Admin"][user?.role ?? 1];

  const CATEGORY_COLORS: Record<string, string> = {
    "Bug Report / Site Error": "bg-red-100 text-red-700",
    "Topic Suggestion":        "bg-blue-100 text-blue-700",
    "Business / Partnership":  "bg-green-100 text-green-700",
    "Other":                   "bg-gray-100 text-gray-600",
  };

  function relativeTime(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  }

  // Stats
  const [{ count: readCount }, { count: likeCount }, { count: commentCount }, { data: submissions }] = await Promise.all([
    supabaseAdmin.from("content_reads").select("*", { count: "exact", head: true }).eq("user_id", user?.id ?? ""),
    supabaseAdmin.from("likes").select("*", { count: "exact", head: true }).eq("user_id", user?.id ?? ""),
    supabaseAdmin.from("comments").select("*", { count: "exact", head: true }).eq("author_id", user?.id ?? ""),
    supabaseAdmin
      .from("contact_submissions")
      .select("id, category, message, created_at, is_replied, replied_at")
      .eq("user_id", user?.id ?? "")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="max-w-2xl mr-auto px-5 md:px-8 py-10">
      {/* Header */}
      <div className="flex items-start gap-5 mb-8">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center shrink-0">
          {user?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cloudinaryUrl(user.avatar_url, "avatar")} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="font-headline font-bold text-3xl text-on-surface">
              {(user?.nickname ?? "?")[0].toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-headline font-extrabold text-2xl text-on-surface truncate">
              {user?.nickname}
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-body font-bold">
              {roleLabel}
            </span>
          </div>
          <p className="text-sm font-body text-on-surface-variant mt-0.5">{user?.email}</p>
          <p className="text-xs font-body text-outline mt-1">
            Member since {new Date(user?.created_at ?? "").toLocaleDateString("en-US", { year: "numeric", month: "long" })}
          </p>
        </div>
        <Link
          href="/profile/edit"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container text-on-surface text-sm font-body font-medium hover:bg-surface-container-high transition-all active:scale-95 shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">edit</span>
          Edit
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { icon: "visibility", label: "Read", count: readCount ?? 0 },
          { icon: "favorite", label: "Liked", count: likeCount ?? 0 },
          { icon: "chat_bubble", label: "Comments", count: commentCount ?? 0 },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container rounded-2xl px-4 py-5 text-center">
            <span className="material-symbols-outlined text-[22px] text-primary mb-1 block">{stat.icon}</span>
            <p className="font-headline font-extrabold text-2xl text-on-surface">{stat.count}</p>
            <p className="text-xs font-body text-on-surface-variant">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Badges — Phase 5에서 구현 */}
      <div className="bg-surface-container rounded-2xl px-5 py-4 mb-6">
        <h2 className="font-headline font-bold text-base text-on-surface mb-3">Badges</h2>
        <p className="text-sm font-body text-on-surface-variant">
          Badges will be awarded as you engage with the community. Keep exploring!
        </p>
      </div>

      {/* Quick links */}
      <div className="flex flex-col gap-1">
        <Link
          href="/profile/activities"
          className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-surface-container-low transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">history</span>
            <span className="text-sm font-body text-on-surface">My Activity History</span>
          </div>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">chevron_right</span>
        </Link>
        <Link
          href="/notifications"
          className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-surface-container-low transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">notifications</span>
            <span className="text-sm font-body text-on-surface">Notifications</span>
          </div>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">chevron_right</span>
        </Link>
      </div>

      {/* My Submissions */}
      <div className="mt-8">
        <h2 className="font-headline font-bold text-base text-on-surface mb-3">My Submissions</h2>
        {submissions && submissions.length > 0 ? (
          <div className="flex flex-col gap-3">
            {submissions.map((s) => (
              <div key={s.id} className="bg-surface-container rounded-2xl px-4 py-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-xs font-label px-2 py-0.5 rounded-full ${CATEGORY_COLORS[s.category] ?? "bg-gray-100 text-gray-600"}`}>
                    {s.category.split(" / ")[0]}
                  </span>
                  <span className="text-xs text-on-surface-variant">{relativeTime(s.created_at)}</span>
                </div>
                <p className="text-sm font-body text-on-surface-variant leading-relaxed mb-2">
                  {s.message.slice(0, 100)}{s.message.length > 100 ? "…" : ""}
                </p>
                {s.is_replied ? (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Replied{s.replied_at ? ` · ${relativeTime(s.replied_at)}` : ""}
                  </p>
                ) : (
                  <p className="text-xs text-amber-600 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    Waiting for reply
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface-container rounded-2xl px-4 py-6 text-center">
            <p className="text-sm font-body text-on-surface-variant mb-2">No submissions yet.</p>
            <Link href="/contact" className="text-sm text-primary font-body font-medium hover:underline">
              Contact Us →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
