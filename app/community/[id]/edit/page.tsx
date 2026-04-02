'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const QAEditor = dynamic(() => import('@/components/qa/QAEditor'), { ssr: false });

import { CATEGORIES as CAT_LIST } from '@/lib/categories';
const CATEGORIES = CAT_LIST.map((c) => ({ value: c.slug, label: c.name }));

export default function CommunityEditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const qaId = params.id as string;

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Fetch post directly via a simple approach
    async function loadPost() {
      try {
        const response = await fetch(`/api/qa/${qaId}`);
        if (response.ok) {
          const data = await response.json();
          setTitle(data.title);
          setBody(data.body);
          setCategory(data.category);
        }
      } catch {
        // fallback: ignore
      }
      setLoading(false);
    }

    if (status === 'authenticated') {
      loadPost();
    }
  }, [status, qaId, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
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
    const res = await fetch(`/api/qa/${qaId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, category }),
    });
    if (res.ok) {
      router.push(`/community/${qaId}`);
    } else {
      const d = await res.json();
      setError(d.error ?? 'Failed to update question.');
      setSubmitting(false);
    }
  }

  return (
    <div className="px-5 md:px-8 py-8 max-w-2xl mr-auto">
      <div className="mb-8">
        <h1 className="font-headline font-extrabold text-2xl md:text-3xl text-on-surface tracking-tight mb-1">
          Edit Question
        </h1>
        <p className="text-sm font-body text-on-surface-variant">
          Update your question details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-body font-bold text-on-surface mb-2">
            Title <span className="text-error">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            className="w-full px-4 py-3 rounded-xl bg-surface-container text-sm font-body text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <p className="text-xs text-outline mt-1">{title.length}/200</p>
        </div>

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

        <div>
          <label className="block text-sm font-body font-bold text-on-surface mb-2">
            Details <span className="text-error">*</span>
          </label>
          <QAEditor content={body} onChange={setBody} />
        </div>

        {error && <p className="text-sm font-body text-error">{error}</p>}

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
            {submitting ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
