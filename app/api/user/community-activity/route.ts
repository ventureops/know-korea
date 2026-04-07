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

  if (type === 'discussions') {
    const { data, count } = await supabaseAdmin
      .from('qa_posts')
      .select('id, title, category, created_at, is_resolved', { count: 'exact' })
      .eq('author_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    return NextResponse.json({ data: data ?? [], total: count ?? 0 });
  }

  if (type === 'replies') {
    const { data, count } = await supabaseAdmin
      .from('comments')
      .select('id, body, created_at, qa_posts(id, title)', { count: 'exact' })
      .eq('author_id', userId)
      .not('qa_post_id', 'is', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    return NextResponse.json({ data: data ?? [], total: count ?? 0 });
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
}
