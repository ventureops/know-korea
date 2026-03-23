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

  const { nickname, avatar_url } = await req.json();
  if (!nickname?.trim()) return NextResponse.json({ error: 'Nickname required' }, { status: 400 });

  const { error } = await supabaseAdmin
    .from('users')
    .update({ nickname: nickname.trim(), avatar_url: avatar_url ?? null })
    .eq('email', session.user.email);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
