import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getSession } from '@/lib/auth';
import QACommentSection, { type QAComment } from '@/components/qa/QACommentSection';
import QAActions from '@/components/qa/QAActions';
import QAEditDelete from '@/components/qa/QAEditDelete';
import { optimizeBodyImages } from '@/lib/cloudinary';
import { CATEGORY_LABELS } from '@/lib/categories';
import KoFiButton from '@/components/KoFiButton';

export const revalidate = 300; // 5분마다 재생성

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder'
);

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { data } = await supabaseAdmin
    .from('qa_posts')
    .select('title')
    .eq('id', params.id)
    .single();

  if (!data) return { title: 'Community | Know Korea' };
  return { title: `${data.title} | Know Korea Community` };
}

export default async function CommunityDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession();

  const { data: post } = await supabaseAdmin
    .from('qa_posts')
    .select(`
      id, title, body, category, content_id, is_resolved, created_at, updated_at, author_id,
      users(nickname, avatar_url)
    `)
    .eq('id', params.id)
    .single();

  if (!post) notFound();

  const categoryLabel = CATEGORY_LABELS[post.category] ?? post.category.replace(/-/g, ' ');

  // Like count + user like status
  const { count: likeCount } = await supabaseAdmin
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('qa_post_id', params.id);

  let isLiked = false;
  if (session?.user?.id) {
    const { data: liked } = await supabaseAdmin
      .from('likes')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('qa_post_id', params.id)
      .single();
    isLiked = !!liked;
  }

  // Fetch comments + replies
  const { data: commentsRaw } = await supabaseAdmin
    .from('comments')
    .select('id, body, created_at, author_id, parent_id, is_helpful, users(nickname, avatar_url)')
    .eq('qa_post_id', params.id)
    .order('created_at', { ascending: true });

  const comments: QAComment[] = ((commentsRaw ?? []) as unknown[]).map((raw: unknown) => {
    const r = raw as {
      id: string; body: string; created_at: string; author_id: string;
      parent_id: string | null; is_helpful: boolean;
      users: Array<{ nickname: string; avatar_url: string | null }> | { nickname: string; avatar_url: string | null } | null;
    };
    const usersVal = Array.isArray(r.users) ? (r.users[0] ?? null) : r.users;
    return { id: r.id, body: r.body, created_at: r.created_at, author_id: r.author_id, parent_id: r.parent_id, is_helpful: r.is_helpful, users: usersVal };
  });

  // Linked content
  let linkedContent: { title: string; slug: string; category: string } | null = null;
  if (post.content_id) {
    const { data: content } = await supabaseAdmin
      .from('contents')
      .select('title, slug, category')
      .eq('id', post.content_id)
      .single();
    linkedContent = content;
  }

  const postUsers = Array.isArray(post.users) ? (post.users[0] ?? null) : post.users;

  return (
    <div className="px-5 md:px-8 py-8 max-w-3xl mr-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-body text-on-surface-variant mb-6">
        <Link href="/" className="hover:text-on-surface transition-colors">Know Korea</Link>
        <span className="text-outline">›</span>
        <Link href="/community" className="hover:text-on-surface transition-colors">Community</Link>
        <span className="text-outline">›</span>
        <span className="text-on-surface font-medium line-clamp-1">{post.title}</span>
      </nav>

      {/* Question */}
      <article>
        <header className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-label font-bold uppercase tracking-wider bg-primary/10 text-primary">
              {categoryLabel}
            </span>
            {post.is_resolved && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-label font-bold uppercase tracking-wider bg-success/10 text-success">
                <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Resolved
              </span>
            )}
          </div>
          <h1 className="font-headline font-extrabold text-2xl md:text-3xl text-on-surface tracking-tight leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-xs font-label text-outline">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-surface-container-high overflow-hidden flex items-center justify-center">
                {postUsers?.avatar_url ? (
                  <img src={postUsers.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-[9px]">{(postUsers?.nickname ?? '?')[0].toUpperCase()}</span>
                )}
              </div>
              <span className="text-on-surface-variant font-medium">{postUsers?.nickname ?? 'Unknown'}</span>
            </div>
            <span>·</span>
            <span>{formatDate(post.created_at)}</span>
          </div>
          {/* Edit / Delete — author or Admin only */}
          {session?.user?.id && (post.author_id === session.user.id || (session.user.role ?? 0) >= 4) && (
            <div className="mt-4">
              <QAEditDelete qaId={params.id} />
            </div>
          )}
        </header>

        {/* Linked content notice */}
        {linkedContent && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-surface-container-low flex items-center gap-3">
            <span className="material-symbols-outlined text-[18px] text-primary">article</span>
            <p className="text-sm font-body text-on-surface-variant">
              Related to:{' '}
              <Link
                href={`/${linkedContent.category}/${linkedContent.slug}`}
                className="text-primary font-bold hover:underline"
              >
                {linkedContent.title}
              </Link>
            </p>
          </div>
        )}

        {/* Body */}
        <div
          className="prose-custom font-body text-on-surface leading-relaxed space-y-4 mb-8"
          dangerouslySetInnerHTML={{ __html: optimizeBodyImages(post.body) }}
        />

        {/* Actions: like + solved toggle */}
        <QAActions
          qaId={params.id}
          authorId={post.author_id}
          initialLiked={isLiked}
          initialLikeCount={likeCount ?? 0}
          initialResolved={post.is_resolved}
          sessionUserId={session?.user?.id}
        />
      </article>

      {/* Ko-fi — always shown on Community detail */}
      <section className="mt-16 p-8 rounded-2xl bg-[#2D456E] flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl overflow-hidden relative">
        {/* 배경 장식 아이콘 */}
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'wght' 100" }}>
            coffee
          </span>
        </div>

        {/* 텍스트 */}
        <div className="z-10 text-center md:text-left">
          <h4 className="text-2xl font-bold text-white mb-2">Was this helpful?</h4>
          <p className="text-white/70 text-sm max-w-md">
            Our curators work hard to provide accurate info for the expat community.
            Support us with a coffee!
          </p>
        </div>

        <KoFiButton size="lg" className="z-10" />
      </section>

      {/* Comments / Answers */}
      <QACommentSection
        qaPostId={params.id}
        qaAuthorId={post.author_id}
        initialComments={comments}
      />
    </div>
  );
}
