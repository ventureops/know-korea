"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const ROLE_LABELS = ["", "Subscriber", "Contributor", "Moderator", "Admin"];
const ROLE_COLORS = [
  "",
  "bg-surface-container text-on-surface-variant",
  "bg-primary-container text-on-primary-container",
  "bg-tertiary-container/60 text-on-tertiary-container",
  "bg-primary text-on-primary",
];
const STATUS_COLORS: Record<string, string> = {
  active: "text-success",
  suspended: "text-tertiary",
  banned: "text-error",
};

interface User {
  id: string;
  nickname: string | null;
  email: string;
  role: number;
  status: string;
  last_login_at: string | null;
  created_at: string;
}

interface Props {
  initialUsers: User[];
  total: number;
  dormantCount: number;
  initialSearch: string;
  initialDormant: boolean;
  initialRole: string;
  initialStatus: string;
}

const ROLE_OPTIONS = [
  { value: "", label: "All Roles" },
  { value: "1", label: "Subscriber" },
  { value: "2", label: "Contributor" },
  { value: "3", label: "Moderator" },
  { value: "4", label: "Admin" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
  { value: "banned", label: "Banned" },
];

export default function AdminUsersClient({
  initialUsers,
  total,
  dormantCount,
  initialSearch,
  initialDormant,
  initialRole,
  initialStatus,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const [search, setSearch] = useState(initialSearch);
  const [dormant, setDormant] = useState(initialDormant);
  const [roleFilter, setRoleFilter] = useState(initialRole);
  const [statusFilter, setStatusFilter] = useState(initialStatus);

  function applyFilters(newSearch: string, newDormant: boolean, newRole?: string, newStatus?: string) {
    const r = newRole ?? roleFilter;
    const s = newStatus ?? statusFilter;
    const params = new URLSearchParams();
    if (newSearch) params.set("search", newSearch);
    if (newDormant) params.set("dormant", "true");
    if (r) params.set("role", r);
    if (s) params.set("status", s);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            placeholder="Search by nickname or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyFilters(search, dormant);
            }}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/15 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <button
          onClick={() => applyFilters(search, dormant)}
          className="px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-label hover:bg-primary-dim transition-colors active:scale-95"
        >
          Search
        </button>
        <button
          onClick={() => {
            const next = !dormant;
            setDormant(next);
            applyFilters(search, next);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-label transition-colors active:scale-95 ${
            dormant
              ? "bg-tertiary text-on-tertiary"
              : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">bedtime</span>
          Dormant ({dormantCount})
        </button>
      </div>

      {/* Role + Status filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            applyFilters(search, dormant, e.target.value, statusFilter);
          }}
          className="px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/15 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
        >
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            applyFilters(search, dormant, roleFilter, e.target.value);
          }}
          className="px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/15 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-container">
                <th className="text-left py-3 px-4 text-xs text-on-surface-variant font-label font-semibold">
                  NICKNAME
                </th>
                <th className="text-left py-3 px-4 text-xs text-on-surface-variant font-label font-semibold">
                  EMAIL
                </th>
                <th className="text-left py-3 px-4 text-xs text-on-surface-variant font-label font-semibold">
                  ROLE
                </th>
                <th className="text-left py-3 px-4 text-xs text-on-surface-variant font-label font-semibold">
                  STATUS
                </th>
                <th className="text-left py-3 px-4 text-xs text-on-surface-variant font-label font-semibold">
                  LAST LOGIN
                </th>
                <th className="text-left py-3 px-4 text-xs text-on-surface-variant font-label font-semibold">
                  JOINED
                </th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {initialUsers.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-surface-container/40 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-xs font-bold text-on-primary-container shrink-0">
                        {(u.nickname ?? u.email)[0].toUpperCase()}
                      </div>
                      <span className="font-label text-on-surface">
                        {u.nickname ?? "—"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant text-xs">
                    {u.email}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-label ${ROLE_COLORS[u.role] ?? ""}`}
                    >
                      {ROLE_LABELS[u.role] ?? `Lv${u.role}`}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs font-semibold ${STATUS_COLORS[u.status] ?? "text-on-surface-variant"}`}
                    >
                      {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant text-xs">
                    {u.last_login_at
                      ? new Date(u.last_login_at).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant text-xs">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="text-xs text-primary hover:underline font-label"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {initialUsers.length === 0 && (
            <p className="text-center text-on-surface-variant py-12 text-sm">
              No users found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
