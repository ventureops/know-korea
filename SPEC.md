
# 개발 사양서 — Know Korea
> 버전: v5.0 | 작성일: 2026-03-22 목적: 외국인을 위한 한국 생활 정보 콘텐츠 플랫폼
---
## 1. 프로젝트 개요
### 서비스 한 줄 정의
> Discover Curated Korea Insights — 한국에 사는, 혹은 살고자 하는 외국인을 위한 실용 정보 허브
### 핵심 사용자
- 한국 거주 외국인 (장기 체류자)
- 한국 취업 / 이민 준비 중인 외국인
- 한국 여행자 (단기 트래픽)
### 수익 모델
- Buy Me a Coffee (BMC) 후원
- 추후 컨설팅 / 서비스 연결 CTA
---
## 2. 기술 스택
|항목|선택|비고|
|---|---|---|
|프레임워크|Next.js 14 (App Router)|SSG/ISR, SEO 최적화|
|스타일링|Tailwind CSS|반응형, 빠른 개발|
|인증|NextAuth.js|Google / Apple OAuth|
|DB|Supabase (PostgreSQL)|무료, RLS, 실시간|
|콘텐츠 관리|MDX 파일 (Phase 1)|초기 수동 배포로 시작|
|에디터 — 콘텐츠|BlockNote|Admin(Level 4) 전용|
|에디터 — Q&A|TipTap|Level 1 이상|
|에디터 — 댓글|순수 Textarea|Level 1 이상|
|이미지|Cloudinary (무료)|자동 최적화|
|배포|Vercel|Next.js 최적 환경|

## 3. 회원 권한 체계 (5단계)
⚠️ 전체 시스템의 기준이 되는 핵심 정의. DB, RLS, UI 모두 이 체계를 따릅니다.

|Level|이름|핵심 권한|
|---|---|---|
|0|Visitor|콘텐츠 열람만 가능|
|1|Subscriber|댓글, Q&A, 좋아요, 읽음 표시|
|2|Contributor|Level 1 + 향후 카테고리 글쓰기 권한 (예정)|
|3|Moderator|Level 2 + 댓글 삭제, Q&A 중재, 회원 모니터링|
|4|Admin|전체 권한. 콘텐츠 작성, 회원 권한 변경, 시스템 설정|
### 기능별 권한 매핑
|기능|Level 0|Level 1|Level 2|Level 3|Level 4|
|---|:-:|:-:|:-:|:-:|:-:|
|콘텐츠 열람|✅|✅|✅|✅|✅|
|좋아요 / 읽음 표시|❌|✅|✅|✅|✅|
|댓글 작성|❌|✅|✅|✅|✅|
|콘텐츠 대댓글|❌|❌|❌|✅|✅|
|Q&A 작성 / 댓글 / 대댓글|❌|✅|✅|✅|✅|
|댓글 고정|❌|❌|❌|❌|✅|
|타인 댓글 삭제|❌|❌|❌|✅|✅|
|콘텐츠 작성 / 발행|❌|❌|❌|❌|✅|
|회원 권한 변경|❌|❌|❌|❌|✅|
|계정 정지 (Suspend)|❌|❌|❌|✅|✅|
|계정 영구 정지 (Ban)|❌|❌|❌|❌|✅|
|어드민 대시보드 접근|❌|❌|❌|✅|✅|

## 4. 레이아웃 구조
```
┌──────────────────────────────────────────────────┐
│                  Top Navigation                   │
│  [로고][Home][Q&A][About]   [검색][Login/프로필]  │
│  ← 좌측: 로고+링크          우측: 검색+인증 →     │
├────────────┬─────────────────────────────────────┤
│            │                                     │
│    Left    │           Main Content              │
│   Sidebar  │                                     │
│            │  (홈 / 카테고리 목록 / 콘텐츠 상세)  │
│  카테고리   │                                     │
│  12개 리스트│                                     │
│            │                                     │
└────────────┴─────────────────────────────────────┘
```
### Top Navigation
|위치|요소|
|---|---|
|좌측|로고(→ 홈 이동) + 메인 링크 (Home / Q&A / About)|
|우측|검색 아이콘 또는 검색 입력 + Login(또는 프로필 아이콘)|
- FAQ는 Top Nav에 포함하지 않음 (별도 `/faq` 페이지로 접근)
- 비로그인: `Login` 텍스트 링크 → `/login` 이동
- 로그인 후: 프로필 아이콘(사진 또는 이니셜) → 드롭다운 (프로필 / 알림 / 로그아웃)
### Left Sidebar
- 카테고리 12개 리스트
- 카테고리 클릭 → Main 영역에 해당 콘텐츠 카드 목록
- 로그인 회원: 카드에 읽음 현황 표시
- 모바일: 햄버거 메뉴로 토글
- 하단: Settings 링크
---
## 5. 페이지 목록 및 라우팅
|페이지|경로|비고|
|---|---|---|
|홈|`/`|Hero + 추천 콘텐츠 + 카테고리 요약|
|카테고리 목록|`/[category]`|콘텐츠 카드 그리드|
|콘텐츠 상세|`/[category]/[slug]`|본문 + 관련글 + Q&A|
|Q&A 목록|`/qa`|전체 Q&A 피드|
|Q&A 작성|`/qa/new`|Level 1 이상 접근|
|Q&A 상세|`/qa/[id]`|Q&A 본문 + 댓글|
|About|`/about`|사이트 소개|
|FAQ|`/faq`|자주 묻는 질문|
|법적 고지|`/legal`|Privacy Policy + ToS|
|로그인|`/login`|소셜 로그인 (Google / Apple)|
|회원가입|`/signup`|소셜 가입 + 혜택 안내|
|검색 결과|`/search`|전체 콘텐츠 + Q&A 통합 검색|
|알림|`/notifications`|활동 피드, Level 1 이상|
|프로필|`/profile`|Level 1 이상 접근|
|프로필 수정|`/profile/edit`|닉네임 / 사진 수정, Level 1 이상|
|활동 내역|`/profile/activities`|내 댓글 / 좋아요 / 읽음 이력|
|어드민 대시보드|`/admin`|Level 3 이상 접근|
|어드민 — 콘텐츠|`/admin/contents`|Level 4만|
|어드민 — 콘텐츠 에디터|`/admin/contents/editor`|BlockNote, Level 4만|
|어드민 — 회원|`/admin/users`|Level 3 이상|
|어드민 — 회원 상세|`/admin/users/[id]`|참여 지표 + 배지 + 활동 로그|
|어드민 — Q&A 관리|`/admin/qa`|Q&A 중재, Level 3 이상|

## 6. 홈 페이지 (`/`)
### Hero Section
- 헤드라인: **Discover Curated Korea Insights**
- 서브카피: Practical guides for foreigners living, working, and thriving in Korea
- CTA 버튼 2개: `Start Here` → `/start-here` | `Ask a Question` → `/qa/new`
### 추천 콘텐츠
- **인기 가이드**: `view_count` 기준 상위 4개 카드
- **실용 정보**: Practical Guide 카테고리 최신 4개 카드
### 카테고리 요약
- Life / Work / Visa 카테고리를 아이콘 + 한 줄 설명 카드로 표시
- 클릭 시 해당 카테고리 페이지 이동
---
## 7. 카테고리 목록 페이지 (`/[category]`)
### 콘텐츠 카드 구조
```
┌──────────────────────────┐
│  [대표 이미지]            │
├──────────────────────────┤
│  카테고리 태그            │
│  **콘텐츠 제목**          │
│  두 줄 미리보기 (excerpt) │
│  읽기 시간 · 날짜    [읽음]│
└──────────────────────────┘
```
- 그리드: 데스크탑 3열 / 태블릿 2열 / 모바일 1열
- 읽음 버튼: Level 1 이상에만 표시. 클릭 시 녹색 전환, 재클릭 시 취소
- 비로그인: 읽음 버튼 비노출
---
## 8. 콘텐츠 상세 페이지 (`/[category]/[slug]`)
### 페이지 구성 순서
```
① 콘텐츠 본문
   - 제목 / 날짜 / 읽기 시간
   - [읽음] 버튼 (우측 상단, Level 1 이상)
   - 본문 (MDX 렌더링)
   - 좋아요 (Level 1 이상, 비로그인 시 로그인 유도)
   - BMC 섹션 (Admin이 on 설정한 경우만)
② 댓글
   - Level 1 이상: 댓글 작성 (Textarea)
   - Level 3 이상: 대댓글 가능
   - Level 4: 고정 댓글 지정 (상단 고정 표시)
   - Level 3 이상: 타인 댓글 삭제
③ 관련 글 (자동 2개)
   - 같은 카테고리 + 공통 태그 기준 추천
④ 관련 Q&A (자동 2개)
   - 해당 콘텐츠와 연결된 Q&A (content_id 기준)
⑤ CTA 영역
   - [Ask a Question] 버튼 → /qa/new
   - BMC 버튼
```
---
## 9. Q&A 기능
### Q&A 목록 (`/qa`)
- 최신순 피드
- 카드: 제목 / 카테고리 태그 / 작성자 / 날짜 / 좋아요 수 / 댓글 수 / 해결됨 여부
### Q&A 작성 (`/qa/new`)
- Level 1 이상만 접근
- TipTap 에디터 사용
- 카테고리 선택 필수
- 연관 콘텐츠 링크 선택 (선택)
### Q&A 상세 (`/qa/[id]`)
```
① 질문 본문
   - 좋아요 (Level 1 이상)
   - 해결됨 표시 (질문 작성자만)
② 댓글 / 대댓글
   - Level 1 이상: 댓글 + 대댓글 모두 가능
   - 댓글별 [도움됨] 버튼 (질문 작성자만 클릭 가능)
   - [도움됨] 10회 이상 → Top Helper 배지 산정
③ BMC 섹션 (매 Q&A 상세 페이지마다 자동 노출)
   "Was this helpful? ☕ Buy me a coffee — Help keep this content free"
```
---
## 10. 인증 및 프로필
### 로그인
- Google OAuth / Apple OAuth (NextAuth.js)
- 비밀번호 없음 — 소셜 로그인만 지원
### 프로필 (`/profile`, Level 1 이상)
- 닉네임 수정
- 프로필 사진 업로드 / 수정 (Cloudinary)
- 개인정보 보호 안내 문구 (Reddit 스타일)
- 계정 삭제 (→ 데이터 익명화, 게시물은 "Deleted User"로 유지)
- 내 배지 목록 표시
---
## 11. 어드민 기능
### 어드민 대시보드 (`/admin`, Level 3 이상)
**회원 관리 (`/admin/users`)**

| 기능            | Level 3 | Level 4 |
| ------------- | :-----: | :-----: |
| 회원 리스트 / 검색   |    ✅    |    ✅    |
| 참여 지표 / 배지 확인 |    ✅    |    ✅    |
| 계정 Suspend    |    ✅    |    ✅    |
| 권한 레벨 변경      |    ❌    |    ✅    |
| 계정 영구 Ban     |    ❌    |    ✅    |
**콘텐츠 관리 (`/admin/contents`, Level 4만)**
- BlockNote 에디터로 콘텐츠 작성 / 수정
- 발행 / 비공개 전환
- BMC 섹션 콘텐츠별 on/off
- 댓글 고정 지정 / 해제
**데이터 현황 (Level 3 이상)**
- 전체 회원 수 / 신규 가입 추이
- 페이지별 조회수
- 좋아요 현황
- 로그인 이력 / 다운로드 이력
---
## 12. 콘텐츠 카테고리 (12개)
|#|카테고리|경로|핵심 항목|
|---|---|---|---|
|1|Start Here|`/start-here`|한국 입문 가이드|
|2|Language|`/language`|생존 / 비즈니스 / 문화 한국어|
|3|Life in Korea|`/life-in-korea`|주거 / 교통 / 의료 / 통신|
|4|Work & Business|`/work-business`|취업 / 회사문화 / 창업 / 세금|
|5|Practical Guide|`/practical-guide`|비자 / 계좌 / 카드 / 계약|
|6|Culture & Society|`/culture-society`|인간관계 / Do & Don't|
|7|Travel & Places|`/travel-places`|지역 / 관광 / 숨은 명소|
|8|History & Politics|`/history-politics`|현대사 / 정치 / 남북|
|9|Economy & Money|`/economy-money`|물가 / 연봉 / 부동산|
|10|Comparison|`/comparison`|한국 vs 해외 (SEO 강화 카테고리)|
|11|Real Stories|`/real-stories`|외국인 경험담 / 정착 스토리|
|12|Tools & Resources|`/tools-resources`|앱 / 번역 / 필수 서비스|
**콘텐츠 제작 원칙**
- 1페이지 = 1 검색 의도
- 분량: 3~7분 읽기
- 모든 페이지: 관련글 2개 + 관련 Q&A 2개 자동 연결
---
## 13. Supabase DB 스키마
### 전체 테이블 관계
```
users
 ├── contents          (author_id → Level 4만 작성)
 ├── qa_posts          (author_id → Level 1 이상 작성)
 ├── comments          (콘텐츠 댓글 + Q&A 댓글 통합)
 ├── likes             (콘텐츠 좋아요 + Q&A 좋아요 통합)
 ├── content_reads     (읽음 표시)
 ├── user_badges       (배지)
 └── activity_logs     (행동 추적)
```
---
### 테이블 1 — `users`
```sql
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
```
---
### 테이블 2 — `contents`
```sql
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
CREATE INDEX idx_contents_slug     ON contents(slug);
CREATE INDEX idx_contents_category ON contents(category);
CREATE INDEX idx_contents_published ON contents(is_published);
```
---
### 테이블 3 — `qa_posts`
```sql
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
```
---
### 테이블 4 — `comments`
```sql
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
  -- Top Helper 배지 산정에 사용
  author_id     UUID REFERENCES users(id) NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT comments_target_check CHECK (
    (content_id IS NOT NULL)::int + (qa_post_id IS NOT NULL)::int = 1
  )
);
CREATE INDEX idx_comments_content ON comments(content_id);
CREATE INDEX idx_comments_qa      ON comments(qa_post_id);
CREATE INDEX idx_comments_parent  ON comments(parent_id);
```
**대댓글 권한 정리:**
- 콘텐츠 댓글: Level 3 이상만 대댓글 → 앱 레벨에서 `parent_id` 설정 시 role 체크
- Q&A 댓글: Level 1 이상 모두 대댓글 가능
---
### 테이블 5 — `likes`
```sql
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
```
---
### 테이블 6 — `content_reads`
```sql
CREATE TABLE content_reads (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id)    ON DELETE CASCADE NOT NULL,
  content_id    UUID REFERENCES contents(id) ON DELETE CASCADE NOT NULL,
  read_at       TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, content_id)
);
CREATE INDEX idx_reads_user    ON content_reads(user_id);
CREATE INDEX idx_reads_content ON content_reads(content_id);
```
---
### 테이블 7 — `user_badges`
```sql
CREATE TABLE user_badges (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  badge_type  TEXT NOT NULL,
  -- 'top_helper' | 'content_creator' | 'early_adopter' | 'active_reader'
  granted_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, badge_type)
);
```
**배지 획득 조건:**

|배지|조건|
|---|---|
|🏆 Top Helper|`is_helpful = true` 댓글 10개 이상|
|✍️ Content Creator|Q&A 글 20개 이상 + 평균 좋아요 5개 이상|
|🚀 Early Adopter|런칭 후 3개월 이내 가입 또는 신규 카테고리 첫 글|
|📚 Active Reader|전체 발행 콘텐츠 중 50% 이상 읽음 표시|
---
### 테이블 8 — `activity_logs`
```sql
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
```
---
### 전체 테이블 요약
|테이블|역할|
|---|---|
|`users`|회원 정보. role(1~4), status 포함|
|`contents`|콘텐츠 본문 + 메타|
|`qa_posts`|Q&A 질문|
|`comments`|콘텐츠/Q&A 댓글 통합. parent_id로 대댓글|
|`likes`|콘텐츠/Q&A 좋아요 통합|
|`content_reads`|읽음 표시|
|`user_badges`|배지|
|`activity_logs`|행동 추적 (어드민 대시보드용)|

### RLS (Row Level Security) 핵심 정책
```sql
-- 발행된 콘텐츠만 공개
CREATE POLICY "published_contents_public"
  ON contents FOR SELECT
  USING (is_published = true);
-- Level 4만 콘텐츠 작성/수정
CREATE POLICY "admin_manage_contents"
  ON contents FOR ALL
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 4);
-- 본인 댓글 또는 Level 3 이상이면 삭제 가능
CREATE POLICY "delete_comments"
  ON comments FOR DELETE
  USING (
    auth.uid() = author_id
    OR (SELECT role FROM users WHERE id = auth.uid()) >= 3
  );
-- Level 1 이상만 좋아요
CREATE POLICY "authenticated_likes"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);
-- 본인 읽음 데이터만 접근
CREATE POLICY "own_reads"
  ON content_reads FOR ALL
  USING (auth.uid() = user_id);
```
---
## 14. 참여 지표 (Engagement Metrics)
### 참여율 계산 공식
```
참여율 = MIN( (A + B + C) / D × 100, 100 )
A = Q&A 질문 수 × 5           ← 능동적 기여 (가중치 30%)
B = 댓글 / 대댓글 수 × 2      ← 소통 활동 (가중치 40%)
C = 좋아요 + 읽음 표시 수 × 1  ← 수동적 소비 (가중치 30%)
D = 가입 일수 × 0.5 (최솟값 10)
```
### 권한 승급 판단 기준
|승급 대상|판단 기준|
|---|---|
|Level 2 (Contributor)|참여율 60% 이상 + Content Creator 배지|
|Level 3 (Moderator)|참여율 70% 이상 + Top Helper 배지 + 활동 3개월 이상|
### 휴면 회원 식별
- 30일 이상 미로그인 (`last_login_at < now() - interval '30 days'`)
- 전월 대비 참여율 50% 이상 하락
- → 어드민 대시보드에서 별도 필터로 확인 + 타겟 알림 발송
---
## 15. BMC (Buy Me a Coffee) 연동
|노출 위치|조건|
|---|---|
|콘텐츠 하단|Admin이 해당 콘텐츠에서 `show_bmc = true` 설정 시만|
|Q&A 상세 하단|매 페이지 자동 노출|
**문구:** "Was this helpful? ☕ Buy me a coffee — Help keep this content free"

## 16. SEO 전략
- 모든 콘텐츠: `<title>` / `<meta description>` / OG 태그 자동 생성
- URL: `/[category]/[slug]` — slug는 영문 소문자 + 하이픈
- `/sitemap.xml` 자동 생성
- `robots.txt` 설정
- Comparison 카테고리 우선 강화 (국가 비교 키워드 유입)
---
## 17. 개발 Phase 계획
### ✅ Phase 0 — 사전 준비 (개발 시작 전)
> 이 단계 없이 Phase 1 시작하면 나중에 구조 변경 비용이 커집니다.
- [ ] Supabase 프로젝트 생성
- [ ] 전체 테이블 스키마 생성 (테이블 1~8 전부)
- [ ] RLS 정책 설정
- [ ] NextAuth + Supabase 연동 확인
- [ ] Vercel 프로젝트 연결 + 환경변수 설정
- [ ] Cloudinary 계정 + 업로드 프리셋 설정
- [ ] CLAUDE.md / DESIGN.md / PROGRESS.md 작성
---
### 🏗️ Phase 1 — 레이아웃 + 정적 페이지 (3~5일)
> 뼈대 완성. 디자인 시스템이 올바르게 적용되는지 가장 먼저 확인한다.
- [ ] 전체 레이아웃 (Top Nav + Left Sidebar + Main + Footer)
- [ ] 홈 페이지 (Hero + 추천 콘텐츠 + 카테고리 요약, 더미 데이터)
- [ ] About 페이지
- [ ] FAQ 페이지
- [ ] Legal 페이지 (Privacy Policy + ToS)
- [ ] 404 페이지
- [ ] 로그인 페이지 UI (`/login`, 기능 연결은 Phase 3)
- [ ] 회원가입 페이지 UI (`/signup`, 기능 연결은 Phase 3)
- [ ] 모바일 반응형 확인 (375px / 768px)
- [ ] 첫 Vercel 배포
**완료 기준:** 레이아웃이 DESIGN.md와 일치하고, 모바일에서 깨지지 않고, Vercel에 배포되어 URL로 접근 가능하다.
---
### 📄 Phase 2 — 콘텐츠 페이지 + DB 연동 (1주)
> 비로그인 사용자가 콘텐츠를 탐색하고 읽을 수 있는 상태
- [ ] 카테고리 목록 페이지 (`/[category]`, 카드 그리드)
- [ ] 콘텐츠 상세 페이지 (`/[category]/[slug]`, MDX 렌더링)
- [ ] 검색 결과 페이지 (`/search`, 콘텐츠 + Q&A 통합)
- [ ] Supabase `contents` 테이블 읽기 연동
- [ ] 사이드바 카테고리 → 카테고리 목록 페이지 연결
- [ ] SEO 기본 세팅 (title / meta / OG 태그 / sitemap)
**완료 기준:** 브라우저에서 카테고리를 선택하고 콘텐츠를 읽을 수 있으며, 검색이 동작한다.
---
### 🔐 Phase 3 — 인증 + 사용자 기능 (1~2주)
> 로그인 후 활동 가능한 모든 기능
- [ ] Google / Apple OAuth 로그인 (NextAuth)
- [ ] 로그인/회원가입 페이지 기능 연결 (`/login`, `/signup`)
- [ ] 프로필 페이지 (`/profile`)
- [ ] 프로필 수정 페이지 (`/profile/edit`, 닉네임 / 사진)
- [ ] 활동 내역 페이지 (`/profile/activities`)
- [ ] 알림 페이지 (`/notifications`)
- [ ] 읽음 표시 기능 (버튼 + Sidebar 현황)
- [ ] 좋아요 (콘텐츠)
- [ ] 댓글 작성 / 삭제 (Textarea, Level 1)
- [ ] 비로그인 시 로그인 유도 UI
**완료 기준:** 로그인 → 프로필 수정 → 읽음 표시 → 댓글 작성 → 알림 확인 → 로그아웃이 에러 없이 동작한다.
---
### 💬 Phase 4 — Q&A + 커뮤니티 (1~2주)
> 커뮤니티 기능 완성
- [ ] Q&A 목록 페이지 (`/qa`)
- [ ] Q&A 작성 페이지 (`/qa/new`, TipTap 에디터)
- [ ] Q&A 상세 페이지 (`/qa/[id]`)
- [ ] Q&A 댓글 / 대댓글 (Level 1 이상)
- [ ] [도움됨] 버튼 (`is_helpful`)
- [ ] 콘텐츠 대댓글 (Level 3 이상 제한, 앱 레벨 적용)
- [ ] 좋아요 (Q&A)
- [ ] BMC 연동 (Q&A 하단 자동 / 콘텐츠 선택)
- [ ] 관련글 자동 2개 / 관련 Q&A 자동 2개
**완료 기준:** Q&A 작성 → 댓글 → 도움됨 표시 → BMC 버튼까지 흐름이 동작한다.
---
### ⚙️ Phase 5 — 어드민 + 배지 시스템 (1~2주)
> 운영 도구 완성
- [ ] 어드민 대시보드 (`/admin`, Level 3 이상)
    - 전체 회원 수 / 신규 가입 추이 / 페이지별 조회수
- [ ] 회원 관리 (`/admin/users`, Level 3 이상)
    - 회원 리스트 + 검색
    - 회원 상세 페이지 (`/admin/users/[id]`, 참여 지표 + 배지 + 활동 로그)
    - 계정 Suspend (Level 3) / Ban (Level 4)
    - 권한 레벨 변경 (Level 4만)
- [ ] 콘텐츠 관리 (`/admin/contents`, Level 4만)
    - BlockNote 에디터로 콘텐츠 작성 / 수정 (`/admin/contents/editor`)
    - 발행 / 비공개 전환
    - BMC on/off
    - 댓글 고정 지정 / 해제
- [ ] Q&A 관리 (`/admin/qa`, Level 3 이상)
- [ ] 배지 자동 부여 로직 (Supabase Function)
- [ ] activity_logs 기반 행동 데이터 시각화
- [ ] 휴면 회원 필터 기능
**완료 기준:** Admin 계정으로 콘텐츠 작성 → 발행 → 회원 관리까지 전체 운영 흐름이 동작한다.
---
## 18. 전체 사용자 흐름 (User Flow)
```
[비로그인]
  └── 콘텐츠 열람 → 로그인 유도 CTA
[로그인]
  ├── 소셜 로그인 (Google / Apple)
  ├── 자동으로 role = 1 (Subscriber) 부여
  └── 활동 시작
       ├── 읽음 표시 → Sidebar에 진행현황
       ├── 좋아요
       ├── 댓글 작성
       └── Q&A 작성 / 답변
[배지 획득]
  └── 조건 충족 시 자동 부여 (Supabase Function)
       └── Admin이 참여 지표 확인 후 Level 2/3 승급 검토
[Admin (Level 4)]
  ├── 콘텐츠 작성 / 발행
  ├── 회원 관리
  └── 운영 데이터 모니터링
```
---
## 19. 파일 구조
```
project/
├── CLAUDE.md              ← Claude 행동 규칙
├── DESIGN.md              ← Stitch 디자인 시스템
├── PROGRESS.md            ← 세션 이어가기
├── SPEC.md                ← 본 사양서
├── brand_assets/          ← 로고, 색상 가이드
├── workflows/
│   ├── new-content.md     ← 새 콘텐츠 추가 절차
│   ├── new-page.md        ← 새 컴포넌트 추가 절차
│   └── deploy.md          ← 배포 절차
├── app/
│   ├── page.tsx                    ← 홈
│   ├── [category]/
│   │   ├── page.tsx                ← 카테고리 목록
│   │   └── [slug]/page.tsx         ← 콘텐츠 상세
│   ├── qa/
│   │   ├── page.tsx                ← Q&A 목록
│   │   ├── new/page.tsx            ← Q&A 작성
│   │   └── [id]/page.tsx           ← Q&A 상세
│   ├── login/page.tsx              ← 로그인
│   ├── signup/page.tsx             ← 회원가입
│   ├── search/page.tsx             ← 검색 결과
│   ├── notifications/page.tsx      ← 알림 (Level 1+)
│   ├── about/page.tsx
│   ├── faq/page.tsx
│   ├── legal/page.tsx
│   ├── profile/
│   │   ├── page.tsx                ← 프로필
│   │   ├── edit/page.tsx           ← 프로필 수정
│   │   └── activities/page.tsx     ← 활동 내역
│   └── admin/
│       ├── page.tsx                ← 대시보드
│       ├── contents/
│       │   ├── page.tsx            ← 콘텐츠 관리
│       │   └── editor/page.tsx     ← 콘텐츠 에디터 (BlockNote)
│       ├── users/
│       │   ├── page.tsx            ← 회원 목록
│       │   └── [id]/page.tsx       ← 회원 상세
│       └── qa/page.tsx             ← Q&A 관리
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── content/
│   │   ├── ContentCard.tsx
│   │   ├── ReadButton.tsx
│   │   ├── LikeButton.tsx
│   │   └── BMCSection.tsx
│   ├── comments/
│   │   ├── CommentList.tsx
│   │   └── CommentForm.tsx
│   ├── qa/
│   │   ├── QACard.tsx
│   │   └── QAEditor.tsx
│   └── admin/
│       ├── UserTable.tsx
│       ├── UserDetail.tsx
│       └── MetricsDashboard.tsx
└── lib/
    ├── supabase.ts
    ├── auth.ts
    └── utils.ts
```
---
_버전: v5.0 | §4·§5·§17·§19를 Stitch 디자인 기준으로 동기화. Phase 5단계 재구성. 이 사양서를 기준으로 Claude Code 개발을 시작합니다._