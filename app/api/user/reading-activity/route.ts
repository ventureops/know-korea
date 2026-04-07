import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder'
);

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const limit = parseInt(searchParams.get('limit') ?? '10');
  const offset = parseInt(searchParams.get('offset') ?? '0');
  const userId = session.user.id;

  if (type === 'reads') {
    const { data } = await supabaseAdmin
      .from('content_reads')
      .select('id, created_at, contents(title, slug, category)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    return NextResponse.json({ data: data ?? [] });
  }

  if (type === 'saves') {
    const { data } = await supabaseAdmin
      .from('content_saves')
      .select('id, created_at, content_id, contents(title, slug, category)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    return NextResponse.json({ data: data ?? [] });
  }

  if (type === 'likes') {
    const { data } = await supabaseAdmin
      .from('likes')
      .select('id, created_at, contents(title, slug, category)')
      .eq('user_id', userId)
      .not('content_id', 'is', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    return NextResponse.json({ data: data ?? [] });
  }

  if (type === 'comments') {
    const { data } = await supabaseAdmin
      .from('comments')
      .select('id, body, created_at, contents(title, slug, category)')
      .eq('author_id', userId)
      .is('parent_id', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    return NextResponse.json({ data: data ?? [] });
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
}
