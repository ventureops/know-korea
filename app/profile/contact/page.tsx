'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Submission = {
  id: string;
  category: string;
  message: string;
  created_at: string;
  is_replied: boolean;
  replied_at: string | null;
};

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

export default function ContactHistoryPage() {
  const { status } = useSession();
  const router = useRouter();

  const [items, setItems] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(10);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }
    if (status !== 'authenticated') return;
    fetch('/api/user/contact-history?limit=10&offset=0')
      .then(r => r.json())
      .then(({ data, total }) => {
        setItems(data ?? []);
        setTotal(total ?? 0);
        setLoading(false);
      });
  }, [status, router]);

  async function loadMore() {
    setLoadingMore(true);
    const res = await fetch(`/api/user/contact-history?limit=10&offset=${offset}`);
    if (res.ok) {
      const { data } = await res.json();
      setItems(prev => [...prev, ...(data ?? [])]);
      setOffset(o => o + 10);
    }
    setLoadingMore(false);
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-5 md:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/profile" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-all active:scale-95">
            <span className="material-symbols-outlined text-[22px] text-on-surface-variant">arrow_back</span>
          </Link>
          <h1 className="font-headline font-extrabold text-2xl text-on-surface">Contact History</h1>
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
        <h1 className="font-headline font-extrabold text-2xl text-on-surface">Contact History</h1>
      </div>

      {items.length === 0 ? (
        <div className="bg-surface-container rounded-2xl px-4 py-8 text-center">
          <p className="text-sm font-body text-on-surface-variant mb-3">No submissions yet.</p>
          <Link href="/contact" className="text-sm text-primary font-body font-medium hover:underline">
            Contact Us →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((s) => {
            const isOpen = expanded === s.id;
            return (
              <div key={s.id} className="bg-surface-container rounded-2xl overflow-hidden">
                {/* Header row — always visible, clickable */}
                <button
                  className="w-full flex items-start gap-3 px-4 py-4 text-left hover:bg-surface-container-high transition-colors"
                  onClick={() => setExpanded(isOpen ? null : s.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-body font-semibold text-on-surface truncate">{s.category}</span>
                      <span className="text-xs text-on-surface-variant shrink-0">{relativeTime(s.created_at)}</span>
                    </div>
                    <p className="text-sm font-body text-on-surface-variant line-clamp-1">
                      {s.message}
                    </p>
                    <div className="mt-2">
                      {s.is_replied ? (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          Replied{s.replied_at ? ` · ${relativeTime(s.replied_at)}` : ''}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-amber-600">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          Waiting for reply
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant shrink-0 mt-1 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                    expand_more
                  </span>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div className="px-4 pb-4 border-t border-outline-variant/15">
                    <div className="pt-3 space-y-3">
                      <div>
                        <p className="text-xs font-body font-semibold text-on-surface-variant uppercase tracking-wide mb-1">Category</p>
                        <p className="text-sm font-body text-on-surface">{s.category}</p>
                      </div>
                      <div>
                        <p className="text-xs font-body font-semibold text-on-surface-variant uppercase tracking-wide mb-1">Submitted</p>
                        <p className="text-sm font-body text-on-surface">{formatDate(s.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-body font-semibold text-on-surface-variant uppercase tracking-wide mb-1">Message</p>
                        <p className="text-sm font-body text-on-surface whitespace-pre-wrap">{s.message}</p>
                      </div>
                      {s.is_replied && (
                        <div className="bg-surface-container-low rounded-xl p-3">
                          <p className="text-xs font-body font-semibold text-on-surface-variant uppercase tracking-wide mb-1">Reply</p>
                          <p className="text-sm font-body text-on-surface-variant">Reply sent via email.</p>
                          {s.replied_at && (
                            <p className="text-xs text-on-surface-variant mt-1">— Know Korea · {formatDate(s.replied_at)}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {items.length < total && (
        <button
          onClick={loadMore}
          disabled={loadingMore}
          className="mt-4 text-sm font-body text-primary hover:underline disabled:opacity-50 px-1"
        >
          {loadingMore ? 'Loading...' : 'Show more'}
        </button>
      )}
    </div>
  );
}
