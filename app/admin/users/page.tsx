import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import AdminUsersClient from "@/components/admin/AdminUsersClient";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder"
);

async function getUsers(search: string, dormant: boolean) {
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

  const { data, count } = await query
    .order("created_at", { ascending: false })
    .limit(50);

  return { users: data ?? [], total: count ?? 0 };
}

async function getDormantCount() {
  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();
  const { count } = await supabaseAdmin
    .from("users")
    .select("id", { count: "exact", head: true })
    .lt("last_login_at", thirtyDaysAgo);
  return count ?? 0;
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { search?: string; dormant?: string };
}) {
  const search = searchParams.search ?? "";
  const dormant = searchParams.dormant === "true";

  const [{ users, total }, dormantCount] = await Promise.all([
    getUsers(search, dormant),
    getDormantCount(),
  ]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-headline text-2xl font-bold text-on-surface">
          User Management
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          {total.toLocaleString()} members total · {dormantCount} dormant
        </p>
      </div>

      <AdminUsersClient
        initialUsers={users}
        total={total}
        dormantCount={dormantCount}
        initialSearch={search}
        initialDormant={dormant}
      />
    </div>
  );
}
