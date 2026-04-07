'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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

type Discussion = {
  id: string;
  title: string;
  category: string;
  created_at: string;
  is_resolved: boolean;
  replyCount?: number;
};

type Reply = {
  id: string;
  body: string;
  created_at: string;
  qa_posts: { id: string; title: string } | { id: string; title: string }[] | null;
};

export default function CommunityActivityPage() {
  const { status } = useSession();
  const router = useRouter();

  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [discTotal, setDiscTotal] = useState(0);
  const [discOffset, setDiscOffset] = useState(10);

  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyTotal, setReplyTotal] = useState(0);
  const [replyOffset, setReplyOffset] = useState(10);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }
    if (status !== 'authenticated') return;
    Promise.all([
      fetch('/api/user/community-activity?type=discussions&limit=10&offset=0'),
      fetch('/api/user/community-activity?type=replies&limit=10&offset=0'),
    ]).then(async ([dRes, rRes]) => {
      const dData = await dRes.json();
      const rData = await rRes.json();
      setDiscussions(dData.data ?? []);
      setDiscTotal(dData.total ?? 0);
      setReplies(rData.data ?? []);
      setReplyTotal(rData.total ?? 0);
      setLoading(false);
    });
  }, [status, router]);

  async function loadMore(type: string) {
    setLoadingMore(type);
    const offset = type === 'discussions' ? discOffset : replyOffset;
    const res = await fetch(`/api/user/community-activity?type=${type}&limit=10&offset=${offset}`);
    if (res.ok) {
      const { data } = await res.json();
      if (type === 'discussions') { setDiscussions(prev => [...prev, ...data]); setDiscOffset(o => o + 10); }
      else { setReplies(prev => [...prev, ...data]); setReplyOffset(o => o + 10); }
    }
    setLoadingMore(null);
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-5 md:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/profile" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-all active:scale-95">
            <span className="material-symbols-outlined text-[22px] text-on-surface-variant">arrow_back</span>
          </Link>
          <h1 className="font-headline font-extrabold text-2xl text-on-surface">Community Activity</h1>
        </div>
        <p className="text-sm text-on-surface-variant">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 md:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/profile" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-all active:scale-95">
          <span className="material-symbols-outlined text-[22px] text-on-surface-variant">arrow_back</span>
        </Link>
        <h1 className="font-headline font-extrabold text-2xl text-on-surface">Community Activity</h1>
      </div>

      {/* My Discussions */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[20px] text-primary">edit_note</span>
          <h2 className="font-headline font-bold text-base text-on-surface">
            My Discussions <span className="text-on-surface-variant font-body font-normal text-sm">({discTotal})</span>
          </h2>
        </div>
        {discussions.length === 0 ? (
          <p className="text-sm font-body text-on-surface-variant px-1">No discussions yet.</p>
        ) : (
          <div className="space-y-1">
            {discussions.map((d) => (
              <Link
                key={d.id}
                href={`/community/${d.id}`}
                className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-surface-container-low transition-colors"
              >
                {d.is_resolved && (
                  <span className="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                )}
                {!d.is_resolved && (
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant shrink-0 mt-0.5">help</span>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body text-on-surface truncate">{d.title}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {d.category}
                    {d.is_resolved && <span className="ml-2 text-primary">· Featured</span>}
                  </p>
                </div>
                <span className="text-xs text-on-surface-variant shrink-0">{relativeTime(d.created_at)}</span>
              </Link>
            ))}
          </div>
        )}
        {discussions.length < discTotal && (
          <button
            onClick={() => loadMore('discussions')}
            disabled={loadingMore === 'discussions'}
            className="mt-3 text-sm font-body text-primary hover:underline disabled:opacity-50 px-3"
          >
            {loadingMore === 'discussions' ? 'Loading...' : 'Show more'}
          </button>
        )}
      </section>

      {/* My Replies */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[20px] text-primary">chat_bubble</span>
          <h2 className="font-headline font-bold text-base text-on-surface">
            My Replies <span className="text-on-surface-variant font-body font-normal text-sm">({replyTotal})</span>
          </h2>
        </div>
        {replies.length === 0 ? (
          <p className="text-sm font-body text-on-surface-variant px-1">No replies yet.</p>
        ) : (
          <div className="space-y-2">
            {replies.map((r) => {
              const post = Array.isArray(r.qa_posts) ? r.qa_posts[0] : r.qa_posts;
              return (
                <div key={r.id} className="px-3 py-3 rounded-xl bg-surface-container-low">
                  {post && (
                    <Link href={`/community/${post.id}`} className="text-xs font-body text-primary hover:underline block mb-1 truncate">
                      {post.title}
                    </Link>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-body text-on-surface line-clamp-2 flex-1">{r.body}</p>
                    <span className="text-xs text-on-surface-variant shrink-0">{relativeTime(r.created_at)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {replies.length < replyTotal && (
          <button
            onClick={() => loadMore('replies')}
            disabled={loadingMore === 'replies'}
            className="mt-3 text-sm font-body text-primary hover:underline disabled:opacity-50 px-3"
          >
            {loadingMore === 'replies' ? 'Loading...' : 'Show more'}
          </button>
        )}
      </section>
    </div>
  );
}
