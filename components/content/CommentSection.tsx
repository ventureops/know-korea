'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Comment {
  id: string;
  body: string;
  created_at: string;
  author_id: string;
  users: { nickname: string; avatar_url: string | null } | null;
}

interface Props {
  contentId: string;
  initialComments: Comment[];
}

export default function CommentSection({ contentId, initialComments }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    setError('');
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content_id: contentId, body }),
    });
    if (res.ok) {
      const data = await res.json();
      setComments((prev) => [
        ...prev,
        {
          ...data.comment,
          users: {
            nickname: session!.user.nickname ?? session!.user.name ?? 'Me',
            avatar_url: session!.user.image ?? null,
          },
        },
      ]);
      setBody('');
      router.refresh();
    } else {
      const d = await res.json();
      setError(d.error ?? 'Failed to post comment.');
    }
    setSubmitting(false);
  }

  async function deleteComment(id: string) {
    await fetch('/api/comments?id=' + id, { method: 'DELETE' });
    setComments((prev) => prev.filter((c) => c.id !== id));
    router.refresh();
  }

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + 'm ago';
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + 'h ago';
    return Math.floor(hrs / 24) + 'd ago';
  }

  return (
    <div className="mt-12 border-t border-outline-variant/15 pt-8">
      <h2 className="font-headline font-bold text-lg text-on-surface mb-6">
        Comments {comments.length > 0 && <span className="text-on-surface-variant font-body font-normal text-sm">({comments.length})</span>}
      </h2>

      {session ? (
        <form onSubmit={submit} className="mb-8">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center shrink-0 mt-0.5">
              {session.user.image ? (
                <img src={session.user.image} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="font-headline font-bold text-xs">{(session.user.nickname ?? session.user.name ?? '?')[0].toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                placeholder="Share your thoughts…"
                maxLength={2000}
                className="w-full px-4 py-3 rounded-xl bg-surface-container text-sm font-body text-on-surface placeholder:text-outline resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {error && <p className="text-xs text-error mt-1">{error}</p>}
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-outline">{body.length}/2000</span>
                <button
                  type="submit"
                  disabled={submitting || !body.trim()}
                  className="px-4 py-1.5 rounded-xl bg-primary text-on-primary text-sm font-body font-bold hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
                >
                  {submitting ? 'Posting…' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 px-4 py-4 rounded-xl bg-surface-container-low flex items-center gap-3">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">chat_bubble</span>
          <p className="text-sm font-body text-on-surface-variant">
            <a href="/login" className="text-primary font-bold hover:underline">Log in</a> to leave a comment.
          </p>
        </div>
      )}

      <div className="space-y-5">
        {comments.length === 0 ? (
          <p className="text-sm font-body text-on-surface-variant text-center py-6">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center shrink-0">
                {comment.users?.avatar_url ? (
                  <img src={comment.users.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-headline font-bold text-xs">{(comment.users?.nickname ?? '?')[0].toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-body font-bold text-on-surface">{comment.users?.nickname ?? 'Unknown'}</span>
                  <span className="text-xs text-outline">{timeAgo(comment.created_at)}</span>
                </div>
                <p className="text-sm font-body text-on-surface leading-relaxed whitespace-pre-line">{comment.body}</p>
                {session?.user?.id === comment.author_id && (
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="text-xs text-outline hover:text-error transition-colors mt-1"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}