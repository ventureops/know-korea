"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const CATEGORY_LABELS: Record<string, string> = {
  "start-here": "Start Here",
  language: "Language",
  "life-in-korea": "Life in Korea",
  "work-business": "Work & Business",
  "practical-guide": "Practical Guide",
  "culture-society": "Culture & Society",
  "travel-places": "Travel & Places",
  "history-politics": "History & Politics",
  "economy-money": "Economy & Money",
  comparison: "Comparison",
  "real-stories": "Real Stories",
  "tools-resources": "Tools & Resources",
};

interface Content {
  id: string;
  title: string;
  slug: string;
  category: string;
  is_published: boolean;
  show_bmc: boolean;
  view_count: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface Props {
  initialContents: Content[];
  initialSearch: string;
  initialCategory: string;
  initialStatus: string;
  initialSortBy: string;
}

export default function ContentsClient({
  initialContents,
  initialSearch,
  initialCategory,
  initialStatus,
  initialSortBy,
}: Props) {
  const pathname = usePathname();
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [status, setStatus] = useState(initialStatus);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [contents, setContents] = useState(initialContents);
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    setContents(initialContents);
  }, [initialContents]);

  const isCustomOrder = sortBy === "sort_order";

  function applyFilter() {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    if (sortBy && sortBy !== "sort_order") params.set("sortBy", sortBy);
    window.location.href = `${pathname}?${params.toString()}`;
  }

  async function togglePublish(id: string, current: boolean) {
    setContents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_published: !current } : c))
    );
    await fetch(`/api/admin/contents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_published: !current }),
    });
  }

  async function toggleBmc(id: string, current: boolean) {
    setContents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, show_bmc: !current } : c))
    );
    await fetch(`/api/admin/contents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ show_bmc: !current }),
    });
  }

  async function moveItem(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= contents.length) return;

    const a = contents[index];
    const b = contents[targetIndex];

    // Optimistic update
    const next = [...contents];
    next[index] = b;
    next[targetIndex] = a;
    setContents(next);

    setReordering(true);
    await fetch("/api/admin/contents/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_a: a.id,
        sort_order_a: a.sort_order,
        id_b: b.id,
        sort_order_b: b.sort_order,
      }),
    });
    setReordering(false);
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilter()}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/15 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Category filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/15 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
        >
          <option value="">All Categories</option>
          {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/15 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/15 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
        >
          <option value="sort_order">Custom Order</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="category">Category (A→Z)</option>
          <option value="views">Most Views</option>
        </select>

        {/* Filter button */}
        <button
          onClick={applyFilter}
          className="px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-label hover:bg-primary-dim transition-colors active:scale-95"
        >
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-container">
                {isCustomOrder && (
                  <th className="py-3 px-3 text-xs text-on-surface-variant font-label font-semibold w-16">
                    ORDER
                  </th>
                )}
                <th className="text-left py-3 px-4 text-xs text-on-surface-variant font-label font-semibold">
                  ARTICLE TITLE
                </th>
                <th className="text-left py-3 px-4 text-xs text-on-surface-variant font-label font-semibold">
                  CATEGORY
                </th>
                <th className="text-left py-3 px-4 text-xs text-on-surface-variant font-label font-semibold">
                  STATUS
                </th>
                <th className="text-left py-3 px-4 text-xs text-on-surface-variant font-label font-semibold">
                  VIEWS
                </th>
                <th className="text-left py-3 px-4 text-xs text-on-surface-variant font-label font-semibold">
                  UPDATED
                </th>
                <th className="text-left py-3 px-4 text-xs text-on-surface-variant font-label font-semibold">
                  PUBLISH
                </th>
                <th className="text-left py-3 px-4 text-xs text-on-surface-variant font-label font-semibold">
                  BMC
                </th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {contents.map((c, i) => (
                <tr
                  key={c.id}
                  className="hover:bg-surface-container/40 transition-colors"
                >
                  {/* Order buttons — only in Custom Order mode */}
                  {isCustomOrder && (
                    <td className="py-3 px-3">
                      <div className="flex flex-col items-center gap-0.5">
                        <button
                          onClick={() => moveItem(i, "up")}
                          disabled={i === 0 || reordering}
                          className="p-0.5 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <span className="material-symbols-outlined text-[16px]">expand_less</span>
                        </button>
                        <button
                          onClick={() => moveItem(i, "down")}
                          disabled={i === contents.length - 1 || reordering}
                          className="p-0.5 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <span className="material-symbols-outlined text-[16px]">expand_more</span>
                        </button>
                      </div>
                    </td>
                  )}
                  <td className="py-3 px-4">
                    <span className="font-label text-on-surface line-clamp-1">
                      {c.title}
                    </span>
                    <span className="text-xs text-on-surface-variant block">
                      /{c.slug}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full font-label">
                      {CATEGORY_LABELS[c.category] ?? c.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs font-semibold flex items-center gap-1 ${
                        c.is_published ? "text-success" : "text-on-surface-variant"
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-[14px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {c.is_published ? "check_circle" : "draft"}
                      </span>
                      {c.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant text-xs">
                    {c.view_count.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant text-xs">
                    {new Date(c.updated_at).toLocaleDateString()}
                  </td>
                  {/* Publish toggle */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => togglePublish(c.id, c.is_published)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        c.is_published ? "bg-success" : "bg-surface-container-high"
                      }`}
                    >
                      <span
                        className="absolute h-3.5 w-3.5 rounded-full bg-surface-container-lowest shadow transition-transform"
                        style={{ transform: c.is_published ? "translateX(18px)" : "translateX(3px)" }}
                      />
                    </button>
                  </td>
                  {/* BMC toggle */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleBmc(c.id, c.show_bmc)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        c.show_bmc ? "bg-primary" : "bg-surface-container-high"
                      }`}
                    >
                      <span
                        className="absolute h-3.5 w-3.5 rounded-full bg-surface-container-lowest shadow transition-transform"
                        style={{ transform: c.show_bmc ? "translateX(18px)" : "translateX(3px)" }}
                      />
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/admin/contents/${c.id}/edit`}
                      className="text-xs text-primary hover:underline font-label"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {contents.length === 0 && (
            <p className="text-center text-on-surface-variant py-12 text-sm">
              No contents found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
