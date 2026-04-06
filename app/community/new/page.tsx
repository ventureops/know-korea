'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const QAEditor = dynamic(() => import('@/components/qa/QAEditor'), { ssr: false });

import { CATEGORIES as CAT_LIST } from '@/lib/categories';
const CATEGORIES = [
  ...CAT_LIST
    .filter((c) => c.slug !== 'start-here')
    .map((c) => ({ value: c.slug, label: c.name })),
  { value: 'other', label: 'Other' },
];

export default function CommunityNewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/community/new');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const role = session?.user?.role ?? 1;
  if (role < 1) {
    return (
      <div className="px-5 md:px-8 py-8 max-w-2xl mr-auto text-center">
        <p className="text-sm font-body text-on-surface-variant">You need to be a subscriber to post questions.</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!title.trim()) return setError('Please enter a title.');
    if (!category) return setError('Please select a category.');
    if (!body.trim() || body === '<p></p>') return setError('Please write your question body.');

    setSubmitting(true);
    const res = await fetch('/api/qa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, category }),
    });
    if (res.ok) {
      const { id } = await res.json();
      router.push(`/community/${id}`);
    } else {
      const d = await res.json();
      setError(d.error ?? 'Failed to post question.');
      setSubmitting(false);
    }
  }

  return (
    <div className="px-5 md:px-8 py-8 max-w-2xl mr-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-headline font-extrabold text-2xl md:text-3xl text-on-surface tracking-tight mb-1">
          Ask a Question
        </h1>
        <p className="text-sm font-body text-on-surface-variant">
          Be specific. Good questions get helpful answers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-body font-bold text-on-surface mb-2">
            Title <span className="text-error">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            placeholder="e.g. How do I open a bank account in Korea as a foreigner?"
            className="w-full px-4 py-3 rounded-xl bg-surface-container text-sm font-body text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <p className="text-xs text-outline mt-1">{title.length}/200</p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-body font-bold text-on-surface mb-2">
            Category <span className="text-error">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-surface-container text-sm font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">Select a category…</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-body font-bold text-on-surface mb-2">
            Details <span className="text-error">*</span>
          </label>
          <QAEditor content={body} onChange={setBody} />
          <p className="text-xs text-outline mt-1">
            Include what you&apos;ve already tried and any relevant details.
          </p>
        </div>

        {/* Tips */}
        <div className="rounded-xl bg-surface-container-low p-4">
          <p className="text-xs font-label font-bold text-outline uppercase tracking-wider mb-2">Tips for a great question</p>
          <ul className="space-y-1">
            {[
              'Search first — your question may already be answered',
              'Be specific about your situation (visa type, duration, etc.)',
              'Include any steps you\'ve already tried',
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-xs font-body text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px] text-primary mt-0.5 shrink-0">check</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {error && (
          <p className="text-sm font-body text-error">{error}</p>
        )}

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 rounded-xl bg-surface-container text-sm font-body text-on-surface hover:bg-surface-container-high transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-body font-bold hover:bg-primary-dim transition-all active:scale-95 disabled:opacity-50"
          >
            {submitting ? 'Posting…' : 'Post Question'}
          </button>
        </div>
      </form>
    </div>
  );
}
