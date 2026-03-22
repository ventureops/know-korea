-- ============================================================
-- Know Korea — Initial Schema
-- SPEC.md §13 기준
-- ============================================================

-- 테이블 1: users
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  nickname      TEXT NOT NULL,
  avatar_url    TEXT,
  role          INTEGER NOT NULL DEFAULT 1,
  -- 1: subscriber | 2: contributor | 3: moderator | 4: admin
  status        TEXT NOT NULL DEFAULT 'active',
  -- 'active' | 'suspended' | 'banned'
  created_at    TIMESTAMPTZ DEFAULT now(),
  last_login_at TIMESTAMPTZ
);

-- 테이블 2: contents
CREATE TABLE contents (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,     -- 영문 소문자 + 하이픈
  category      TEXT NOT NULL,            -- 예: 'life-in-korea'
  excerpt       TEXT,                     -- 카드용 두 줄 요약
  cover_image   TEXT,                     -- 대표 이미지 URL (Cloudinary)
  body_mdx      TEXT,                     -- 본문 MDX
  tags          TEXT[],                   -- 관련글 자동 연결용 태그 배열
  is_published  BOOLEAN DEFAULT false,
  show_bmc      BOOLEAN DEFAULT false,    -- BMC 섹션 노출 여부
  view_count    INTEGER DEFAULT 0,
  author_id     UUID REFERENCES users(id),
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_contents_slug      ON contents(slug);
CREATE INDEX idx_contents_category  ON contents(category);
CREATE INDEX idx_contents_published ON contents(is_published);

-- 테이블 3: qa_posts
CREATE TABLE qa_posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  body          TEXT NOT NULL,            -- TipTap JSON 또는 HTML
  category      TEXT NOT NULL,
  content_id    UUID REFERENCES contents(id),  -- 연관 콘텐츠 (선택)
  author_id     UUID REFERENCES users(id) NOT NULL,
  is_resolved   BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_qa_category ON qa_posts(category);
CREATE INDEX idx_qa_content  ON qa_posts(content_id);

-- 테이블 4: comments
CREATE TABLE comments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  body          TEXT NOT NULL,
  -- 대상 (둘 중 하나만 값 존재)
  content_id    UUID REFERENCES contents(id)  ON DELETE CASCADE,
  qa_post_id    UUID REFERENCES qa_posts(id)  ON DELETE CASCADE,
  -- 대댓글 구조
  parent_id     UUID REFERENCES comments(id)  ON DELETE CASCADE,
  -- NULL = 최상위 댓글 / 값 있음 = 대댓글
  -- 어드민 기능
  is_pinned     BOOLEAN DEFAULT false,         -- Level 4만 지정 가능
  is_helpful    BOOLEAN DEFAULT false,         -- Q&A 질문 작성자만 변경 가능
  author_id     UUID REFERENCES users(id) NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT comments_target_check CHECK (
    (content_id IS NOT NULL)::int + (qa_post_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX idx_comments_content ON comments(content_id);
CREATE INDEX idx_comments_qa      ON comments(qa_post_id);
CREATE INDEX idx_comments_parent  ON comments(parent_id);

-- 테이블 5: likes
CREATE TABLE likes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id)    ON DELETE CASCADE NOT NULL,
  -- 대상 (둘 중 하나만 값 존재)
  content_id    UUID REFERENCES contents(id) ON DELETE CASCADE,
  qa_post_id    UUID REFERENCES qa_posts(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, content_id),
  UNIQUE (user_id, qa_post_id),
  CONSTRAINT likes_target_check CHECK (
    (content_id IS NOT NULL)::int + (qa_post_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX idx_likes_content ON likes(content_id);
CREATE INDEX idx_likes_qa      ON likes(qa_post_id);

-- 테이블 6: content_reads
CREATE TABLE content_reads (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id)    ON DELETE CASCADE NOT NULL,
  content_id    UUID REFERENCES contents(id) ON DELETE CASCADE NOT NULL,
  read_at       TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, content_id)
);

CREATE INDEX idx_reads_user    ON content_reads(user_id);
CREATE INDEX idx_reads_content ON content_reads(content_id);

-- 테이블 7: user_badges
CREATE TABLE user_badges (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  badge_type  TEXT NOT NULL,
  -- 'top_helper' | 'content_creator' | 'early_adopter' | 'active_reader'
  granted_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, badge_type)
);

-- 테이블 8: activity_logs
CREATE TABLE activity_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  -- 'login' | 'view_content' | 'download' | 'post_qa' | 'post_comment'
  target_id   UUID,
  target_type TEXT,   -- 'content' | 'qa_post'
  metadata    JSONB,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_logs_user   ON activity_logs(user_id);
CREATE INDEX idx_logs_action ON activity_logs(action);

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================

ALTER TABLE users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents       ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_posts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_reads  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges    ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs  ENABLE ROW LEVEL SECURITY;

-- 발행된 콘텐츠만 공개
CREATE POLICY "published_contents_public"
  ON contents FOR SELECT
  USING (is_published = true);

-- Level 4만 콘텐츠 작성/수정/삭제
CREATE POLICY "admin_manage_contents"
  ON contents FOR ALL
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 4);

-- Q&A: Level 1 이상 작성
CREATE POLICY "subscribers_insert_qa"
  ON qa_posts FOR INSERT
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) >= 1);

-- Q&A: 전체 공개 열람
CREATE POLICY "qa_posts_public_read"
  ON qa_posts FOR SELECT
  USING (true);

-- 댓글: 전체 공개 열람
CREATE POLICY "comments_public_read"
  ON comments FOR SELECT
  USING (true);

-- 댓글: Level 1 이상 작성
CREATE POLICY "subscribers_insert_comment"
  ON comments FOR INSERT
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) >= 1);

-- 댓글: 본인 또는 Level 3 이상 삭제
CREATE POLICY "delete_comments"
  ON comments FOR DELETE
  USING (
    auth.uid() = author_id
    OR (SELECT role FROM users WHERE id = auth.uid()) >= 3
  );

-- 좋아요: Level 1 이상
CREATE POLICY "authenticated_likes"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 좋아요: 본인 삭제
CREATE POLICY "own_likes_delete"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);

-- 좋아요: 전체 공개 열람
CREATE POLICY "likes_public_read"
  ON likes FOR SELECT
  USING (true);

-- 읽음: 본인 데이터만 접근
CREATE POLICY "own_reads"
  ON content_reads FOR ALL
  USING (auth.uid() = user_id);

-- 배지: 공개 열람
CREATE POLICY "badges_public_read"
  ON user_badges FOR SELECT
  USING (true);

-- 활동 로그: Level 3 이상만 열람
CREATE POLICY "moderator_read_logs"
  ON activity_logs FOR SELECT
  USING ((SELECT role FROM users WHERE id = auth.uid()) >= 3);
