"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ROLE_OPTIONS = [
  { value: 1, label: "Subscriber (Lv 1)" },
  { value: 2, label: "Contributor (Lv 2)" },
  { value: 3, label: "Moderator (Lv 3)" },
  { value: 4, label: "Admin (Lv 4)" },
];

interface Props {
  userId: string;
  currentRole: number;
  currentStatus: string;
  currentIsSupporter: boolean;
  callerRole: number;
}

export default function UserDetailClient({
  userId,
  currentRole,
  currentStatus,
  currentIsSupporter,
  callerRole,
}: Props) {
  const router = useRouter();
  const [role, setRole] = useState(currentRole);
  const [status, setStatus] = useState(currentStatus);
  const [isSupporter, setIsSupporter] = useState(currentIsSupporter);
  const [saving, setSaving] = useState(false);
  const [supporterSaving, setSupporterSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function save() {
    setSaving(true);
    setError(null);
    setSuccess(false);

    const updates: Record<string, unknown> = {};
    if (role !== currentRole) updates.role = role;
    if (status !== currentStatus) updates.status = status;

    if (Object.keys(updates).length === 0) {
      setSaving(false);
      return;
    }

    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save");
    } else {
      setSuccess(true);
      router.refresh();
    }
    setSaving(false);
  }

  async function toggleSupporter() {
    setSupporterSaving(true);
    const newVal = !isSupporter;
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_supporter: newVal }),
    });
    if (res.ok) {
      setIsSupporter(newVal);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed");
    }
    setSupporterSaving(false);
  }

  async function toggleSuspend() {
    const newStatus = status === "suspended" ? "active" : "suspended";
    setStatus(newStatus);
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed");
      setStatus(status); // revert
    } else {
      router.refresh();
    }
  }

  async function banUser() {
    if (!confirm("Are you sure you want to permanently ban this user?")) return;
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "banned" }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed");
    } else {
      setStatus("banned");
      router.refresh();
    }
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
      <p className="text-xs font-label font-semibold uppercase tracking-wider text-on-surface-variant mb-4">
        Account Management
      </p>

      {/* Role selector — Level 4 only */}
      {callerRole >= 4 && (
        <div className="mb-4">
          <label className="text-xs text-on-surface-variant block mb-1.5">
            Member Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(parseInt(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-surface-container border border-outline-variant/15 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
          >
            {ROLE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Account Status display */}
      <div className="mb-4">
        <label className="text-xs text-on-surface-variant block mb-1.5">
          Account Status
        </label>
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-label ${
              status === "active"
                ? "bg-success-container text-success"
                : status === "suspended"
                ? "bg-tertiary-container/40 text-tertiary"
                : "bg-error-container text-error"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {status === "active" ? "check_circle" : status === "suspended" ? "pause_circle" : "block"}
            </span>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>

      {error && (
        <p className="text-xs text-error mb-3">{error}</p>
      )}
      {success && (
        <p className="text-xs text-success mb-3">Changes saved.</p>
      )}

      {/* Supporter toggle (Level 4 only) */}
      {callerRole >= 4 && (
        <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-container-low mb-3">
          <label className="flex items-center gap-2 text-sm font-label text-on-surface cursor-pointer">
            <span className="material-symbols-outlined text-[16px] text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>coffee</span>
            Supporter
          </label>
          <button
            onClick={toggleSupporter}
            disabled={supporterSaving}
            className={`relative w-10 h-6 rounded-full transition-colors disabled:opacity-50 ${isSupporter ? 'bg-primary' : 'bg-surface-container-highest'}`}
            aria-label="Toggle supporter"
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-surface-container-lowest shadow transition-transform ${isSupporter ? 'translate-x-5' : 'translate-x-1'}`} />
          </button>
        </div>
      )}

      {/* Save role button (Level 4 only) */}
      {callerRole >= 4 && (
        <button
          onClick={save}
          disabled={saving}
          className="w-full py-2 rounded-lg bg-primary text-on-primary text-sm font-label hover:bg-primary-dim transition-colors active:scale-95 disabled:opacity-50 mb-3"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      )}

      {/* Suspend button (Level 3+) */}
      {status !== "banned" && (
        <button
          onClick={toggleSuspend}
          className={`w-full py-2 rounded-lg text-sm font-label transition-colors active:scale-95 ${
            status === "suspended"
              ? "bg-success-container text-success hover:bg-success-container/80"
              : "bg-tertiary-container/30 text-tertiary hover:bg-tertiary-container/50"
          }`}
        >
          {status === "suspended" ? "Unsuspend Account" : "Suspend Account"}
        </button>
      )}

      {/* Ban button — Level 4 only */}
      {callerRole >= 4 && status !== "banned" && (
        <button
          onClick={banUser}
          className="w-full py-2 rounded-lg bg-error-container/20 text-error text-sm font-label hover:bg-error-container/40 transition-colors active:scale-95 mt-2"
        >
          Permanently Ban
        </button>
      )}
    </div>
  );
}
