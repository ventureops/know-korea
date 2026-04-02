"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues with BlockNote
const BlockNoteEditorComponent = dynamic(
  () => import("./BlockNoteEditorInner"),
  { ssr: false, loading: () => <div className="h-64 bg-surface-container rounded-lg animate-pulse" /> }
);

import { CATEGORIES as CAT_LIST } from "@/lib/categories";
const CATEGORIES = CAT_LIST.map((c) => ({ value: c.slug, label: c.name }));

interface ContentEditorProps {
  mode: "new" | "edit";
  initialData?: {
    id?: string;
    title?: string;
    slug?: string;
    category?: string;
    excerpt?: string;
    cover_image?: string;
    cover_caption?: string;
    cover_alt?: string;
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
  const [coverCaption, setCoverCaption] = useState(initialData.cover_caption ?? "");
  const [coverAlt, setCoverAlt] = useState(initialData.cover_alt ?? "");
  const [tags, setTags] = useState((initialData.tags ?? []).join(", "));
  const [isPublished, setIsPublished] = useState(initialData.is_published ?? false);
  const [showBmc, setShowBmc] = useState(initialData.show_bmc ?? false);
  const [bodyMdx, setBodyMdx] = useState(initialData.body_mdx ?? "");
  const [saving, setSaving] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [pendingCoverUrl, setPendingCoverUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
      cover_caption: coverCaption.trim() || null,
      cover_alt: coverAlt.trim() || null,
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
      const rawError: string = data.error ?? "Failed to save";
      const friendlyError = rawError.includes("contents_slug_key") || rawError.includes("unique constraint")
        ? "Slug가 중복됩니다. 다른 slug를 사용해주세요."
        : rawError;
      setError(friendlyError);
      setSaving(false);
      return;
    }

    const data = await res.json();
    if (mode === "new") {
      // publish 시 바로 목록으로, draft는 편집 페이지로
      if (publish) {
        router.push("/admin/contents");
      } else {
        router.push(`/admin/contents/${data.content.id}/edit`);
      }
    } else {
      router.refresh();
    }
    setSaving(false);
  }, [title, slug, category, excerpt, coverImage, coverCaption, coverAlt, bodyMdx, tags, isPublished, showBmc, mode, initialData.id, router]);

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
            <div className="flex flex-col items-center gap-3">
              <label className="cursor-pointer px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-label hover:bg-primary-dim transition-colors active:scale-95">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">upload</span>
                  {coverUploading ? "Uploading..." : "Upload Cover Image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={coverUploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setCoverUploading(true);
                    setCoverError(null);
                    try {
                      const formData = new FormData();
                      formData.append("file", file);
                      const res = await fetch("/api/upload", { method: "POST", body: formData });
                      if (res.ok) {
                        const data = await res.json();
                        setCoverImage(data.url);
                        setPendingCoverUrl("");
                      } else {
                        const err = await res.json().catch(() => ({ error: "Upload failed" }));
                        setCoverError(err.error ?? "Upload failed");
                      }
                    } catch {
                      setCoverError("Network error — upload failed");
                    }
                    setCoverUploading(false);
                  }}
                />
              </label>
              {coverError && (
                <p className="text-xs text-error">{coverError}</p>
              )}
              <span className="text-xs text-on-surface-variant/60">or</span>
              <div className="flex w-full max-w-sm gap-2 items-center">
                <input
                  type="text"
                  placeholder="Paste image URL..."
                  value={pendingCoverUrl}
                  onChange={(e) => setPendingCoverUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && pendingCoverUrl.trim()) {
                      setCoverImage(pendingCoverUrl.trim());
                    }
                  }}
                  className="flex-1 text-sm text-center bg-transparent border-none outline-none text-on-surface-variant placeholder:text-on-surface-variant/40"
                />
                {pendingCoverUrl.trim() && (
                  <button
                    onClick={() => setCoverImage(pendingCoverUrl.trim())}
                    className="text-xs px-2 py-1 rounded-md bg-primary text-on-primary shrink-0"
                  >
                    Set
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Cover Caption & Alt Text */}
        {coverImage && (
          <div className="flex flex-col gap-2 mb-6">
            <input
              type="text"
              placeholder="Image source / credit (e.g., © Unsplash / John Doe)"
              value={coverCaption}
              onChange={(e) => setCoverCaption(e.target.value)}
              className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            <input
              type="text"
              placeholder="Describe this image for accessibility (e.g., Aerial view of Gyeongbokgung Palace)"
              value={coverAlt}
              onChange={(e) => setCoverAlt(e.target.value)}
              className="w-full bg-surface-container-low border-none rounded-lg p-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
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

          {/* Delete — edit mode only */}
          {mode === "edit" && initialData.id && (
            <div className="mt-5 pt-4 border-t border-outline-variant/15">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full py-2 rounded-lg bg-error/10 text-error text-sm font-label hover:bg-error/20 transition-colors active:scale-95"
              >
                Delete Article
              </button>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-error-container/10 text-sm text-error">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl p-6 w-full max-w-sm shadow-xl mx-4">
            <h3 className="font-headline font-bold text-lg text-on-surface mb-2">
              Delete this article?
            </h3>
            <p className="text-sm font-body text-on-surface-variant leading-relaxed mb-6">
              This action cannot be undone. All comments and likes associated with this article will also be deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 py-2 rounded-lg bg-surface-container text-on-surface text-sm font-label hover:bg-surface-container-high transition-colors active:scale-95"
              >
                Cancel
              </button>
              <button
                disabled={deleting}
                onClick={async () => {
                  setDeleting(true);
                  const res = await fetch(`/api/admin/contents/${initialData.id}`, { method: "DELETE" });
                  if (res.ok) {
                    router.push("/admin/contents");
                  } else {
                    setDeleting(false);
                    setShowDeleteModal(false);
                    setError("Failed to delete article.");
                  }
                }}
                className="flex-1 py-2 rounded-lg bg-error text-on-error text-sm font-label hover:opacity-90 transition-colors active:scale-95 disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
