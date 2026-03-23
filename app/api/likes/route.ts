import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder'
);

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { content_id } = await req.json();
  if (!content_id) return NextResponse.json({ error: 'content_id required' }, { status: 400 });

  const userId = session.user.id;

  const { data: existing } = await supabaseAdmin
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('content_id', content_id)
    .single();

  if (existing) {
    await supabaseAdmin.from('likes').delete().eq('id', existing.id);
    const { count } = await supabaseAdmin
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('content_id', content_id);
    return NextResponse.json({ liked: false, count: count ?? 0 });
  } else {
    await supabaseAdmin.from('likes').insert({ user_id: userId, content_id });
    await supabaseAdmin.from('activity_logs').insert({
      user_id: userId,
      action: 'like',
      target_type: 'content',
      target_id: content_id,
    }).single();
    const { count } = await supabaseAdmin
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('content_id', content_id);
    return NextResponse.json({ liked: true, count: count ?? 0 });
  }
}
