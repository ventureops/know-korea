"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  created_at: string;
  updated_at: string;
}

interface Props {
  initialContents: Content[];
  initialSearch: string;
}

export default function ContentsClient({ initialContents, initialSearch }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [search, setSearch] = useState(initialSearch);
  const [contents, setContents] = useState(initialContents);

  function applySearch(q: string) {
    const params = new URLSearchParams();
    if (q) params.set("search", q);
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
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

  return (
    <div>
      {/* Search */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            placeholder="Search articles, guides..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applySearch(search)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/15 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <button
          onClick={() => applySearch(search)}
          className="px-4 py-2 rounded-lg bg-surface-container text-on-surface text-sm font-label hover:bg-surface-container-high transition-colors"
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
              {contents.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-surface-container/40 transition-colors"
                >
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
                        className={`absolute h-3.5 w-3.5 rounded-full bg-surface-container-lowest shadow transition-transform ${
                          c.is_published ? "translate-x-4.5" : "translate-x-1"
                        }`}
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
