import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';
import QAManageClient, { type AdminQAPost } from '@/components/admin/QAManageClient';

export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder'
);

export default async function AdminQAPage({
  searchParams,
}: {
  searchParams: { search?: string; filter?: string };
}) {
  const session = await getSession();
  if (!session || (session.user.role ?? 0) < 3) redirect('/admin');

  const search = searchParams.search ?? '';
  const filter = searchParams.filter ?? '';

  const { data, count } = await supabaseAdmin
    .from('qa_posts')
    .select('id, title, category, is_resolved, created_at, author_id, users(nickname)', {
      count: 'exact',
    })
    .order('created_at', { ascending: false })
    .limit(200);

  const ids = (data ?? []).map((p: { id: string }) => p.id);
  const [{ data: likeCounts }, { data: commentCounts }] = await Promise.all([
    ids.length
      ? supabaseAdmin.from('likes').select('qa_post_id').in('qa_post_id', ids)
      : Promise.resolve({ data: [] }),
    ids.length
      ? supabaseAdmin.from('comments').select('qa_post_id').in('qa_post_id', ids)
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

  const posts: AdminQAPost[] = (data ?? []).map((p: Record<string, unknown>) => {
    const usersRaw = p.users;
    const users = Array.isArray(usersRaw)
      ? (usersRaw[0] as { nickname: string } | null)
      : (usersRaw as { nickname: string } | null);
    return {
      id: p.id as string,
      title: p.title as string,
      category: p.category as string,
      is_resolved: p.is_resolved as boolean,
      created_at: p.created_at as string,
      like_count: likeMap[p.id as string] ?? 0,
      comment_count: commentMap[p.id as string] ?? 0,
      users,
    };
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-headline text-2xl font-bold text-on-surface">Q&A Management</h1>
        <p className="text-sm text-on-surface-variant mt-1">{count ?? 0} posts total</p>
      </div>

      <QAManageClient initialPosts={posts} initialSearch={search} initialFilter={filter} />
    </div>
  );
}
