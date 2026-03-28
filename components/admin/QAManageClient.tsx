'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CATEGORY_LABELS, CATEGORIES as CAT_LIST } from '@/lib/categories';

export interface AdminQAPost {
  id: string;
  title: string;
  category: string;
  is_resolved: boolean;
  created_at: string;
  like_count: number;
  comment_count: number;
  users: { nickname: string } | null;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

export default function QAManageClient({
  initialPosts,
  initialSearch,
  initialFilter,
}: {
  initialPosts: AdminQAPost[];
  initialSearch: string;
  initialFilter: string;
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [search, setSearch] = useState(initialSearch);
  const [filter, setFilter] = useState(initialFilter);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === '' ||
      (filter === 'resolved' && p.is_resolved) ||
      (filter === 'open' && !p.is_resolved);
    return matchSearch && matchFilter;
  });

  async function toggleResolved(post: AdminQAPost) {
    setTogglingId(post.id);
    const res = await fetch(`/api/admin/qa/${post.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_resolved: !post.is_resolved }),
    });
    if (res.ok) {
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, is_resolved: !p.is_resolved } : p))
      );
    }
    setTogglingId(null);
  }

  async function deletePost(id: string) {
    if (!confirm('이 Q&A를 삭제하시겠습니까? 댓글도 함께 삭제됩니다.')) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/qa/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
    setDeleting(null);
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex items-center gap-2 flex-1 bg-surface-container rounded-xl px-3 py-2">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">search</span>
          <input
            type="text"
            placeholder="Search Q&A..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm font-body text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {[
            { value: '', label: 'All' },
            { value: 'open', label: 'Open' },
            { value: 'resolved', label: 'Resolved' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-4 py-2 rounded-xl text-sm font-label transition-colors ${
                filter === opt.value
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-on-surface-variant mb-3">{filtered.length} posts</p>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-on-surface-variant">No Q&A found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-container-low text-xs font-label text-on-surface-variant uppercase tracking-wider">
                <th className="text-left px-5 py-3">Title</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Author</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Category</th>
                <th className="text-center px-4 py-3 hidden sm:table-cell">Likes</th>
                <th className="text-center px-4 py-3 hidden sm:table-cell">Comments</th>
                <th className="text-center px-4 py-3">Status</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filtered.map((post) => (
                <tr key={post.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/qa/${post.id}`}
                      target="_blank"
                      className="font-body text-on-surface hover:text-primary transition-colors line-clamp-1"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell text-on-surface-variant">
                    {post.users?.nickname ?? '—'}
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-xs text-on-surface-variant">
                      {CATEGORY_LABELS[post.category] ?? post.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center hidden sm:table-cell text-on-surface-variant">
                    {post.like_count}
                  </td>
                  <td className="px-4 py-3.5 text-center hidden sm:table-cell text-on-surface-variant">
                    {post.comment_count}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button
                      onClick={() => toggleResolved(post)}
                      disabled={togglingId === post.id}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-label transition-colors ${
                        post.is_resolved
                          ? 'bg-success/15 text-success hover:bg-success/25'
                          : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-[13px]"
                        style={{ fontVariationSettings: post.is_resolved ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        {post.is_resolved ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      {post.is_resolved ? 'Resolved' : 'Open'}
                    </button>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell text-on-surface-variant text-xs">
                    {timeAgo(post.created_at)}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => deletePost(post.id)}
                      disabled={deleting === post.id}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-error/10 hover:text-error transition-colors"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
