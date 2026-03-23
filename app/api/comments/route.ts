import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder'
);

// POST /api/comments — create a comment or reply
// Body: { content_id?, qa_post_id?, body, parent_id? }
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const role = session.user.role ?? 1;
  const { content_id, qa_post_id, body, parent_id } = await req.json();

  if (!body?.trim()) {
    return NextResponse.json({ error: 'body required' }, { status: 400 });
  }
  if (!content_id && !qa_post_id) {
    return NextResponse.json({ error: 'content_id or qa_post_id required' }, { status: 400 });
  }
  if (content_id && qa_post_id) {
    return NextResponse.json({ error: 'only one target allowed' }, { status: 400 });
  }

  // Content replies: Level 3+ only
  if (content_id && parent_id && role < 3) {
    return NextResponse.json({ error: 'Level 3 or above required for content replies' }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from('comments')
    .insert({
      content_id: content_id ?? null,
      qa_post_id: qa_post_id ?? null,
      body: body.trim(),
      author_id: session.user.id,
      parent_id: parent_id ?? null,
    })
    .select('id, body, created_at, author_id, parent_id, is_helpful')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabaseAdmin.from('activity_logs').insert({
    user_id: session.user.id,
    action: 'post_comment',
    target_type: content_id ? 'content' : 'qa_post',
    target_id: content_id ?? qa_post_id,
  });

  return NextResponse.json({ comment: data });
}

// DELETE /api/comments?id=xxx
export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { data: comment } = await supabaseAdmin
    .from('comments')
    .select('author_id')
    .eq('id', id)
    .single();

  if (!comment) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const userRole = session.user.role ?? 1;
  if (comment.author_id !== session.user.id && userRole < 3) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await supabaseAdmin.from('comments').delete().eq('id', id);
  return NextResponse.json({ ok: true });
}
