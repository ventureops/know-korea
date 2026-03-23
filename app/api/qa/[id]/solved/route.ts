import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder'
);

// POST /api/qa/[id]/solved — toggle is_resolved (author only)
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: post } = await supabaseAdmin
    .from('qa_posts')
    .select('author_id, is_resolved')
    .eq('id', params.id)
    .single();

  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (post.author_id !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await supabaseAdmin
    .from('qa_posts')
    .update({ is_resolved: !post.is_resolved })
    .eq('id', params.id);

  return NextResponse.json({ is_resolved: !post.is_resolved });
}
