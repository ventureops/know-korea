'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  qaId: string;
  authorId: string;
  initialLiked: boolean;
  initialLikeCount: number;
  initialResolved: boolean;
  sessionUserId?: string;
}

export default function QAActions({
  qaId,
  authorId,
  initialLiked,
  initialLikeCount,
  initialResolved,
  sessionUserId,
}: Props) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [resolved, setResolved] = useState(initialResolved);
  const [likeLoading, setLikeLoading] = useState(false);
  const [solvedLoading, setSolvedLoading] = useState(false);

  const isAuthor = sessionUserId === authorId;

  async function toggleLike() {
    if (!sessionUserId) {
      router.push('/login');
      return;
    }
    setLikeLoading(true);
    const res = await fetch(`/api/qa/${qaId}/like`, { method: 'POST' });
    if (res.ok) {
      const { liked: newLiked, count } = await res.json();
      setLiked(newLiked);
      setLikeCount(count);
    }
    setLikeLoading(false);
  }

  async function toggleSolved() {
    setSolvedLoading(true);
    const res = await fetch(`/api/qa/${qaId}/solved`, { method: 'POST' });
    if (res.ok) {
      const { is_resolved } = await res.json();
      setResolved(is_resolved);
    }
    setSolvedLoading(false);
  }

  return (
    <div className="flex items-center gap-3 py-4 mb-2">
      {/* Like */}
      <button
        onClick={toggleLike}
        disabled={likeLoading}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-body font-medium text-sm transition-all active:scale-95 ${
          liked
            ? 'bg-tertiary/10 text-tertiary'
            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
        }`}
      >
        <span
          className="material-symbols-outlined text-[18px]"
          style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}
        >
          favorite
        </span>
        <span>{likeCount}</span>
      </button>

      {/* Resolved toggle — author only */}
      {isAuthor && (
        <button
          onClick={toggleSolved}
          disabled={solvedLoading}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-body font-medium text-sm transition-all active:scale-95 ${
            resolved
              ? 'bg-success/10 text-success'
              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: resolved ? "'FILL' 1" : "'FILL' 0" }}
          >
            check_circle
          </span>
          {resolved ? 'Resolved' : 'Mark as Resolved'}
        </button>
      )}

      {/* Resolved badge for non-authors */}
      {!isAuthor && resolved && (
        <span className="flex items-center gap-1.5 text-sm font-body text-success">
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          This question is resolved
        </span>
      )}
    </div>
  );
}
