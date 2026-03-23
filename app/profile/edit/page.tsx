import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import { createClient } from "@supabase/supabase-js";

export const metadata = { title: "Edit Profile — Know Korea" };
export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder"
);

export default async function ProfileEditPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id, nickname, avatar_url, email")
    .eq("email", session.user.email)
    .single();

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <a href="/profile" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-all active:scale-95">
          <span className="material-symbols-outlined text-[22px] text-on-surface-variant">arrow_back</span>
        </a>
        <h1 className="font-headline font-extrabold text-2xl text-on-surface">Edit Profile</h1>
      </div>
      <ProfileEditForm
        userId={user?.id ?? ""}
        initialNickname={user?.nickname ?? ""}
        initialAvatar={user?.avatar_url ?? null}
      />
    </div>
  );
}
