# PROGRESS.md — Know Korea

> 새 세션 시작 시 이 파일을 먼저 읽어 현재 상태를 파악한다.

---

## 현재 상태 (미결 이슈)

**미결: FIX_16 — Ko-fi 팝업 스크롤 문제**

- `scrollbars=no` 적용했으나 Chrome 88+ 정책으로 무시됨 → 효과 없음
- Ko-fi 자체 JS의 auto-scroll은 cross-origin 제한으로 외부 제어 불가
- 해결 방향 미결정: A) `_blank` 새 탭으로 열기, B) `/donate` 직접 URL 시도
- 현재 코드: `width=560,height=900,scrollbars=no` (실질적으로 scrollbars=yes와 동일)

**최근 완료 (2026-04-05)**
- FIX_17: Static 페이지 전면 교체 + 구조 변경 ✅ 배포 확인
- FIX_18: Admin Contact 관리 페이지 + Gmail 회신 기능 ✅ 배포 확인
- HOTFIX: Admin Dashboard 서버 컴포넌트 onClick 에러 수정 ✅ 배포 확인

---

## Part 1: Build Phases

> Phase 0~4 — 프로젝트 초기화부터 어드민 시스템까지 핵심 기능 구축. 모두 완료.

### Phase 0 — 사전 준비 ✅ (2026-03-23)

| 항목 | 상태 |
|------|------|
| Next.js 14 프로젝트 초기화 (TS + Tailwind + App Router) | ✅ |
| tailwind.config.ts 커스텀 토큰 (DESIGN.md §10) 반영 | ✅ |
| app/layout.tsx Font CDN (Plus Jakarta Sans, Manrope, Material Symbols) | ✅ |
| app/globals.css 폰트/배경 규칙 적용 | ✅ |
| SPEC.md §19 기준 폴더/파일 구조 생성 | ✅ |
| supabase/migrations/001_initial_schema.sql (테이블 8개 + RLS) | ✅ |
| .env.local.example 생성 | ✅ |
| .gitignore .env.local 포함 확인 | ✅ |

---

### Phase 1 — 레이아웃 + 정적 페이지 ✅ (2026-03-23)

| 항목 | 상태 |
|------|------|
| 전체 레이아웃 (Navbar + Sidebar + Footer) | ✅ |
| 홈 페이지 (Hero + 추천 콘텐츠 + 카테고리 요약, 더미 데이터) | ✅ |
| About 페이지 | ✅ |
| FAQ 페이지 (아코디언 UI) | ✅ |
| Legal 페이지 (Privacy + Terms) | ✅ |
| 404 페이지 | ✅ |
| 로그인 페이지 UI (/login) | ✅ |
| 회원가입 페이지 UI (/signup) | ✅ |
| 카테고리 목록 페이지 (/[category]) | ✅ |
| 콘텐츠 상세 페이지 (/[category]/[slug]) | ✅ |
| 검색 결과 페이지 (/search) | ✅ |
| 빌드 성공 (npm run build) | ✅ |
| 모바일 반응형 확인 (375px / 768px) | ✅ |
| 첫 Vercel 배포 | ✅ |

---

### Phase 1 보완 — Supabase 연동 + 검색 + SEO ✅ (2026-03-23)

| 항목 | 상태 |
|------|------|
| @supabase/supabase-js 설치 + lib/supabase.ts 클라이언트 설정 | ✅ |
| supabase/seed.sql — 12개 카테고리 × 16개 콘텐츠 레코드 | ✅ |
| 홈 페이지 DB 연동 (인기 가이드 view_count 상위 5개 + 최신 practical-guide 3개) | ✅ |
| 카테고리 목록 페이지 DB 연동 (실제 Supabase 쿼리) | ✅ |
| 콘텐츠 상세 페이지 DB 연동 (slug 조회, view_count 증가, 관련 글 2개) | ✅ |
| 검색 기능 실제 연동 (title + excerpt ilike 검색) | ✅ |
| SearchInput 클라이언트 컴포넌트 (URL params 기반 네비게이션) | ✅ |
| 동적 SEO metadata (title, description, OG, Twitter 카드) | ✅ |
| 정적 페이지 metadata (about, faq, legal) | ✅ |
| /sitemap.xml 자동 생성 + /robots.txt 설정 | ✅ |
| next.config.mjs 외부 이미지 도메인 설정 (Unsplash, Cloudinary) | ✅ |
| Supabase 스키마/시드 실행 + 실 DB 브라우저 검증 완료 | ✅ |

**노트:**
- Supabase 클라이언트: 빌드 시 env 미설정에도 오류 없도록 플레이스홀더 기본값 사용
- force-dynamic: 홈/카테고리/검색/상세 모든 DB 조회 페이지에 적용 (SSR on-demand)
- view_count 증가: 상세 페이지 서버 컴포넌트에서 직접 UPDATE
- 관련 글: 같은 카테고리 + 태그 겹침 수로 정렬, 부족 시 최신순 fallback
- ToC: body_mdx HTML에서 `<h2 id="...">` 패턴 추출
- 검색: 빈 쿼리 → 안내 UI / 결과 없음 → no-results UI

---

### Phase 2 — 인증 + 사용자 기능 ✅ (2026-03-24)

| 항목 | 상태 |
|------|------|
| NextAuth.js 설치 + Google OAuth 설정 | ✅ |
| lib/auth-options.ts, lib/auth.ts (getSession, hasRole) | ✅ |
| 최초 로그인 → users 자동 생성 (role=1), 재로그인 → last_login_at 업데이트 | ✅ |
| activity_logs에 login 기록 | ✅ |
| LoginButtons.tsx, SessionProvider.tsx + layout.tsx 래핑 | ✅ |
| /login, /signup — 로그인 상태면 / 리디렉트 | ✅ |
| Navbar — 세션 상태별 UI (로그인: 프로필+드롭다운, 비로그인: Login 버튼) | ✅ |
| middleware.ts — /profile, /notifications 비로그인 차단; /admin Level 3 미만 차단 | ✅ |
| /profile, /profile/edit, /profile/activities 페이지 | ✅ |
| 읽음 표시 (ReadButton) + api/reads toggle | ✅ |
| 좋아요 (LikeButton) + api/likes toggle + 카운트 | ✅ |
| 댓글 (CommentSection) + api/comments POST/DELETE | ✅ |
| /notifications — activity_logs 기반 활동 피드 (최근 50건) | ✅ |
| 버그 수정: 댓글 작성 후 즉시 표시 (optimistic state update) | ✅ |

**노트:**
- supabaseAdmin: SUPABASE_SERVICE_ROLE_KEY 사용 (RLS 우회) — 서버 전용
- 세션 JWT 전략: 매 콜백마다 users 테이블에서 id/role/nickname 갱신
- ReadButton/LikeButton/CommentSection: 모두 `'use client'` — 서버에서 초기 상태 주입
- 댓글 대댓글: Phase 3에서 추가 (parent_id 컬럼 이미 존재)
- Apple OAuth: Apple Developer Program 가입 후 별도 추가 예정

---

### Phase 3 — Q&A + 커뮤니티 ✅ (2026-03-24)

| 항목 | 상태 |
|------|------|
| Q&A 목록 페이지 (/qa) DB 연동 — 카테고리 필터, 페이지네이션 | ✅ |
| Q&A 작성 페이지 (/qa/new) TipTap 에디터 (Level 1+) | ✅ |
| Q&A 상세 페이지 (/qa/[id]) — 좋아요, 해결됨 토글, 연결 콘텐츠 표시 | ✅ |
| Q&A 대댓글 (Level 1+ 모두 가능, 트리 구조) | ✅ |
| [도움됨] 버튼 (is_helpful) — Q&A 작성자만 토글 | ✅ |
| 콘텐츠 대댓글 (Level 3+ 앱 레벨 제한) | ✅ |
| BMC 섹션 — Q&A 상세 하단 자동 노출 | ✅ |
| 관련 Q&A 연결 — 콘텐츠 상세 사이드바 RelatedQA 서버 컴포넌트 | ✅ |

**노트:**
- TipTap 에디터: `@tiptap/react` + `@tiptap/starter-kit`. Bold/Italic/리스트/인용/코드 툴바
- QAActions: 좋아요 토글 + 해결됨 토글 (작성자 전용)
- QACommentSection: 댓글 트리 구조, 도움됨 마킹, optimistic update
- comments API: `qa_post_id`, `parent_id` 추가. 콘텐츠 대댓글은 role < 3 시 403
- BMC: Q&A 상세 하단 항상 노출. 콘텐츠는 show_bmc=true 시에만 노출

---

### Phase 4 — 어드민 + 배지 ✅ (2026-03-24)

| 항목 | 상태 |
|------|------|
| Admin Layout — 좌측 사이드바 + 상단 헤더 | ✅ |
| /admin 대시보드 — 통계 4개 + 카테고리 뷰 비율 + 최근 회원 + Global Toggles | ✅ |
| /admin/users — 회원 리스트, 검색, 휴면 필터 | ✅ |
| /admin/users/[id] — 상세 정보, 참여율, 배지, 활동 피드 | ✅ |
| 참여율 공식 (SPEC.md §14) — 프로그레스 바, 승급 조건 표시 | ✅ |
| 회원 Suspend/Unsuspend (Level 3+), Ban (Level 4), Role 변경 (Level 4) | ✅ |
| Suspended/Banned 계정 로그인 차단 (signIn callback) | ✅ |
| /admin/contents — 목록, is_published 토글, show_bmc 토글 | ✅ |
| /admin/contents/new, /admin/contents/[id]/edit — BlockNote 에디터 | ✅ |
| /admin/analytics — 로그인 추이, 조회수 Top 10, 활동 로그, 좋아요 요약 | ✅ |
| 배지 자동 부여 API — 4종 배지 조건 체크 | ✅ |
| 댓글 고정 API — Level 4 전용 | ✅ |
| SiteShell 컴포넌트 — /admin 경로에서 사이트 레이아웃 분리 | ✅ |

**노트:**
- BlockNote: `@blocknote/react + @blocknote/mantine` dynamic import (SSR: false). body_mdx에 HTML 저장
- 참여율 공식: `MIN((A×5 + B×2 + C) / MAX(10, 일수×0.5) × 100, 100)`
- 배지 체크: `/api/admin/badges/check?user_id=xxx` POST로 수동 트리거
- 계정 차단: signIn callback에서 status=suspended/banned 시 `/login?error=AccountBlocked` 반환
- Admin Test SQL: `UPDATE users SET role = 4 WHERE email = 'poisian@gmail.com';`

---

## Part 2: Iterations

> Build 완료 후 버그 수정, UI 개선, 기능 보완. 시간순 정렬.

### Phase 4 보완 — Admin Content 관리 개선 ✅ (2026-03-25)

| 항목 | 상태 |
|------|------|
| /admin/qa 페이지 — Q&A 목록, 카테고리/상태 필터, 해결됨 토글, 삭제 (Level 3+) | ✅ |
| AdminSidebar에 Q&A 메뉴 항목 추가 | ✅ |
| /admin/contents — 카테고리/상태 드롭다운 필터 구현 | ✅ |
| /admin/contents — Sort 드롭다운 (Custom Order / Newest / Oldest / Category / Views) | ✅ |
| supabase/migrations/002_add_sort_order.sql — contents.sort_order 컬럼 추가 | ✅ |
| ▲▼ 버튼으로 Custom Order 순서 변경 (Optimistic update + DB swap) | ✅ |
| POST /api/admin/contents/reorder — sort_order 스왑 API | ✅ |
| 공개 카테고리 페이지 (/[category]) — sort_order ASC 기준 정렬 반영 | ✅ |
| 필터/정렬 버그 수정 — window.location.href 하드 네비게이션으로 교체 | ✅ |

**노트:**
- filter/sort 버그: `startTransition(() => router.push(...))` 가 App Router에서 searchParams를 신뢰할 수 있게 업데이트하지 않음 → 하드 네비게이션으로 교체
- sort_order: 신규 글은 NULL → PostgreSQL이 자동으로 마지막 배치
- 공개 카테고리 페이지: sort_order ASC → admin에서 설정한 순서가 그대로 반영

---

### Phase 4 보완 2 — 드래그앤드롭 + ISR 최적화 ✅ (2026-03-26)

| 항목 | 상태 |
|------|------|
| /admin/contents — ▲▼ 버튼 → @dnd-kit 드래그앤드롭으로 교체 | ✅ |
| POST /api/admin/contents/reorder — pair swap → bulk items 배열로 변경 | ✅ |
| canDrag 필터 제한 제거 — Custom Order면 필터 유무 무관하게 drag 활성 | ✅ |
| ISR 적용 — force-dynamic → revalidate (홈 3600, 카테고리 3600, 상세 600, Q&A 목록 60, Q&A 상세 300) | ✅ |
| ViewTracker 클라이언트 컴포넌트 — ISR 캐시와 무관하게 view_count 증가 | ✅ |
| POST /api/contents/[slug]/view — view_count 증가 API | ✅ |
| Vercel Function Region → icn1 (Seoul) 변경 + 재배포 | ✅ |
| /[category] 쿼리 — nullsFirst: false + created_at 보조 정렬 추가 | ✅ |

**노트:**
- dnd-kit: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`. PointerSensor(distance: 5)
- ISR: admin/profile/search는 force-dynamic 유지. 공개 페이지만 revalidate
- ViewTracker: `useEffect`에서 fire-and-forget POST. 서버 컴포넌트 view_count 증가 코드 제거
- 서울 리전: Vercel Settings → Functions → Function Region → icn1

---

### 버그 수정 라운드 1 ✅ (2026-03-26)

| 항목 | 상태 |
|------|------|
| Footer — 저작권 한 줄 정리 (`© 2026 The Modern Envoy — Your Digital Curator`) | ✅ |
| Home — 12개 카테고리별 인기 콘텐츠 3×4 그리드 | ✅ |
| 카테고리 목록 — 카드 우상단 읽음 아이콘 표시 (로그인 시) | ✅ |
| GET /api/reads?content_ids=... — 복수 콘텐츠 읽음 상태 batch 조회 API | ✅ |
| ContentGrid 클라이언트 컴포넌트 — 읽음 토글 + 카드 렌더링 통합 | ✅ |
| 콘텐츠 상세 — 사이드바 Related Q&A 섹션 삭제 | ✅ |
| 콘텐츠 상세 — 댓글 안내 추가 (`Inappropriate comments may be deleted.`) | ✅ |
| Q&A 목록 — 12개 카테고리 모두 표시, Resolved/Unresolved 필터 추가 | ✅ |
| Q&A 상세 — Edit / Delete 버튼 (작성자 + Admin Level 4) | ✅ |
| /qa/[id]/edit — TipTap 에디터로 수정 → 저장 | ✅ |
| /admin/users — Role / Status / Dormant 필터 조합 | ✅ |
| BlockNote 에디터 — CSS import 버그 수정 + Cloudinary 이미지 업로드 연동 | ✅ |
| Cover Image — Cloudinary 파일 업로드 버튼 추가 + URL 입력 유지 | ✅ |
| POST /api/upload — Cloudinary signed upload API (Admin Level 4 전용) | ✅ |

**노트:**
- Home 12카드: 카테고리별 view_count DESC → SPEC §12 순서대로 각 카테고리 최고 1개씩
- BlockNote CSS: v0.47은 `@blocknote/core/style.css` + `@blocknote/mantine/style.css` 두 개 모두 필요
- Cloudinary 업로드: signed upload (SHA-1 signature). `know-korea` 폴더. Admin 전용 (role≥4)

---

### 버그 수정 라운드 2 ✅ (2026-03-27)

| 항목 | 상태 |
|------|------|
| Cloudinary 환경변수 Vercel에 추가 | ✅ |
| Cover Image 업로드 — 에러 표시 추가 (기존 silent fail 수정) | ✅ |
| Cover Image URL 입력 — pendingCoverUrl 분리 (Enter/Set 버튼으로 확정) | ✅ |
| BlockNote 이미지 업로드 에러 — 에디터 상단 에러 배너 표시 | ✅ |
| Admin Content 생성/수정/삭제/재정렬 — revalidatePath 추가 (ISR 즉시 갱신) | ✅ |
| BlockNote Edit — 기존 HTML 로드 수정 (tryParseHTMLToBlocks 동기 호출) | ✅ |
| 콘텐츠 상세 + Q&A 상세 — prose-custom heading 스타일 추가 (h1~h4 계단식) | ✅ |

**노트:**
- Cloudinary: `.env.local`은 로컬 전용. Vercel 환경변수 별도 설정 필요
- BlockNote HTML 로드: `tryParseHTMLToBlocks`는 동기 메서드. `await` 잘못 사용 시 내용 미표시
- revalidatePath: POST/PATCH에서 category, slug로 정확한 경로만 revalidate
- prose-custom: globals.css `@layer components`에 h1~h4, p, ul, ol, code, blockquote, img, a 스타일

---

### 버그 수정 라운드 3 ✅ (2026-03-27)

| 항목 | 상태 |
|------|------|
| Navbar — "KNOW KOREA" 텍스트 → brand_logo.png 이미지로 교체 | ✅ |
| Footer — Contact Us → mailto:poisian@gmail.com, Support → FAQ (/faq) | ✅ |
| Sidebar — Language 아이콘 translate → font_download, BMC 링크 추가 | ✅ |
| Home — "Everything you need to navigate Korea" 서브텍스트 추가 | ✅ |
| Home — 사이트 소개 박스 + Q&A 소개 박스 (surface-container-low 카드) | ✅ |
| Home — "Popular Guides" → "Best Article by Category" 제목 변경 | ✅ |
| Home — 12개 카드 카테고리 태그 색상 통일 (primary-dim) | ✅ |
| Home — Best Article 섹션 하단 BMC 블록 추가 (#2D456E 배경, 골드 버튼) | ✅ |
| About — 이메일 poisian@gmail.com (mailto 링크) | ✅ |

**노트:**
- brand_logo.png: brand_assets/ → public/ 복사. next/image `Image` 컴포넌트 (h-9 w-auto)
- 카테고리 태그 색상: categoryColors 맵 전체를 `bg-primary/10 text-primary-dim`으로 통일

---

### 버그 수정 라운드 4 ✅ (2026-03-28)

| 항목 | 상태 |
|------|------|
| globals.css — prose-custom table/th/td 스타일 추가 (가로선만, 세로선 없음) | ✅ |
| POST /api/admin/contents — is_published/show_bmc body에서 읽도록 수정 (기존 false 하드코딩 버그) | ✅ |
| ContentEditor — 새 글 Publish 시 /admin/contents 리디렉트 | ✅ |
| ContentEditor — Delete Article 버튼 추가 (edit 모드 전용, 확인 모달) | ✅ |

**노트:**
- Publish 버그: POST route가 `is_published: false`로 하드코딩 → body에서 읽도록 수정
- 테이블 스타일: `border-collapse` + th `border-b-2` + td `border-b-1`, outline-variant 색상

---

### 버그 수정 라운드 5 ✅ (2026-03-29)

| 항목 | 상태 |
|------|------|
| lib/cloudinary.ts — cloudinaryUrl() + optimizeBodyImages() 유틸 생성 | ✅ |
| Navbar 아바타, 커버이미지, 본문 이미지 — Cloudinary 최적화 적용 | ✅ |
| 콘텐츠 상세 — ToC H2/H3 계층 지원 + injectHeadingIds() 전처리 | ✅ |
| 콘텐츠 상세 — 태그 위치: 제목 → 커버이미지 아래, 본문 위로 이동 | ✅ |
| lib/categories.ts — 15개 카테고리 중앙화 (CATEGORIES, CATEGORY_LABELS, CATEGORY_SLUGS) | ✅ |
| 16개 파일 — 하드코딩 카테고리 맵 제거, lib/categories 임포트로 교체 | ✅ |
| next.config.mjs — 구 카테고리 슬러그 301 리디렉트 4개 추가 | ✅ |
| supabase/migrations/003_category_rename.sql — 카테고리 슬러그 업데이트 | ✅ |

**노트:**
- Cloudinary 최적화: `f_auto,q_auto` + 용도별 width (cover: 1200, card: 600, body: 800, avatar: 200×200)
- ToC H3: `<h3>` 태그 `pl-4` 들여쓰기로 계층 표시
- injectHeadingIds: BlockNote HTML이 id 미포함 시 ToC 앵커 작동 안 하는 문제 해결
- 카테고리 15개: start-here, language, k-pop, k-film, k-drama, k-sports, k-lifestyle, culture-society, history-politics, korea-in-the-world, living-in-korea, work-business, economy-money, travel-places, tools-resources
- DB 마이그레이션: `003_category_rename.sql` 수동 실행 필요

---

### Command 08~10 + 스타일 보완 ✅ (2026-04-03)

- Command 08: Admin 콘텐츠 limit 제거, 에러 메시지 우측 패널 이동, 칩 필터 UI, Language subtitle 삭제
- Command 09: Q&A → Community 전환 완료 (URL, UI 텍스트, MDX, sitemap, redirects)
- Command 10: UI 정렬 + 사이드바 + Home 개선
  - 전체 페이지 본문 좌측 정렬 통일 (mx-auto → mr-auto, px-4 → px-5 md:px-8)
  - 사이드바 하단 메뉴: Community + About + Buy me a Coffee 3개
  - 사이드바 폰트 text-sm → text-[15px]
  - Home: Start Here / Ask a Question 버튼 삭제, 2개 안내 카드로 교체
  - Community: 검색 입력창 추가 (q 파라미터, status/category AND 필터)
- 스타일 보완: Home 안내 카드 — bg-primary/8 배경, 텍스트 text-base + font-medium + text-on-surface, 아이콘 22px

---

### Command 11 ✅ (2026-04-03)

- 아티클 상세 브레드크럼 데스크탑 폰트 크기 확대 (text-xs → md:text-base, md:font-medium, 모바일 유지)
- Cover Image 캡션(출처) + Alt Text 지원 (DB 컬럼 추가, ContentEditor UI, 상세 페이지 figure/figcaption)
- 본문 이미지 figcaption 스타일 추가 (globals.css)
- 모바일 햄버거 메뉴 → 카테고리 사이드바 drawer로 변경 (body scroll lock, Community/About/BMC 하단 유지)

---

### Command 12 ✅ (2026-04-03)

- 브레드크럼 1·2레벨 칩 변환 (Home 칩 + 카테고리 아이콘 칩, rounded-full, flex-wrap)
- 커버이미지 아래 카테고리 태그 칩 중복 삭제 (header span 제거)
- CATEGORY_ICONS를 lib/categories.ts에 export로 중앙화 (사이드바/브레드크럼 공유)

---

### BUGFIX_COMMAND_13 ✅ (2026-04-03)

- cover_caption, cover_alt가 DB에 저장 안 되던 버그 수정
- POST API (route.ts): destructure + insert에 두 필드 추가
- PATCH API ([id]/route.ts): destructure + updates 객체에 두 필드 추가
- ContentEditor body 포함은 Command 11에서 이미 완료, 상세 페이지 figcaption도 정상

---

### FIX_14 — BMC → Ko-fi 전환 ✅ (2026-04-05)

- `components/KoFiButton.tsx` 신규 생성 (팝업 버튼, window.open 방식)
- `app/[category]/[slug]/page.tsx` BMC Section → KoFiButton 교체
- `app/community/[id]/page.tsx` BMC Section → KoFiButton 교체
- `app/page.tsx` Home BMC 블록 → KoFiButton 교체
- `components/layout/Sidebar.tsx` BMC `<a>` → Ko-fi `<button>` 교체
- `content/pages/faq.mdx` Buy Me a Coffee → Ko-fi Support 텍스트 교체
- `app/admin/page.tsx` BMC Support → Ko-fi Support 레이블 2곳 교체
- `components/admin/ContentEditor.tsx` "Show BMC section" → "Show Ko-fi Support"
- DB 변경 없음 (show_bmc 컬럼명 유지)

---

### FIX_18 — Admin Contact 관리 페이지 + Gmail 회신 기능 ✅ (2026-04-05)

- `supabase/migrations/006_contact_management.sql` — is_replied, replied_at, admin_note, is_archived 컬럼 추가 (수동 실행 필요)
- `lib/email.ts` — nodemailer Gmail SMTP 유틸리티
- `app/api/admin/contact/route.ts` — GET 목록 (필터/검색/페이지네이션)
- `app/api/admin/contact/[id]/route.ts` — PATCH 상태 업데이트
- `app/api/admin/contact/[id]/reply/route.ts` — POST 이메일 회신 발송
- `app/api/admin/contact/unread-count/route.ts` — GET 미읽음 카운트
- `app/admin/contact/page.tsx` — 관리 페이지 (테이블 + 슬라이드 패널 + Reply + Admin Note)
- `components/admin/AdminSidebar.tsx` — Contact 메뉴 추가, 미읽음 배지 (role≥4)
- `app/admin/page.tsx` — Dashboard Unread Contact 위젯 카드 추가
- nodemailer + @types/nodemailer 설치 완료
- GMAIL_USER / GMAIL_APP_PASSWORD .env.local 확인 완료

⚠️ 수동 작업: Supabase SQL Editor에서 `supabase/migrations/006_contact_management.sql` 실행 필요
⚠️ 수동 작업: Vercel 환경변수에 GMAIL_USER + GMAIL_APP_PASSWORD 추가 필요

---

### FIX_17 — Static 페이지 전면 교체 + 구조 변경 ✅ (2026-04-05)

**작업 1 — Static 페이지 콘텐츠 교체**
- `app/about/page.tsx` 전면 교체 (STATIC_about.md 기준): Our Story·15개 카테고리 테이블·How This Works 3항목·Ko-fi 버튼·Contact Us 2-CTA
- `app/faq/page.tsx` 전면 교체 (STATIC_FAQ.md 기준): Finding Information 삭제·Community 섹션 추가·Account 5개·Read 3개·Ko-fi Support·Privacy 2개
- FAQ CTA 카드: Community+이메일 → About+/contact 링크로 교체

**작업 2 — /legal → /privacy-policy + /terms-of-service 분리**
- `app/privacy-policy/page.tsx` 신규 생성 (STATIC_Privacy_Policy.md 기준, 10개 섹션 + 테이블)
- `app/terms-of-service/page.tsx` 신규 생성 (STATIC_Terms_of_Service.md 기준, 13개 섹션)
- `app/legal/page.tsx` → `redirect("/privacy-policy")` 대체
- `next.config.mjs` `/legal` 301 리다이렉트 추가
- `app/login/page.tsx`, `app/signup/page.tsx` /legal 링크 → /privacy-policy + /terms-of-service
- `components/layout/Footer.tsx` 링크 업데이트

**작업 3 — /contact 페이지 신규 생성**
- `app/contact/page.tsx` 신규 생성 (Name/Email/Category/Message 폼, 성공 메시지)
- `app/api/contact/route.ts` POST 핸들러 (validation + Supabase INSERT)
- `supabase/migrations/005_contact_submissions.sql` 마이그레이션 파일 생성 (수동 실행 필요)

**작업 4 — 잔여 Q&A 참조 정리**
- FAQ faqSections의 Q&A 섹션 ID "qa" → "community" 교체 완료
- /qa 레거시 파일 내 텍스트는 이미 /community로 리다이렉트되어 미노출

**작업 5 — 로그인 페이지 Apple 버튼 삭제**
- `components/auth/LoginButtons.tsx` Apple "Coming Soon" 버튼 완전 삭제

**작업 6 — 사이드바 Support 텍스트**
- `components/layout/Sidebar.tsx` "Support on Ko-fi" → "Support This Site"

**작업 7 — Footer 통일**
- `components/layout/Footer.tsx` "© 2026 The Modern Envoy — Your Digital Curator" → "© 2026 Know Korea"
- Contact Us 링크: mailto → /contact 페이지

⚠️ Supabase SQL Editor에서 `supabase/migrations/005_contact_submissions.sql` 수동 실행 필요

---

### FIX_15 — 사이드바 Ko-fi 완전 전환 ✅ (2026-04-05)

- `KoFiButton.tsx` 팝업 height 760 → 900
- `Sidebar.tsx` 인라인 button → `<KoFiButton size="sm">` 컴포넌트로 교체 (URL/스펙 통일)
- `Navbar.tsx` 모바일 드로어 BMC `<a>` → Ko-fi `<button>` (드로어 닫기 + 팝업 열기)
- components 내 buymeacoffee 참조 완전 제거

---

## 참고 사항

### 배포 정보

- **Production:** https://know-korea-bweqru87f-ventureops-projects.vercel.app
- **GitHub:** https://github.com/ventureops/know-korea

### 환경 설정

- Supabase / Vercel / Cloudinary 계정 연결은 별도로 진행 필요
- Vercel 환경변수: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, Cloudinary 키 3개
- `content/pages/`에 about.mdx, faq.mdx, legal.mdx 존재 (Phase 1에서 직접 컴포넌트로 구현)
- `app/fonts/`에 Geist 폰트 파일 있음 (사용 안 함 — Google Fonts CDN 사용)

### 다음 세션 시작 방법

```
PROGRESS.md 읽고 현재 상태 확인 후 작업 시작
```
