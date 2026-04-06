import Link from 'next/link';
import { CATEGORY_LABELS } from '@/lib/categories';

export interface QAPost {
  id: string;
  title: string;
  body: string;
  category: string;
  is_resolved: boolean;
  created_at: string;
  like_count: number;
  comment_count: number;
  users: { nickname: string; avatar_url: string | null } | null;
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

export default function QACard({ post }: { post: QAPost }) {
  const label = CATEGORY_LABELS[post.category] ?? post.category.replace(/-/g, ' ');

  return (
    <Link
      href={`/community/${post.id}`}
      className="group block bg-surface-container-lowest rounded-2xl p-5 shadow-sm hover:shadow-xl border border-outline-variant/15 transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          {post.is_resolved ? (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10">
              <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </span>
          ) : (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-surface-container">
              <span className="material-symbols-outlined text-[16px] text-outline">chat_bubble_outline</span>
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-headline font-bold text-base text-on-surface leading-snug group-hover:text-primary transition-colors mb-2">
            {post.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-xs font-label text-outline">
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
              {label}
            </span>
            <span>{post.users?.nickname ?? 'Unknown'}</span>
            <span>·</span>
            <span>{timeAgo(post.created_at)}</span>
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-end gap-1.5 text-xs font-label text-outline">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">favorite</span>
            {post.like_count}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">chat_bubble</span>
            {post.comment_count}
          </span>
        </div>
      </div>
    </Link>
  );
}
