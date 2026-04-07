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
    .from('content_saves')
    .select('id')
    .eq('user_id', userId)
    .eq('content_id', content_id)
    .single();

  if (existing) {
    await supabaseAdmin.from('content_saves').delete().eq('id', existing.id);
    return NextResponse.json({ saved: false });
  } else {
    await supabaseAdmin.from('content_saves').insert({ user_id: userId, content_id });
    return NextResponse.json({ saved: true });
  }
}
