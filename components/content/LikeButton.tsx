'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Props {
  contentId: string;
  initialLiked: boolean;
  initialCount: number;
}

export default function LikeButton({ contentId, initialLiked, initialCount }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (!session) {
      router.push('/login');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content_id: contentId }),
    });
    if (res.ok) {
      const data = await res.json();
      setLiked(data.liked);
      setCount(data.count);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-body font-medium transition-all active:scale-95 disabled:opacity-60 ' + (liked ? 'bg-error/10 text-error' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high')}
      aria-label={liked ? 'Unlike' : 'Like'}
    >
      <span
        className="material-symbols-outlined text-[18px]"
        style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}
      >
        favorite
      </span>
      <span>{count > 0 ? count : ''} {liked ? 'Liked' : 'Like'}</span>
    </button>
  );
}
