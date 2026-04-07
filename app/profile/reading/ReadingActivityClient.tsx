'use client';

import { useState } from 'react';
import Link from 'next/link';

type ContentRef = { title: string; slug: string; category: string } | null;
type ReadRow = { id: string; created_at: string; contents: ContentRef | ContentRef[] };
type SaveRow = { id: string; created_at: string; content_id: string; contents: ContentRef | ContentRef[] };
type LikeRow = { id: string; created_at: string; contents: ContentRef | ContentRef[] };
type CommentRow = { id: string; body: string; created_at: string; contents: ContentRef | ContentRef[] };

function getContent(row: { contents: ContentRef | ContentRef[] }): ContentRef {
  return Array.isArray(row.contents) ? (row.contents[0] ?? null) : row.contents;
}


interface Props {
  initialReads: ReadRow[];
  readTotal: number;
  initialSaves: SaveRow[];
  saveTotal: number;
  initialLikes: LikeRow[];
  likeTotal: number;
  initialComments: CommentRow[];
  commentTotal: number;
}

export default function ReadingActivityClient({
  initialReads, readTotal,
  initialSaves, saveTotal,
  initialLikes, likeTotal,
  initialComments, commentTotal,
}: Props) {
  const [reads, setReads] = useState(initialReads);
  const [saves, setSaves] = useState(initialSaves);
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);

  const [readOffset, setReadOffset] = useState(10);
  const [saveOffset, setSaveOffset] = useState(10);
  const [likeOffset, setLikeOffset] = useState(10);
  const [commentOffset, setCommentOffset] = useState(10);

  const [loadingMore, setLoadingMore] = useState<string | null>(null);
  const [unsaving, setUnsaving] = useState<string | null>(null);

  async function loadMore(type: string) {
    setLoadingMore(type);
    const offset = type === 'reads' ? readOffset : type === 'saves' ? saveOffset : type === 'likes' ? likeOffset : commentOffset;
    const res = await fetch(`/api/user/reading-activity?type=${type}&offset=${offset}&limit=10`);
    if (res.ok) {
      const { data } = await res.json();
      if (type === 'reads') { setReads(prev => [...prev, ...data]); setReadOffset(o => o + 10); }
      else if (type === 'saves') { setSaves(prev => [...prev, ...data]); setSaveOffset(o => o + 10); }
      else if (type === 'likes') { setLikes(prev => [...prev, ...data]); setLikeOffset(o => o + 10); }
      else if (type === 'comments') { setComments(prev => [...prev, ...data]); setCommentOffset(o => o + 10); }
    }
    setLoadingMore(null);
  }

  async function unsave(saveId: string, contentId: string) {
    setUnsaving(saveId);
    const res = await fetch('/api/saves', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content_id: contentId }),
    });
    if (res.ok) {
      setSaves(prev => prev.filter(s => s.id !== saveId));
    }
    setUnsaving(null);
  }

  return (
    <div className="max-w-2xl mx-auto px-5 md:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/profile" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-all active:scale-95">
          <span className="material-symbols-outlined text-[22px] text-on-surface-variant">arrow_back</span>
        </Link>
        <h1 className="font-headline font-extrabold text-2xl text-on-surface">Reading Activity</h1>
      </div>

      {/* Read Articles */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[20px] text-primary">auto_stories</span>
          <h2 className="font-headline font-bold text-base text-on-surface">
            Read Articles <span className="text-on-surface-variant font-body font-normal text-sm">({readTotal})</span>
          </h2>
        </div>
        {reads.length === 0 ? (
          <p className="text-sm font-body text-on-surface-variant px-1">Nothing yet.</p>
        ) : (
          <div className="space-y-1">
            {reads.map((r) => {
              const c = getContent(r);
              if (!c) return null;
              return (
                <Link
                  key={r.id}
                  href={`/${c.category}/${c.slug}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-success shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="text-sm font-body text-on-surface truncate flex-1">{c.title}</span>                </Link>
              );
            })}
          </div>
        )}
        {reads.length < readTotal && (
          <button
            onClick={() => loadMore('reads')}
            disabled={loadingMore === 'reads'}
            className="mt-3 text-sm font-body text-primary hover:underline disabled:opacity-50 px-3"
          >
            {loadingMore === 'reads' ? 'Loading...' : 'Show more'}
          </button>
        )}
      </section>

      {/* Saved Articles */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[20px] text-primary">bookmark</span>
          <h2 className="font-headline font-bold text-base text-on-surface">
            Saved Articles <span className="text-on-surface-variant font-body font-normal text-sm">({saves.length < saveTotal ? saveTotal : saves.length})</span>
          </h2>
        </div>
        {saves.length === 0 ? (
          <p className="text-sm font-body text-on-surface-variant px-1">Nothing saved yet.</p>
        ) : (
          <div className="space-y-1">
            {saves.map((s) => {
              const c = getContent(s);
              if (!c) return null;
              return (
                <div key={s.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container-low transition-colors group">
                  <Link href={`/${c.category}/${c.slug}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="material-symbols-outlined text-[16px] text-primary shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span>
                    <span className="text-sm font-body text-on-surface truncate flex-1">{c.title}</span>
                  </Link>
                  <button
                    onClick={() => unsave(s.id, s.content_id)}
                    disabled={unsaving === s.id}
                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 p-1 rounded-lg hover:bg-surface-container-high text-on-surface-variant disabled:opacity-30"
                    aria-label="Unsave"
                  >
                    <span className="material-symbols-outlined text-[16px]">bookmark_remove</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {saves.length < saveTotal && (
          <button
            onClick={() => loadMore('saves')}
            disabled={loadingMore === 'saves'}
            className="mt-3 text-sm font-body text-primary hover:underline disabled:opacity-50 px-3"
          >
            {loadingMore === 'saves' ? 'Loading...' : 'Show more'}
          </button>
        )}
      </section>

      {/* Liked Articles */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[20px] text-primary">favorite</span>
          <h2 className="font-headline font-bold text-base text-on-surface">
            Liked Articles <span className="text-on-surface-variant font-body font-normal text-sm">({likeTotal})</span>
          </h2>
        </div>
        {likes.length === 0 ? (
          <p className="text-sm font-body text-on-surface-variant px-1">Nothing liked yet.</p>
        ) : (
          <div className="space-y-1">
            {likes.map((l) => {
              const c = getContent(l);
              if (!c) return null;
              return (
                <Link
                  key={l.id}
                  href={`/${c.category}/${c.slug}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-error shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  <span className="text-sm font-body text-on-surface truncate flex-1">{c.title}</span>                </Link>
              );
            })}
          </div>
        )}
        {likes.length < likeTotal && (
          <button
            onClick={() => loadMore('likes')}
            disabled={loadingMore === 'likes'}
            className="mt-3 text-sm font-body text-primary hover:underline disabled:opacity-50 px-3"
          >
            {loadingMore === 'likes' ? 'Loading...' : 'Show more'}
          </button>
        )}
      </section>

      {/* My Comments */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[20px] text-primary">chat_bubble</span>
          <h2 className="font-headline font-bold text-base text-on-surface">
            My Comments <span className="text-on-surface-variant font-body font-normal text-sm">({commentTotal})</span>
          </h2>
        </div>
        {comments.length === 0 ? (
          <p className="text-sm font-body text-on-surface-variant px-1">No comments yet.</p>
        ) : (
          <div className="space-y-2">
            {comments.map((cm) => {
              const c = getContent(cm);
              return (
                <div key={cm.id} className="px-3 py-3 rounded-xl bg-surface-container-low">
                  {c && (
                    <Link href={`/${c.category}/${c.slug}#comments`} className="text-xs font-body text-primary hover:underline block mb-1 truncate">
                      {c.title}
                    </Link>
                  )}
                  <p className="text-sm font-body text-on-surface line-clamp-2">{cm.body}</p>
                </div>
              );
            })}
          </div>
        )}
        {comments.length < commentTotal && (
          <button
            onClick={() => loadMore('comments')}
            disabled={loadingMore === 'comments'}
            className="mt-3 text-sm font-body text-primary hover:underline disabled:opacity-50 px-3"
          >
            {loadingMore === 'comments' ? 'Loading...' : 'Show more'}
          </button>
        )}
      </section>
    </div>
  );
}
