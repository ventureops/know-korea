import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder'
);

// POST /api/reads — toggle read status
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { content_id } = await req.json();
  if (!content_id) return NextResponse.json({ error: 'content_id required' }, { status: 400 });

  const userId = session.user.id;

  // Check existing
  const { data: existing } = await supabaseAdmin
    .from('content_reads')
    .select('id')
    .eq('user_id', userId)
    .eq('content_id', content_id)
    .single();

  if (existing) {
    // Remove read
    await supabaseAdmin.from('content_reads').delete().eq('id', existing.id);
    return NextResponse.json({ read: false });
  } else {
    // Add read
    await supabaseAdmin.from('content_reads').insert({ user_id: userId, content_id });
    // Log activity
    await supabaseAdmin.from('activity_logs').insert({
      user_id: userId,
      action: 'mark_read',
      target_type: 'content',
      target_id: content_id,
    }).single();
    return NextResponse.json({ read: true });
  }
}
