"use client";

import { useState, useEffect, useCallback } from "react";

const CATEGORIES = [
  "Bug Report / Site Error",
  "Topic Suggestion",
  "Business / Partnership",
  "Other",
];

const CATEGORY_COLORS: Record<string, string> = {
  "Bug Report / Site Error": "bg-red-100 text-red-700 border border-red-200",
  "Topic Suggestion":        "bg-blue-100 text-blue-700 border border-blue-200",
  "Business / Partnership":  "bg-green-100 text-green-700 border border-green-200",
  "Other":                   "bg-gray-100 text-gray-600 border border-gray-200",
};

interface Submission {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  created_at: string;
  is_read: boolean;
  is_replied: boolean;
  replied_at: string | null;
  admin_note: string | null;
  is_archived: boolean;
}

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

export default function AdminContactPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  // Filters
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  // Panel state
  const [replyText, setReplyText] = useState("");
  const [noteText, setNoteText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);
  const [savingNote, setSavingNote] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    if (search) params.set("search", search);
    if (showArchived) params.set("archived", "true");
    params.set("page", String(page));
    params.set("limit", String(LIMIT));

    const res = await fetch(`/api/admin/contact?${params}`);
    const json = await res.json();
    setItems(json.data ?? []);
    setTotal(json.total ?? 0);
    setLoading(false);
  }, [category, status, search, showArchived, page]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openPanel = async (item: Submission) => {
    setSelected(item);
    setNoteText(item.admin_note ?? "");
    setReplyText("");
    setReplyError(null);
    setPanelOpen(true);

    if (!item.is_read) {
      await fetch(`/api/admin/contact/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: true }),
      });
      setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, is_read: true } : i));
      setSelected((prev) => prev ? { ...prev, is_read: true } : prev);
    }
  };

  const handleArchive = async (id: string, archive: boolean) => {
    await fetch(`/api/admin/contact/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_archived: archive }),
    });
    if (panelOpen && selected?.id === id) setPanelOpen(false);
    fetchItems();
  };

  const handleSaveNote = async () => {
    if (!selected) return;
    setSavingNote(true);
    await fetch(`/api/admin/contact/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_note: noteText }),
    });
    setSavingNote(false);
    setSelected((prev) => prev ? { ...prev, admin_note: noteText } : prev);
    setItems((prev) => prev.map((i) => i.id === selected.id ? { ...i, admin_note: noteText } : i));
  };

  const handleSendReply = async () => {
    if (!selected || !replyText.trim()) return;
    setSendingReply(true);
    setReplyError(null);
    const res = await fetch(`/api/admin/contact/${selected.id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: replyText }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setReplyError(data.detail ?? data.error ?? "Failed to send reply.");
    } else {
      const now = new Date().toISOString();
      const updatedNote = `[Reply sent]\n${replyText.trim()}${selected.admin_note ? `\n\n---\n\n${selected.admin_note}` : ""}`;
      setSelected((prev) => prev ? { ...prev, is_replied: true, replied_at: now, is_read: true, admin_note: updatedNote } : prev);
      setItems((prev) => prev.map((i) => i.id === selected.id ? { ...i, is_replied: true, replied_at: now, is_read: true } : i));
      setNoteText(updatedNote);
      setReplyText("");
    }
    setSendingReply(false);
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="max-w-6xl mr-auto relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-label text-on-surface-variant uppercase tracking-wider">Admin</p>
          <h1 className="font-headline text-2xl font-bold text-on-surface mt-1">
            Contact Management
            {!showArchived && items.filter((i) => !i.is_read).length > 0 && (
              <span className="ml-3 text-sm font-normal bg-error text-on-error px-2 py-0.5 rounded-full">
                {items.filter((i) => !i.is_read).length} unread
              </span>
            )}
          </h1>
        </div>
        <button
          onClick={() => { setShowArchived(!showArchived); setPage(1); }}
          className={`text-sm font-body px-4 py-2 rounded-lg border transition-colors ${
            showArchived
              ? "bg-surface-container border-outline-variant/30 text-on-surface"
              : "border-outline-variant/20 text-on-surface-variant hover:bg-surface-container"
          }`}
        >
          {showArchived ? "← Back to Inbox" : "View Archive"}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        {/* Category chips */}
        <div className="flex flex-wrap gap-1.5">
          {["", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
              className={`text-xs font-label px-3 py-1.5 rounded-full transition-colors ${
                category === cat
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {cat || "All Categories"}
            </button>
          ))}
        </div>

        {/* Status chips */}
        <div className="flex gap-1.5">
          {[
            { value: "", label: "All" },
            { value: "unread", label: "Unread" },
            { value: "read", label: "Read" },
            { value: "replied", label: "Replied" },
          ].map((s) => (
            <button
              key={s.value}
              onClick={() => { setStatus(s.value); setPage(1); }}
              className={`text-xs font-label px-3 py-1.5 rounded-full transition-colors ${
                status === s.value
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email or message..."
            className="w-full px-4 py-1.5 text-sm font-body bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/40 transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <span className="material-symbols-outlined text-[32px] text-on-surface-variant animate-spin">progress_activity</span>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-on-surface-variant text-sm">No submissions found.</div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/15">
                    <th className="text-left py-3 px-4 text-xs text-on-surface-variant font-label font-semibold w-6"></th>
                    <th className="text-left py-3 px-4 text-xs text-on-surface-variant font-label font-semibold">Category</th>
                    <th className="text-left py-3 px-4 text-xs text-on-surface-variant font-label font-semibold">Name</th>
                    <th className="text-left py-3 px-4 text-xs text-on-surface-variant font-label font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-xs text-on-surface-variant font-label font-semibold">Message</th>
                    <th className="text-left py-3 px-4 text-xs text-on-surface-variant font-label font-semibold">Date</th>
                    <th className="text-left py-3 px-4 text-xs text-on-surface-variant font-label font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-xs text-on-surface-variant font-label font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className={`border-b border-outline-variant/10 hover:bg-surface/50 transition-colors cursor-pointer ${!item.is_read ? "font-semibold" : "font-normal"}`}
                      onClick={() => openPanel(item)}
                    >
                      <td className="py-3 px-4">
                        {!item.is_read && (
                          <span className="w-2 h-2 rounded-full bg-primary block" />
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-label px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category] ?? "bg-surface-container text-on-surface-variant"}`}>
                          {item.category.split(" / ")[0]}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-on-surface">{item.name}</td>
                      <td className="py-3 px-4 text-on-surface-variant text-xs">{item.email}</td>
                      <td className="py-3 px-4 text-on-surface-variant max-w-[200px] truncate">
                        {item.message.slice(0, 60)}{item.message.length > 60 ? "…" : ""}
                      </td>
                      <td className="py-3 px-4 text-on-surface-variant text-xs whitespace-nowrap">
                        {relativeTime(item.created_at)}
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {item.is_replied ? (
                          <span className="text-green-600 font-medium">Replied</span>
                        ) : item.is_read ? (
                          <span className="text-gray-500 font-normal">Read</span>
                        ) : (
                          <span className="text-red-600 font-bold">New</span>
                        )}
                      </td>
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleArchive(item.id, !item.is_archived)}
                          className="text-xs text-on-surface-variant hover:text-on-surface transition-colors px-2 py-1 rounded hover:bg-surface-container"
                        >
                          {item.is_archived ? "Unarchive" : "Archive"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-outline-variant/10">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 cursor-pointer hover:bg-surface/50 transition-colors ${!item.is_read ? "font-semibold" : ""}`}
                  onClick={() => openPanel(item)}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      {!item.is_read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                      <span className="text-sm text-on-surface">{item.name}</span>
                    </div>
                    <span className="text-xs text-on-surface-variant">{relativeTime(item.created_at)}</span>
                  </div>
                  <span className={`text-xs font-label px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category] ?? ""}`}>
                    {item.category.split(" / ")[0]}
                  </span>
                  <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{item.message}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="text-xs px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant disabled:opacity-40 hover:bg-surface-container-high transition-colors"
          >
            ← Prev
          </button>
          <span className="text-xs text-on-surface-variant">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="text-xs px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant disabled:opacity-40 hover:bg-surface-container-high transition-colors"
          >
            Next →
          </button>
        </div>
      )}

      {/* Slide Panel */}
      {panelOpen && selected && (
        <>
          <div
            className="fixed inset-0 bg-inverse-surface/20 z-40"
            onClick={() => setPanelOpen(false)}
          />
          <aside className="fixed right-0 top-0 h-full w-full max-w-[480px] bg-surface-container-lowest shadow-2xl z-50 flex flex-col overflow-y-auto">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/15 sticky top-0 bg-surface-container-lowest z-10">
              <h2 className="font-headline font-bold text-base text-on-surface">Submission Details</h2>
              <button
                onClick={() => setPanelOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">
              {/* Sender Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center font-bold text-on-primary-container">
                    {selected.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-on-surface text-sm">{selected.name}</p>
                    <a href={`mailto:${selected.email}`} className="text-xs text-primary hover:underline">{selected.email}</a>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                  <span className={`font-label px-2 py-0.5 rounded-full ${CATEGORY_COLORS[selected.category] ?? ""}`}>
                    {selected.category}
                  </span>
                  <span>{new Date(selected.created_at).toLocaleString()}</span>
                </div>
                {selected.is_replied && selected.replied_at && (
                  <p className="text-xs text-success flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Replied {relativeTime(selected.replied_at)}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <p className="text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Message</p>
                <div className="bg-surface-container rounded-xl p-4 text-sm font-body text-on-surface leading-relaxed max-h-80 overflow-y-auto text-left whitespace-pre-wrap">
                  {selected.message}
                </div>
              </div>

              {/* Reply */}
              {!selected.is_replied && (
                <div>
                  <p className="text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Send Reply</p>
                  <textarea
                    rows={5}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Hi ${selected.name},\n\n`}
                    className="w-full px-4 py-3 text-sm font-body bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-on-surface resize-none focus:outline-none focus:border-primary/40 transition-colors"
                  />
                  {replyError && (
                    <p className="text-xs text-error mt-1">{replyError}</p>
                  )}
                  <button
                    onClick={handleSendReply}
                    disabled={sendingReply || !replyText.trim()}
                    className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-bold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {sendingReply ? (
                      <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                    ) : (
                      <span className="material-symbols-outlined text-[16px]">send</span>
                    )}
                    {sendingReply ? "Sending…" : "Send Reply"}
                  </button>
                </div>
              )}

              {/* Admin Note */}
              <div>
                <p className="text-xs font-label font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Admin Note</p>
                <textarea
                  rows={4}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Internal note (not visible to user)"
                  className="w-full px-4 py-3 text-sm font-body bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-on-surface resize-none focus:outline-none focus:border-primary/40 transition-colors"
                />
                <button
                  onClick={handleSaveNote}
                  disabled={savingNote}
                  className="mt-2 text-xs text-primary hover:underline disabled:opacity-50"
                >
                  {savingNote ? "Saving…" : "Save Note"}
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pb-4">
                <button
                  onClick={() => {
                    const newRead = !selected.is_read;
                    fetch(`/api/admin/contact/${selected.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ is_read: newRead }),
                    });
                    setSelected({ ...selected, is_read: newRead });
                    setItems((prev) => prev.map((i) => i.id === selected.id ? { ...i, is_read: newRead } : i));
                  }}
                  className="flex-1 text-sm py-2 rounded-xl border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  {selected.is_read ? "Mark Unread" : "Mark Read"}
                </button>
                <button
                  onClick={() => handleArchive(selected.id, !selected.is_archived)}
                  className="flex-1 text-sm py-2 rounded-xl border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  {selected.is_archived ? "Unarchive" : "Archive"}
                </button>
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
