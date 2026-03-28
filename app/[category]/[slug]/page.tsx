import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import type { Content } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { cloudinaryUrl, optimizeBodyImages } from "@/lib/cloudinary";
import { createClient } from "@supabase/supabase-js";
import ReadButton from "@/components/content/ReadButton";
import LikeButton from "@/components/content/LikeButton";
import CommentSection from "@/components/content/CommentSection";
import ViewTracker from "@/components/content/ViewTracker";
import { CATEGORY_LABELS } from "@/lib/categories";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder"
);

export const revalidate = 600; // 10분마다 재생성

function estimateReadTime(body: string | null): string {
  if (!body) return "3 min read";
  const words = body.replace(/<[^>]+>/g, "").split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// slug 생성: 텍스트 → URL-safe id
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "") // 내부 HTML 태그 제거
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// Extract h2/h3 headings from body HTML for ToC
// - id 속성이 있으면 그대로 사용
// - id 없으면 텍스트에서 자동 생성
function extractToc(body: string | null): { id: string; label: string; level: 2 | 3 }[] {
  if (!body) return [];
  const result: { id: string; label: string; level: 2 | 3 }[] = [];
  const re = /<(h2|h3)[^>]*>([\s\S]*?)<\/\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    const inner = m[2];
    const idMatch = m[0].match(/id="([^"]+)"/);
    const label = inner.replace(/<[^>]+>/g, "").trim();
    if (!label) continue;
    const id = idMatch ? idMatch[1] : slugify(label);
    const level = m[1].toLowerCase() === "h2" ? 2 : 3;
    result.push({ id, label, level });
  }
  return result;
}

// heading에 id가 없으면 자동 주입
function injectHeadingIds(body: string): string {
  return body.replace(/<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, inner) => {
    if (/id="/.test(attrs)) return match;
    const label = inner.replace(/<[^>]+>/g, "").trim();
    const id = slugify(label);
    if (!id) return match;
    return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
  });
}

// ── generateMetadata ─────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { category: string; slug: string };
}): Promise<Metadata> {
  const { data } = await supabase
    .from("contents")
    .select("title, excerpt, cover_image")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!data) return { title: "Know Korea" };

  const title = `${data.title} | Know Korea`;
  const description = data.excerpt ?? "Practical guides for expats in Korea.";
  const url = `https://know-korea.vercel.app/${params.category}/${params.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Know Korea",
      type: "article",
      images: data.cover_image
        ? [{ url: data.cover_image, width: 800, height: 450 }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: data.cover_image ? [data.cover_image] : undefined,
    },
  };
}

// ── Page ──────────────────────────────────────────────────────
export default async function ContentDetailPage({
  params,
}: {
  params: { category: string; slug: string };
}) {
  // Fetch main content
  const { data: article } = await supabase
    .from("contents")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single<Content>();

  if (!article) notFound();

  // Related articles: same category + overlapping tags, exclude self
  let relatedArticles: Content[] = [];
  if (article.tags && article.tags.length > 0) {
    const { data: related } = await supabase
      .from("contents")
      .select("id, title, slug, category, body_mdx, tags")
      .eq("is_published", true)
      .eq("category", article.category)
      .neq("slug", article.slug)
      .limit(4);

    // Sort by tag overlap (client-side since Supabase doesn't do array intersection easily)
    const scored = (related ?? []).map((r) => {
      const overlap = (r.tags ?? []).filter((t: string) =>
        (article.tags ?? []).includes(t)
      ).length;
      return { ...r, overlap };
    });
    scored.sort((a, b) => b.overlap - a.overlap);
    relatedArticles = scored.slice(0, 2) as unknown as Content[];
  }

  if (relatedArticles.length < 2) {
    // Fall back: just grab latest in same category
    const { data: fallback } = await supabase
      .from("contents")
      .select("id, title, slug, category, body_mdx, tags")
      .eq("is_published", true)
      .eq("category", article.category)
      .neq("slug", article.slug)
      .order("created_at", { ascending: false })
      .limit(2);
    relatedArticles = (fallback ?? []) as unknown as Content[];
  }

  const bodyHtml = article.body_mdx
    ? optimizeBodyImages(injectHeadingIds(article.body_mdx))
    : null;
  const toc = extractToc(bodyHtml);
  const categoryLabel =
    CATEGORY_LABELS[article.category] ?? article.category.replace(/-/g, " ");

  // Check read/like status for current user
  const session = await getSession();
  let isRead = false;
  let isLiked = false;
  let likeCount = 0;

  const { count: lc } = await supabaseAdmin
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("content_id", article.id);
  likeCount = lc ?? 0;

  if (session?.user?.id) {
    const [{ data: readData }, { data: likeData }] = await Promise.all([
      supabaseAdmin
        .from("content_reads")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("content_id", article.id)
        .single(),
      supabaseAdmin
        .from("likes")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("content_id", article.id)
        .single(),
    ]);
    isRead = !!readData;
    isLiked = !!likeData;
  }

  // Fetch comments
  const { data: commentsRaw } = await supabaseAdmin
    .from("comments")
    .select("id, body, created_at, author_id, users(nickname, avatar_url)")
    .eq("content_id", article.id)
    .is("parent_id", null)
    .order("created_at", { ascending: true });
  type CommentRow = {
    id: string;
    body: string;
    created_at: string;
    author_id: string;
    users: { nickname: string; avatar_url: string | null } | null;
  };
  const comments = ((commentsRaw ?? []) as unknown[]).map((raw: unknown) => {
    const r = raw as { id: string; body: string; created_at: string; author_id: string; users: Array<{ nickname: string; avatar_url: string | null }> | { nickname: string; avatar_url: string | null } | null };
    const usersVal = Array.isArray(r.users) ? (r.users[0] ?? null) : r.users;
    return { id: r.id, body: r.body, created_at: r.created_at, author_id: r.author_id, users: usersVal } as CommentRow;
  });

  return (
    <div className="px-5 md:px-8 py-8 max-w-6xl mx-auto">
      <ViewTracker slug={params.slug} />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-body text-on-surface-variant mb-6">
        <Link href="/" className="hover:text-on-surface transition-colors">
          Know Korea
        </Link>
        <span className="text-outline">›</span>
        <Link
          href={`/${article.category}`}
          className="hover:text-on-surface transition-colors"
        >
          {categoryLabel}
        </Link>
        <span className="text-outline">›</span>
        <span className="text-on-surface font-medium line-clamp-1">
          {article.title}
        </span>
      </nav>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Main Content */}
        <article className="lg:col-span-8">
          {/* Header */}
          <header className="mb-8">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-label font-bold uppercase tracking-wider bg-primary/10 text-primary mb-3">
              {categoryLabel}
            </span>
            <h1 className="font-headline font-extrabold text-3xl md:text-4xl text-on-surface tracking-tight leading-tight mb-3">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="text-base font-body text-on-surface-variant leading-relaxed mb-4">
                {article.excerpt}
              </p>
            )}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4 text-xs font-label text-outline">
                <span>{estimateReadTime(article.body_mdx)}</span>
                <span>·</span>
                <span>{formatDate(article.updated_at)}</span>
                <span>·</span>
                <span>{article.view_count.toLocaleString()} views</span>
              </div>
              <ReadButton contentId={article.id} initialRead={isRead} />
            </div>
          </header>

          {/* Hero Image */}
          {article.cover_image && (
            <div className="rounded-2xl overflow-hidden mb-8 h-64 md:h-80 bg-surface-container">
              <img
                src={cloudinaryUrl(article.cover_image, "cover")}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full text-xs font-label text-on-surface-variant bg-surface-container"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Article Body */}
          {bodyHtml ? (
            <div
              className="prose-custom font-body text-on-surface leading-relaxed space-y-4 mb-10"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          ) : (
            <p className="text-on-surface-variant font-body mb-10">
              Content coming soon.
            </p>
          )}

          {/* Like / Share actions */}
          <div className="flex items-center gap-3 py-6 mb-6">
            <LikeButton contentId={article.id} initialLiked={isLiked} initialCount={likeCount} />
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all active:scale-95">
              <span className="material-symbols-outlined text-[18px]">share</span>
              <span className="text-sm font-body font-medium">Share</span>
            </button>
          </div>

          {/* BMC Section */}
          {article.show_bmc && (
            <div
              className="rounded-3xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-4"
              style={{ backgroundColor: "#2D456E" }}
            >
              <div>
                <p className="text-xs font-label font-bold uppercase tracking-widest text-on-primary/60 mb-1">
                  Was this helpful?
                </p>
                <p className="font-headline font-bold text-lg text-on-primary mb-1">
                  Support Know Korea
                </p>
                <p className="text-sm font-body text-on-primary/70">
                  Help us keep guides free and up to date.
                </p>
              </div>
              <a
                href="https://www.buymeacoffee.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-body font-bold text-sm transition-all active:scale-95 hover:opacity-90 shrink-0"
                style={{ backgroundColor: "#E9C48C", color: "#2D456E" }}
              >
                <span>☕</span>
                Buy Me a Coffee
              </a>
            </div>
          )}

          <CommentSection contentId={article.id} initialComments={comments} />

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mb-8">
              <h2 className="font-headline font-bold text-lg text-on-surface mb-4">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/${rel.category}/${rel.slug}`}
                    className="group bg-surface-container-lowest rounded-2xl p-4 shadow-sm hover:shadow-xl border border-outline-variant/15 transition-all"
                  >
                    <h3 className="font-headline font-bold text-sm text-on-surface leading-snug mb-1 group-hover:text-primary transition-colors">
                      {rel.title}
                    </h3>
                    <span className="text-xs font-label text-outline">
                      {estimateReadTime(rel.body_mdx)}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>

        {/* Sidebar */}
        <aside className="hidden lg:block lg:col-span-4">
          <div className="sticky top-20 space-y-6">
            {/* Ask a question CTA */}
            <div className="bg-surface-container-low rounded-2xl p-5">
              <p className="text-xs font-label font-bold uppercase tracking-wider text-outline mb-2">
                Have a question?
              </p>
              <p className="text-sm font-body text-on-surface-variant mb-4 leading-relaxed">
                Have a specific question about this topic? Our community is here
                to help.
              </p>
              <Link
                href="/qa/new"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary text-on-primary font-body font-bold text-sm hover:bg-primary-dim transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">
                  add
                </span>
                Ask a Question
              </Link>
            </div>

            {/* Table of Contents */}
            {toc.length > 0 && (
              <div className="bg-surface-container-low rounded-2xl p-5">
                <p className="text-xs font-label font-bold uppercase tracking-wider text-outline mb-3">
                  In this article
                </p>
                <nav className="space-y-1">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block text-sm font-body text-on-surface-variant hover:text-on-surface transition-colors py-1 leading-snug ${
                        item.level === 2
                          ? "font-bold pl-0"
                          : "font-normal pl-4"
                      }`}
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>
            )}

          </div>
        </aside>
      </div>
    </div>
  );
}
