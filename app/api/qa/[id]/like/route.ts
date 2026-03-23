import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder'
);

// POST /api/qa/[id]/like — toggle like
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const qaId = params.id;
  const userId = session.user.id;

  const { data: existing } = await supabaseAdmin
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('qa_post_id', qaId)
    .single();

  if (existing) {
    await supabaseAdmin.from('likes').delete().eq('id', existing.id);
  } else {
    await supabaseAdmin.from('likes').insert({ user_id: userId, qa_post_id: qaId });
  }

  const { count } = await supabaseAdmin
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('qa_post_id', qaId);

  return NextResponse.json({ liked: !existing, count: count ?? 0 });
}
