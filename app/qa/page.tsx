import Link from 'next/link';
import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import QACard, { type QAPost } from '@/components/qa/QACard';
import { getSession } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Q&A | Know Korea',
  description: 'Ask questions about life in Korea and get answers from the community.',
};

export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder'
);

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'start-here', label: 'Start Here' },
  { value: 'life-in-korea', label: 'Life in Korea' },
  { value: 'work-business', label: 'Work & Business' },
  { value: 'practical-guide', label: 'Practical Guide' },
  { value: 'language', label: 'Language' },
  { value: 'culture-society', label: 'Culture & Society' },
  { value: 'economy-money', label: 'Economy & Money' },
  { value: 'travel-places', label: 'Travel & Places' },
  { value: 'tools-resources', label: 'Tools & Resources' },
];

export default async function QAPage({
  searchParams,
}: {
  searchParams: { category?: string; page?: string };
}) {
  const session = await getSession();
  const category = searchParams.category ?? '';
  const page = parseInt(searchParams.page ?? '1', 10);
  const limit = 20;
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('qa_posts')
    .select(
      'id, title, body, category, is_resolved, created_at, author_id, users(nickname, avatar_url)',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) query = query.eq('category', category);

  const { data, count } = await query;

  const ids = (data ?? []).map((p: { id: string }) => p.id);
  const [{ data: likeCounts }, { data: commentCounts }] = await Promise.all([
    ids.length
      ? supabaseAdmin.from('likes').select('qa_post_id').in('qa_post_id', ids)
      : Promise.resolve({ data: [] }),
    ids.length
      ? supabaseAdmin.from('comments').select('qa_post_id').in('qa_post_id', ids).is('parent_id', null)
      : Promise.resolve({ data: [] }),
  ]);

  const likeMap: Record<string, number> = {};
  const commentMap: Record<string, number> = {};
  (likeCounts ?? []).forEach((r: { qa_post_id: string }) => {
    likeMap[r.qa_post_id] = (likeMap[r.qa_post_id] ?? 0) + 1;
  });
  (commentCounts ?? []).forEach((r: { qa_post_id: string }) => {
    commentMap[r.qa_post_id] = (commentMap[r.qa_post_id] ?? 0) + 1;
  });

  const posts: QAPost[] = (data ?? []).map((p: Record<string, unknown>) => {
    const usersRaw = p.users;
    const users = Array.isArray(usersRaw) ? (usersRaw[0] ?? null) : usersRaw as QAPost['users'];
    return {
      id: p.id as string,
      title: p.title as string,
      body: p.body as string,
      category: p.category as string,
      is_resolved: p.is_resolved as boolean,
      created_at: p.created_at as string,
      like_count: likeMap[p.id as string] ?? 0,
      comment_count: commentMap[p.id as string] ?? 0,
      users,
    };
  });

  const totalPages = Math.ceil((count ?? 0) / limit);

  return (
    <div className="px-5 md:px-8 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline font-extrabold text-2xl md:text-3xl text-on-surface tracking-tight">
            Community Q&amp;A
          </h1>
          <p className="text-sm font-body text-on-surface-variant mt-1">
            Ask the community, share what you know.
          </p>
        </div>
        {session ? (
          <Link
            href="/qa/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-body font-bold text-sm hover:bg-primary-dim transition-all active:scale-95 shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Ask a Question
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-body font-bold text-sm hover:bg-surface-container-high transition-all active:scale-95 shrink-0"
          >
            Log in to ask
          </Link>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.value}
            href={cat.value ? `/qa?category=${cat.value}` : '/qa'}
            className={`px-3 py-1.5 rounded-full text-xs font-label font-bold transition-all ${
              category === cat.value
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {/* Post list */}
      {posts.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-[48px] text-outline mb-4 block">forum</span>
          <p className="font-headline font-bold text-on-surface mb-2">No questions yet</p>
          <p className="text-sm font-body text-on-surface-variant mb-6">
            {category ? 'No questions in this category.' : 'Be the first to ask!'}
          </p>
          {session && (
            <Link
              href="/qa/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-body font-bold text-sm hover:bg-primary-dim transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Ask a Question
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <QACard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {page > 1 && (
            <Link
              href={`/qa?${category ? `category=${category}&` : ''}page=${page - 1}`}
              className="px-4 py-2 rounded-xl bg-surface-container text-sm font-body text-on-surface hover:bg-surface-container-high transition-all"
            >
              Previous
            </Link>
          )}
          <span className="text-sm font-body text-on-surface-variant">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/qa?${category ? `category=${category}&` : ''}page=${page + 1}`}
              className="px-4 py-2 rounded-xl bg-surface-container text-sm font-body text-on-surface hover:bg-surface-container-high transition-all"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
