'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import type { Content } from '@/lib/supabase';
import { cloudinaryUrl } from '@/lib/cloudinary';

interface Props {
  articles: Content[];
  category: string;
  icon: string;
}

function estimateReadTime(body: string | null): string {
  if (!body) return '3 min read';
  const words = body.replace(/<[^>]+>/g, '').split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ContentGrid({ articles, category, icon }: Props) {
  const { data: session } = useSession();
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);

  const contentIds = articles.map((a) => a.id);

  useEffect(() => {
    if (!session || contentIds.length === 0) return;
    fetch(`/api/reads?content_ids=${contentIds.join(',')}`)
      .then((r) => r.json())
      .then((data) => setReadIds(new Set(data.reads)));
  }, [session, contentIds.join(',')]);

  async function toggleRead(contentId: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(contentId);
    const res = await fetch('/api/reads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content_id: contentId }),
    });
    if (res.ok) {
      const data = await res.json();
      setReadIds((prev) => {
        const next = new Set(prev);
        if (data.read) next.add(contentId);
        else next.delete(contentId);
        return next;
      });
    }
    setLoading(null);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {articles.map((article) => (
        <Link
          key={article.slug}
          href={`/${category}/${article.slug}`}
          className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-outline-variant/15 transition-all flex flex-col relative"
        >
          {/* Read status icon — top-right corner */}
          {session && (
            <button
              onClick={(e) => toggleRead(article.id, e)}
              disabled={loading === article.id}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-surface-container-lowest shadow-md transition-all hover:bg-surface-container-high active:scale-90 disabled:opacity-60"
              aria-label={readIds.has(article.id) ? 'Mark as unread' : 'Mark as read'}
            >
              <span
                className={`material-symbols-outlined text-[20px] ${readIds.has(article.id) ? 'text-[#166534]' : 'text-on-surface-variant/50'}`}
                style={{
                  fontVariationSettings: readIds.has(article.id) ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {readIds.has(article.id) ? 'check_circle' : 'radio_button_unchecked'}
              </span>
            </button>
          )}

          <div className="h-48 bg-surface-container overflow-hidden">
            {article.cover_image ? (
              <img
                src={cloudinaryUrl(article.cover_image, 'card')}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant/20">
                  {icon}
                </span>
              </div>
            )}
          </div>
          <div className="p-5 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-label text-outline">
                {estimateReadTime(article.body_mdx)}
              </span>
              <span className="text-xs font-label text-outline">·</span>
              <span className="text-xs font-label text-outline">
                {formatDate(article.created_at)}
              </span>
            </div>
            <h3 className="font-headline font-bold text-base text-on-surface leading-snug mb-2 line-clamp-2">
              {article.title}
            </h3>
            <p className="text-sm font-body text-on-surface-variant leading-relaxed line-clamp-3 flex-1">
              {article.excerpt}
            </p>
            <div className="flex items-center mt-4">
              <span className="text-sm font-body font-bold text-primary hover:text-primary-dim transition-colors">
                Read Article →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
