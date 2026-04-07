'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Props {
  contentId: string;
  initialSaved: boolean;
}

export default function SaveButton({ contentId, initialSaved }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (!session) {
      router.push('/login');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/saves', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content_id: contentId }),
    });
    if (res.ok) {
      const data = await res.json();
      setSaved(data.saved);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-body font-medium transition-all active:scale-95 disabled:opacity-60 ' + (saved ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high')}
      aria-label={saved ? 'Unsave' : 'Save'}
    >
      <span
        className="material-symbols-outlined text-[20px]"
        style={{ fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0" }}
      >
        bookmark
      </span>
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}
