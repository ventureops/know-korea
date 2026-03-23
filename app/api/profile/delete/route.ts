import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder'
);

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Anonymize: set nickname to 'Deleted User', clear email/avatar, mark status banned
  await supabaseAdmin
    .from('users')
    .update({ nickname: 'Deleted User', avatar_url: null, status: 'banned' })
    .eq('email', session.user.email);

  return NextResponse.json({ ok: true });
}
