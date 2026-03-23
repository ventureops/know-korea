"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues with BlockNote
const BlockNoteEditorComponent = dynamic(
  () => import("./BlockNoteEditorInner"),
  { ssr: false, loading: () => <div className="h-64 bg-surface-container rounded-lg animate-pulse" /> }
);

const CATEGORIES = [
  { value: "start-here", label: "Start Here" },
  { value: "language", label: "Language" },
  { value: "life-in-korea", label: "Life in Korea" },
  { value: "work-business", label: "Work & Business" },
  { value: "practical-guide", label: "Practical Guide" },
  { value: "culture-society", label: "Culture & Society" },
  { value: "travel-places", label: "Travel & Places" },
  { value: "history-politics", label: "History & Politics" },
  { value: "economy-money", label: "Economy & Money" },
  { value: "comparison", label: "Comparison" },
  { value: "real-stories", label: "Real Stories" },
  { value: "tools-resources", label: "Tools & Resources" },
];

interface ContentEditorProps {
  mode: "new" | "edit";
  initialData?: {
    id?: string;
    title?: string;
    slug?: string;
    category?: string;
    excerpt?: string;
    cover_image?: string;
    body_mdx?: string;
    tags?: string[];
    is_published?: boolean;
    show_bmc?: boolean;
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function ContentEditor({ mode, initialData = {} }: ContentEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData.title ?? "");
  const [slug, setSlug] = useState(initialData.slug ?? "");
  const [category, setCategory] = useState(initialData.category ?? "start-here");
  const [excerpt, setExcerpt] = useState(initialData.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(initialData.cover_image ?? "");
  const [tags, setTags] = useState((initialData.tags ?? []).join(", "));
  const [isPublished, setIsPublished] = useState(initialData.is_published ?? false);
  const [showBmc, setShowBmc] = useState(initialData.show_bmc ?? false);
  const [bodyMdx, setBodyMdx] = useState(initialData.body_mdx ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!initialData.slug || mode === "new") {
      setSlug(slugify(value));
    }
  };

  const handleSave = useCallback(async (publish?: boolean) => {
    if (!title.trim() || !slug.trim() || !category) {
      setError("Title, slug, and category are required.");
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      category,
      excerpt: excerpt.trim() || null,
      cover_image: coverImage.trim() || null,
      body_mdx: bodyMdx,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      is_published: publish !== undefined ? publish : isPublished,
      show_bmc: showBmc,
    };

    const url =
      mode === "edit" && initialData.id
        ? `/api/admin/contents/${initialData.id}`
        : "/api/admin/contents";
    const method = mode === "edit" ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save");
      setSaving(false);
      return;
    }

    const data = await res.json();
    if (mode === "new") {
      router.push(`/admin/contents/${data.content.id}/edit`);
    } else {
      router.refresh();
    }
    setSaving(false);
  }, [title, slug, category, excerpt, coverImage, bodyMdx, tags, isPublished, showBmc, mode, initialData.id, router]);

  return (
    <div className="flex gap-6 max-w-6xl mx-auto">
      {/* Main Editor */}
      <div className="flex-1 min-w-0">
        {/* Title */}
        <input
          type="text"
          placeholder="Article title..."
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full text-3xl font-headline font-bold text-on-surface bg-transparent border-none outline-none placeholder:text-on-surface-variant/40 mb-4"
        />

        {/* Excerpt */}
        <textarea
          placeholder="Write a short excerpt for this article..."
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="w-full text-base text-on-surface-variant bg-transparent border-none outline-none placeholder:text-on-surface-variant/40 resize-none mb-6"
        />

        {/* Cover image */}
        {coverImage ? (
          <div className="relative mb-6 rounded-xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage}
              alt="Cover"
              className="w-full h-48 object-cover"
            />
            <button
              onClick={() => setCoverImage("")}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-error text-on-error flex items-center justify-center text-sm"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>
        ) : (
          <div className="mb-6 border-2 border-dashed border-outline-variant/30 rounded-xl p-6 text-center">
            <span className="material-symbols-outlined text-[32px] text-on-surface-variant/40 block mb-2">
              image
            </span>
            <input
              type="text"
              placeholder="Paste cover image URL (Cloudinary)..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full max-w-sm text-sm text-center bg-transparent border-none outline-none text-on-surface-variant placeholder:text-on-surface-variant/40"
            />
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
            .map((tag) => (
              <span
                key={tag}
                className="text-xs bg-primary-container text-on-primary-container px-2.5 py-1 rounded-full font-label"
              >
                #{tag}
              </span>
            ))}
          <input
            type="text"
            placeholder="+ Add tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="text-xs bg-transparent border-none outline-none text-on-surface-variant placeholder:text-on-surface-variant/40 min-w-40"
          />
        </div>

        {/* BlockNote Editor */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm min-h-64">
          <BlockNoteEditorComponent
            initialContent={bodyMdx}
            onChange={setBodyMdx}
          />
        </div>

        {error && (
          <p className="mt-4 text-sm text-error">{error}</p>
        )}
      </div>

      {/* Right: Publishing Settings */}
      <div className="w-72 shrink-0">
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm sticky top-20">
          <h3 className="font-headline font-semibold text-on-surface mb-4">
            Publishing Settings
          </h3>

          {/* Status */}
          <div className="mb-4">
            <p className="text-xs text-on-surface-variant mb-2">STATUS</p>
            <div className="flex items-center gap-2">
              <span
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-label ${
                  isPublished
                    ? "bg-success-container text-success"
                    : "bg-surface-container text-on-surface-variant"
                }`}
              >
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {isPublished ? "check_circle" : "draft"}
                </span>
                {isPublished ? "Published" : "Draft"}
              </span>
            </div>
          </div>

          {/* Slug */}
          <div className="mb-4">
            <label className="text-xs text-on-surface-variant block mb-1.5">
              SLUG
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-container text-sm text-on-surface border border-outline-variant/15 focus:outline-none focus:border-primary transition-colors font-mono"
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="text-xs text-on-surface-variant block mb-1.5">
              CATEGORY
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-container text-sm text-on-surface border border-outline-variant/15 focus:outline-none focus:border-primary transition-colors"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* BMC Toggle */}
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-on-surface font-label">Support Content</p>
              <p className="text-xs text-on-surface-variant">Show BMC section</p>
            </div>
            <button
              onClick={() => setShowBmc(!showBmc)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showBmc ? "bg-primary" : "bg-surface-container-high"
              }`}
            >
              <span
                className="absolute h-4 w-4 rounded-full bg-surface-container-lowest shadow transition-transform"
                style={{ transform: showBmc ? "translateX(23px)" : "translateX(3px)" }}
              />
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="w-full py-2 rounded-lg bg-surface-container text-on-surface text-sm font-label hover:bg-surface-container-high transition-colors active:scale-95 disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="w-full py-2 rounded-lg bg-primary text-on-primary text-sm font-label hover:bg-primary-dim transition-colors active:scale-95 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
