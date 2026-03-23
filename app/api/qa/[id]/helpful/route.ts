import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder'
);

// POST /api/qa/[id]/helpful — toggle is_helpful on a comment (Q&A author only)
// Body: { comment_id: string }
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { comment_id } = await req.json();
  if (!comment_id) return NextResponse.json({ error: 'comment_id required' }, { status: 400 });

  // Verify caller is the Q&A post author
  const { data: post } = await supabaseAdmin
    .from('qa_posts')
    .select('author_id')
    .eq('id', params.id)
    .single();

  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (post.author_id !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden — only the question author can mark helpful' }, { status: 403 });
  }

  // Fetch current is_helpful value
  const { data: comment } = await supabaseAdmin
    .from('comments')
    .select('is_helpful')
    .eq('id', comment_id)
    .single();

  if (!comment) return NextResponse.json({ error: 'Comment not found' }, { status: 404 });

  await supabaseAdmin
    .from('comments')
    .update({ is_helpful: !comment.is_helpful })
    .eq('id', comment_id);

  return NextResponse.json({ is_helpful: !comment.is_helpful });
}
