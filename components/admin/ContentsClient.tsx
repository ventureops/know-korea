"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CATEGORY_LABELS, CATEGORIES as CAT_LIST } from "@/lib/categories";

const STATUS_CHIPS = [
  { value: "", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

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

interface RowProps {
  content: Content;
  isDragMode: boolean;
  onTogglePublish: (id: string, current: boolean) => void;
  onToggleBmc: (id: string, current: boolean) => void;
}

function SortableRow({ content: c, isDragMode, onTogglePublish, onToggleBmc }: RowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: c.id,
    disabled: !isDragMode,
  });

  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`hover:bg-surface-container/40 transition-colors${isDragging ? " opacity-50 shadow-lg bg-surface-container" : ""}`}
    >
      {/* Drag handle — only in drag mode */}
      {isDragMode && (
        <td
          className="py-3 px-3 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant select-none">
            drag_indicator
          </span>
        </td>
      )}
      <td className="py-3 px-4">
        <span className="font-label text-on-surface line-clamp-1">{c.title}</span>
        <span className="text-xs text-on-surface-variant block">/{c.slug}</span>
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
          onClick={() => onTogglePublish(c.id, c.is_published)}
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
          onClick={() => onToggleBmc(c.id, c.show_bmc)}
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
  );
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

  useEffect(() => {
    setContents(initialContents);
  }, [initialContents]);

  const canDrag = sortBy === "sort_order";

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

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

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = contents.findIndex((c) => c.id === active.id);
    const newIndex = contents.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(contents, oldIndex, newIndex);

    // Optimistic update
    setContents(reordered);

    await fetch("/api/admin/contents/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: reordered.map((c, i) => ({ id: c.id, sort_order: i })),
      }),
    });
  }

  function navigateTo(newStatus: string, newCategory: string) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (newCategory) params.set("category", newCategory);
    if (newStatus) params.set("status", newStatus);
    if (sortBy && sortBy !== "sort_order") params.set("sortBy", sortBy);
    window.location.href = `${pathname}?${params.toString()}`;
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-col gap-3 mb-5">
        {/* Row 0: Search + Sort + Apply */}
        <div className="flex flex-wrap gap-3">
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

          {/* Apply search/sort */}
          <button
            onClick={applyFilter}
            className="px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-label hover:bg-primary-dim transition-colors active:scale-95"
          >
            Apply
          </button>
        </div>

        {/* Row 1: Status chips */}
        <div className="flex flex-wrap gap-2">
          {STATUS_CHIPS.map((chip) => (
            <button
              key={chip.value}
              onClick={() => navigateTo(chip.value, category)}
              className={`px-3 py-1 rounded-full text-sm font-label transition-colors active:scale-95 ${
                status === chip.value
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Row 2: Category chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigateTo(status, "")}
            className={`px-3 py-1 rounded-full text-sm font-label transition-colors active:scale-95 ${
              category === ""
                ? "bg-primary text-on-primary"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
            }`}
          >
            All
          </button>
          {CAT_LIST.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => navigateTo(status, cat.slug)}
              className={`px-3 py-1 rounded-full text-sm font-label transition-colors active:scale-95 ${
                category === cat.slug
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>


      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-container">
                {canDrag && (
                  <th className="py-3 px-3 text-xs text-on-surface-variant font-label font-semibold w-12">
                    <span className="material-symbols-outlined text-[16px] align-middle">
                      drag_indicator
                    </span>
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
              {canDrag ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={contents.map((c) => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {contents.map((c) => (
                      <SortableRow
                        key={c.id}
                        content={c}
                        isDragMode={true}
                        onTogglePublish={togglePublish}
                        onToggleBmc={toggleBmc}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              ) : (
                contents.map((c) => (
                  <SortableRow
                    key={c.id}
                    content={c}
                    isDragMode={false}
                    onTogglePublish={togglePublish}
                    onToggleBmc={toggleBmc}
                  />
                ))
              )}
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
