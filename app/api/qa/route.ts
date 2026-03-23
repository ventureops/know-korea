import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder'
);

// GET /api/qa?page=1&category=xxx
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const category = searchParams.get('category');
  const limit = 20;
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('qa_posts')
    .select(`
      id, title, body, category, content_id, is_resolved, created_at, updated_at,
      author_id,
      users(nickname, avatar_url)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) query = query.eq('category', category);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Attach like + comment counts per post
  const ids = (data ?? []).map((p: { id: string }) => p.id);
  const [{ data: likeCounts }, { data: commentCounts }] = await Promise.all([
    supabaseAdmin
      .from('likes')
      .select('qa_post_id')
      .in('qa_post_id', ids.length ? ids : ['none']),
    supabaseAdmin
      .from('comments')
      .select('qa_post_id')
      .in('qa_post_id', ids.length ? ids : ['none'])
      .is('parent_id', null),
  ]);

  const likeMap: Record<string, number> = {};
  const commentMap: Record<string, number> = {};
  (likeCounts ?? []).forEach((r: { qa_post_id: string }) => {
    likeMap[r.qa_post_id] = (likeMap[r.qa_post_id] ?? 0) + 1;
  });
  (commentCounts ?? []).forEach((r: { qa_post_id: string }) => {
    commentMap[r.qa_post_id] = (commentMap[r.qa_post_id] ?? 0) + 1;
  });

  const posts = (data ?? []).map((p: Record<string, unknown>) => ({
    ...p,
    like_count: likeMap[p.id as string] ?? 0,
    comment_count: commentMap[p.id as string] ?? 0,
  }));

  return NextResponse.json({ posts, total: count ?? 0 });
}

// POST /api/qa — create a new Q&A post
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = session.user.role ?? 1;
  if (role < 1) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { title, body, category, content_id } = await req.json();
  if (!title?.trim() || !body?.trim() || !category) {
    return NextResponse.json({ error: 'title, body, category required' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('qa_posts')
    .insert({
      title: title.trim(),
      body: body.trim(),
      category,
      content_id: content_id ?? null,
      author_id: session.user.id,
    })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabaseAdmin.from('activity_logs').insert({
    user_id: session.user.id,
    action: 'post_qa',
    target_type: 'qa_post',
    target_id: data.id,
  });

  return NextResponse.json({ id: data.id });
}
