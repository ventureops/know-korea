import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder'
);

// GET /api/qa/[id] — fetch single Q&A post
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { data, error } = await supabaseAdmin
    .from('qa_posts')
    .select('id, title, body, category, is_resolved, created_at, author_id')
    .eq('id', params.id)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}

// PUT /api/qa/[id] — update Q&A post
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: post } = await supabaseAdmin
    .from('qa_posts')
    .select('author_id')
    .eq('id', params.id)
    .single();

  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const isAuthor = post.author_id === session.user.id;
  const isAdmin = (session.user.role ?? 0) >= 4;
  if (!isAuthor && !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { title, body, category } = await req.json();
  if (!title?.trim() || !body?.trim()) {
    return NextResponse.json({ error: 'title and body required' }, { status: 400 });
  }

  const updateData: Record<string, unknown> = {
    title: title.trim(),
    body: body.trim(),
    updated_at: new Date().toISOString(),
  };
  if (category) updateData.category = category;

  const { error } = await supabaseAdmin
    .from('qa_posts')
    .update(updateData)
    .eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

// DELETE /api/qa/[id] — delete Q&A post
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: post } = await supabaseAdmin
    .from('qa_posts')
    .select('author_id')
    .eq('id', params.id)
    .single();

  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const isAuthor = post.author_id === session.user.id;
  const isAdmin = (session.user.role ?? 0) >= 4;
  if (!isAuthor && !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  // Delete related comments and likes first
  await supabaseAdmin.from('comments').delete().eq('qa_post_id', params.id);
  await supabaseAdmin.from('likes').delete().eq('qa_post_id', params.id);
  const { error } = await supabaseAdmin.from('qa_posts').delete().eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
