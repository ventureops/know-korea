'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export interface QAComment {
  id: string;
  body: string;
  created_at: string;
  author_id: string;
  parent_id: string | null;
  is_helpful: boolean;
  users: { nickname: string; avatar_url: string | null; is_supporter?: boolean } | null;
  replies?: QAComment[];
}

interface Props {
  qaPostId: string;
  qaAuthorId: string;
  initialComments: QAComment[];
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  return Math.floor(hrs / 24) + 'd ago';
}

function Avatar({ user, size = 8 }: { user: { nickname: string; avatar_url: string | null } | null; size?: number }) {
  const sizeClass = size === 6 ? 'w-6 h-6 text-[9px]' : 'w-8 h-8 text-xs';
  return (
    <div className={`${sizeClass} rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center shrink-0`}>
      {user?.avatar_url ? (
        <img src={user.avatar_url} alt="avatar" className="w-full h-full object-cover" />
      ) : (
        <span className="font-headline font-bold">{(user?.nickname ?? '?')[0].toUpperCase()}</span>
      )}
    </div>
  );
}

function CommentForm({
  onSubmit,
  placeholder = 'Write a reply…',
  compact = false,
  onCancel,
}: {
  onSubmit: (body: string) => Promise<void>;
  placeholder?: string;
  compact?: boolean;
  onCancel?: () => void;
}) {
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    await onSubmit(body.trim());
    setBody('');
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={compact ? 2 : 3}
        placeholder={placeholder}
        maxLength={2000}
        className="w-full px-4 py-3 rounded-xl bg-surface-container text-sm font-body text-on-surface placeholder:text-outline resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-outline">{body.length}/2000</span>
        <div className="flex gap-2">
          {onCancel && (
            <button type="button" onClick={onCancel} className="px-3 py-1.5 rounded-xl text-sm font-body text-on-surface-variant hover:bg-surface-container transition-all">
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting || !body.trim()}
            className="px-4 py-1.5 rounded-xl bg-primary text-on-primary text-sm font-body font-bold hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
          >
            {submitting ? 'Posting…' : 'Post'}
          </button>
        </div>
      </div>
    </form>
  );
}

function CommentItem({
  comment,
  qaPostId,
  qaAuthorId,
  sessionUserId,
  sessionRole,
  onDelete,
  onHelpful,
  onReply,
}: {
  comment: QAComment;
  qaPostId: string;
  qaAuthorId: string;
  sessionUserId?: string;
  sessionRole?: number;
  onDelete: (id: string) => void;
  onHelpful: (commentId: string, current: boolean) => void;
  onReply: (parentId: string, body: string) => Promise<void>;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const isAuthor = sessionUserId === comment.author_id;
  const isQAAuthor = sessionUserId === qaAuthorId;
  const canDelete = isAuthor || (sessionRole ?? 0) >= 3;

  return (
    <div className={`flex gap-3 ${comment.is_helpful ? 'bg-success/5 rounded-xl p-3' : ''}`}>
      <Avatar user={comment.users} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-sm font-body font-bold text-on-surface">{comment.users?.nickname ?? 'Unknown'}</span>
          {comment.users?.is_supporter && (
            <span className="material-symbols-outlined text-[13px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }} title="Supporter">military_tech</span>
          )}
          <span className="text-xs text-outline">{timeAgo(comment.created_at)}</span>
          {comment.is_helpful && (
            <span className="flex items-center gap-1 text-xs text-success font-label font-bold">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
              Helpful
            </span>
          )}
        </div>
        <p className="text-sm font-body text-on-surface leading-relaxed whitespace-pre-line">{comment.body}</p>
        <div className="flex items-center gap-3 mt-2">
          {sessionUserId && (
            <button
              onClick={() => setReplyOpen(!replyOpen)}
              className="text-xs text-outline hover:text-on-surface transition-colors"
            >
              Reply
            </button>
          )}
          {isQAAuthor && (
            <button
              onClick={() => onHelpful(comment.id, comment.is_helpful)}
              className={`text-xs transition-colors ${comment.is_helpful ? 'text-success' : 'text-outline hover:text-success'}`}
            >
              {comment.is_helpful ? '✓ Helpful' : 'Mark helpful'}
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(comment.id)}
              className="text-xs text-outline hover:text-error transition-colors"
            >
              Delete
            </button>
          )}
        </div>

        {/* Reply form */}
        {replyOpen && (
          <div className="mt-3">
            <CommentForm
              onSubmit={async (body) => {
                await onReply(comment.id, body);
                setReplyOpen(false);
              }}
              placeholder="Write a reply…"
              compact
              onCancel={() => setReplyOpen(false)}
            />
          </div>
        )}

        {/* Nested replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4 pl-4 border-l-2 border-outline-variant/20">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="flex gap-2">
                <Avatar user={reply.users} size={6} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-body font-bold text-on-surface">{reply.users?.nickname ?? 'Unknown'}</span>
                    {reply.users?.is_supporter && (
                      <span className="material-symbols-outlined text-[12px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }} title="Supporter">military_tech</span>
                    )}
                    <span className="text-xs text-outline">{timeAgo(reply.created_at)}</span>
                    {reply.is_helpful && (
                      <span className="flex items-center gap-1 text-xs text-success font-label font-bold">
                        <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
                        Helpful
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-body text-on-surface leading-relaxed whitespace-pre-line">{reply.body}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    {isQAAuthor && (
                      <button
                        onClick={() => onHelpful(reply.id, reply.is_helpful)}
                        className={`text-xs transition-colors ${reply.is_helpful ? 'text-success' : 'text-outline hover:text-success'}`}
                      >
                        {reply.is_helpful ? '✓ Helpful' : 'Mark helpful'}
                      </button>
                    )}
                    {(sessionUserId === reply.author_id || (sessionRole ?? 0) >= 3) && (
                      <button
                        onClick={() => onDelete(reply.id)}
                        className="text-xs text-outline hover:text-error transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function QACommentSection({ qaPostId, qaAuthorId, initialComments }: Props) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<QAComment[]>(
    // Build tree: top-level comments with their replies
    (() => {
      const top = initialComments.filter((c) => !c.parent_id);
      return top.map((c) => ({
        ...c,
        replies: initialComments.filter((r) => r.parent_id === c.id),
      }));
    })()
  );

  const userId = session?.user?.id;
  const role = session?.user?.role ?? 0;

  async function postComment(body: string, parentId?: string) {
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qa_post_id: qaPostId, body, parent_id: parentId ?? null }),
    });
    if (!res.ok) return;
    const { comment } = await res.json();
    const newComment: QAComment = {
      ...comment,
      users: { nickname: session!.user.nickname ?? session!.user.name ?? 'Me', avatar_url: session!.user.image ?? null },
    };

    if (!parentId) {
      setComments((prev) => [...prev, { ...newComment, replies: [] }]);
    } else {
      setComments((prev) =>
        prev.map((c) =>
          c.id === parentId ? { ...c, replies: [...(c.replies ?? []), newComment] } : c
        )
      );
    }
  }

  async function deleteComment(id: string) {
    await fetch('/api/comments?id=' + id, { method: 'DELETE' });
    setComments((prev) =>
      prev
        .filter((c) => c.id !== id)
        .map((c) => ({ ...c, replies: (c.replies ?? []).filter((r) => r.id !== id) }))
    );
  }

  async function toggleHelpful(commentId: string, current: boolean) {
    const res = await fetch(`/api/qa/${qaPostId}/helpful`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment_id: commentId }),
    });
    if (!res.ok) return;
    const { is_helpful } = await res.json();
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) return { ...c, is_helpful };
        return {
          ...c,
          replies: (c.replies ?? []).map((r) => (r.id === commentId ? { ...r, is_helpful } : r)),
        };
      })
    );
  }

  const totalCount = comments.reduce((acc, c) => acc + 1 + (c.replies?.length ?? 0), 0);

  return (
    <div className="mt-10 border-t border-outline-variant/15 pt-8">
      <h2 className="font-headline font-bold text-lg text-on-surface mb-6">
        Replies{' '}
        {totalCount > 0 && (
          <span className="text-on-surface-variant font-body font-normal text-sm">({totalCount})</span>
        )}
      </h2>

      {session ? (
        <div className="flex gap-3 mb-8">
          <Avatar user={{ nickname: session.user.nickname ?? session.user.name ?? '?', avatar_url: session.user.image ?? null }} />
          <div className="flex-1">
            <CommentForm onSubmit={(body) => postComment(body)} />
          </div>
        </div>
      ) : (
        <div className="mb-8 px-4 py-4 rounded-xl bg-surface-container-low flex items-center gap-3">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">chat_bubble</span>
          <p className="text-sm font-body text-on-surface-variant">
            <a href="/login" className="text-primary font-bold hover:underline">Log in</a> to join the discussion.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-sm font-body text-on-surface-variant text-center py-6">
            No replies yet. Be the first to respond!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              qaPostId={qaPostId}
              qaAuthorId={qaAuthorId}
              sessionUserId={userId}
              sessionRole={role}
              onDelete={deleteComment}
              onHelpful={toggleHelpful}
              onReply={(parentId, body) => postComment(body, parentId)}
            />
          ))
        )}
      </div>
    </div>
  );
}
