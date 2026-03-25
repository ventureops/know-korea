# PROGRESS.md — Know Korea

> 새 세션 시작 시 이 파일을 먼저 읽어 현재 상태를 파악한다.

---

## 현재 상태

**Phase 4 완료 + 보완 작업 진행 중 (2026-03-26)**

---

## Phase 0 — 사전 준비 ✅ 완료 (2026-03-23)

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

## Phase 1 — 레이아웃 + 정적 페이지 ✅ 완료 (2026-03-23)

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
| 모바일 반응형 확인 (375px / 768px) | ✅ (코드 리뷰 완료, 모바일 햄버거 메뉴 추가) |
| 첫 Vercel 배포 | ✅ https://know-korea-bweqru87f-ventureops-projects.vercel.app |

---

## Phase 1 보완 — Supabase 연동 + 검색 + SEO ✅ 완료 (2026-03-23)

| 항목 | 상태 |
|------|------|
| @supabase/supabase-js 설치 | ✅ |
| lib/supabase.ts 클라이언트 설정 (Content 타입 포함) | ✅ |
| supabase/seed.sql — 12개 카테고리 × 16개 콘텐츠 레코드 | ✅ |
| 홈 페이지 DB 연동 (인기 가이드 view_count 상위 5개 + 최신 practical-guide 3개) | ✅ |
| 카테고리 목록 페이지 DB 연동 (더미 데이터 제거, 실제 Supabase 쿼리) | ✅ |
| 콘텐츠 상세 페이지 DB 연동 (slug 조회, view_count 증가, 관련 글 2개 자동 추천) | ✅ |
| 검색 기능 실제 연동 (title + excerpt ilike 검색) | ✅ |
| SearchInput 클라이언트 컴포넌트 (URL params 기반 네비게이션) | ✅ |
| 동적 SEO metadata (title, description, OG, Twitter 카드) | ✅ |
| 정적 페이지 metadata (about, faq, legal) | ✅ |
| /sitemap.xml 자동 생성 (발행 콘텐츠 기준) | ✅ |
| /robots.txt 설정 | ✅ |
| next.config.mjs 외부 이미지 도메인 설정 (Unsplash, Cloudinary) | ✅ |
| npm run build 에러 없음 | ✅ |
| Git commit + push | ✅ bd42f93 |
| Supabase 스키마 실행 (001_initial_schema.sql) | ✅ |
| Supabase 시드 데이터 실행 (seed.sql, 16개 콘텐츠) | ✅ |
| .env.local 환경변수 설정 완료 | ✅ |
| 실 DB 데이터 브라우저 검증 완료 | ✅ (2026-03-23) |

### Phase 1 보완 노트

- **Supabase 클라이언트:** 빌드 시 env 미설정에도 오류 없도록 플레이스홀더 기본값 사용
- **force-dynamic:** 홈/카테고리/검색/상세 모든 DB 조회 페이지에 적용 (SSR on-demand)
- **view_count 증가:** 상세 페이지 서버 컴포넌트에서 직접 UPDATE
- **관련 글:** 같은 카테고리 + 태그 겹침 수로 정렬, 부족 시 최신순 fallback
- **ToC:** body_mdx HTML에서 `<h2 id="...">` 패턴 추출
- **검색:** 빈 쿼리 → 빈 화면 (안내 UI) / 결과 없음 → no-results UI 표시
- **브라우저 검증:** 홈(Popular Guides) / 카테고리 목록 / 콘텐츠 상세(본문+ToC+view_count) / 검색("korea" → 14개) 모두 정상 확인

---

## Phase 2 — 인증 + 사용자 기능 ✅ 완료 (2026-03-24)

| 항목 | 상태 |
|------|------|
| NextAuth.js 설치 + Google OAuth 설정 | ✅ |
| lib/auth-options.ts (authOptions 분리), lib/auth.ts (getSession, hasRole) | ✅ |
| app/api/auth/[...nextauth]/route.ts | ✅ |
| 최초 로그인 → users 테이블 자동 생성 (role=1), 재로그인 → last_login_at 업데이트 | ✅ |
| activity_logs에 login 기록 | ✅ |
| components/auth/LoginButtons.tsx (Google signIn, loading 상태) | ✅ |
| components/auth/SessionProvider.tsx + app/layout.tsx 래핑 | ✅ |
| types/next-auth.d.ts (id, role, nickname 타입 확장) | ✅ |
| /login, /signup 페이지 — 로그인 상태면 / 리디렉트 | ✅ |
| Navbar — 세션 상태별 UI (로그인: 프로필+드롭다운, 비로그인: Login 버튼) | ✅ |
| middleware.ts — /profile, /notifications → 비로그인 /login 리디렉트; /admin → Level 3 미만 / 리디렉트 | ✅ |
| /profile 페이지 — 닉네임, 이메일, 역할, 가입일, 통계(읽음/좋아요/댓글 수) | ✅ |
| /profile/edit 페이지 — 닉네임 변경, 아바타 URL 입력, 계정 삭제 확인 모달 | ✅ |
| app/api/profile/update, app/api/profile/delete Route Handler | ✅ |
| /profile/activities 페이지 — 읽은 글, 좋아요한 글, 내 댓글 목록 | ✅ |
| 읽음 표시 (ReadButton) — 콘텐츠 상세 헤더 우측, success 색상 토글 | ✅ |
| api/reads — toggle POST, activity_logs 기록 | ✅ |
| 좋아요 (LikeButton) — 콘텐츠 상세 하단, 카운트 표시, 비로그인 시 /login 이동 | ✅ |
| api/likes — toggle POST + 카운트 반환, activity_logs 기록 | ✅ |
| 댓글 (CommentSection) — 작성/삭제, 비로그인 유도, parent_id=null 최상위만 | ✅ |
| api/comments — POST(작성) + DELETE(본인 or Level 3+), activity_logs 기록 | ✅ |
| /notifications 페이지 — activity_logs 기반 활동 피드 (최근 50건) | ✅ |
| npm run build 에러 없음 | ✅ |
| 실 동작 검증 (로그인→댓글→읽음→좋아요→로그아웃) | ✅ (2026-03-24) |
| 버그 수정: 댓글 작성 후 즉시 표시 (optimistic state update) | ✅ 754f56d |

### Phase 2 노트

- **supabaseAdmin:** SUPABASE_SERVICE_ROLE_KEY 사용 (RLS 우회) — 서버 전용 라우트에만 사용
- **세션 JWT 전략:** next-auth JWT strategy — 매 세션 콜백마다 users 테이블에서 id/role/nickname 갱신
- **ReadButton/LikeButton/CommentSection:** 모두 `'use client'` — 서버에서 초기 상태 주입
- **댓글 대댓글:** Phase 3에서 Level 3 이상 제한으로 추가 예정 (parent_id 컬럼 이미 존재)
- **Apple OAuth:** Apple Developer Program 가입 후 별도 추가 예정

---

## Phase 3 — Q&A + 커뮤니티 ✅ 완료 (2026-03-24)

| 항목 | 상태 |
|------|------|
| Q&A 목록 페이지 (/qa) DB 연동 — 카테고리 필터, 페이지네이션 | ✅ |
| Q&A 작성 페이지 (/qa/new) TipTap 에디터 (Level 1+, 클라이언트 리다이렉트) | ✅ |
| Q&A 상세 페이지 (/qa/[id]) — 좋아요, 해결됨 토글, 연결 콘텐츠 표시 | ✅ |
| Q&A 대댓글 (Level 1+ 모두 가능, QACommentSection 트리 구조) | ✅ |
| [도움됨] 버튼 (is_helpful) — Q&A 작성자만 토글, api/qa/[id]/helpful | ✅ |
| 콘텐츠 대댓글 (Level 3+ 앱 레벨 제한, comments API parent_id 지원) | ✅ |
| BMC 섹션 — Q&A 상세 하단 자동 노출 | ✅ |
| 관련 Q&A 연결 (content_id) — 콘텐츠 상세 사이드바 RelatedQA 서버 컴포넌트 | ✅ |
| npm run build 에러 없음 | ✅ |

### Phase 3 노트

- **TipTap 에디터:** `@tiptap/react` + `@tiptap/starter-kit` 설치. Bold/Italic/리스트/인용/코드 툴바 제공
- **QAActions:** 클라이언트 컴포넌트 — 좋아요 토글 + 해결됨 토글 (작성자 전용)
- **QACommentSection:** 댓글 트리 구조 (최상위 + 대댓글), 도움됨 마킹, optimistic update
- **comments API 확장:** `qa_post_id`, `parent_id` 필드 추가. 콘텐츠 대댓글은 role < 3 시 403
- **RelatedQA:** 콘텐츠 상세 사이드바 — content_id 기준 연결된 Q&A 최신 2개 자동 표시
- **BMC:** Q&A 상세 하단 항상 노출. 콘텐츠는 show_bmc=true 시에만 노출 (Phase 2부터 유지)

---

## Phase 4 — 어드민 + 배지 ✅ 완료 (2026-03-24)

| 항목 | 상태 |
|------|------|
| Admin Layout — 좌측 사이드바 + 상단 헤더 | ✅ |
| /admin 대시보드 — 통계 4개 + 카테고리 뷰 비율 + 최근 회원 + Global Toggles UI | ✅ |
| /admin/users — 회원 리스트, 닉네임/이메일 검색, 휴면 회원 필터 | ✅ |
| /admin/users/[id] — 상세 정보, 참여율 계산, 배지 표시, 활동 피드 | ✅ |
| 참여율 공식 (SPEC.md §14) — A+B+C/D×100, 프로그레스 바, 승급 조건 표시 | ✅ |
| 회원 Suspend/Unsuspend (Level 3+), Ban (Level 4), Role 변경 (Level 4) | ✅ |
| Suspended/Banned 계정 로그인 차단 (auth-options signIn callback) | ✅ |
| /admin/contents — 콘텐츠 목록, is_published 토글, show_bmc 토글 | ✅ |
| /admin/contents/new — BlockNote 에디터로 새 콘텐츠 작성 | ✅ |
| /admin/contents/[id]/edit — 기존 콘텐츠 수정 (BlockNote) | ✅ |
| BlockNote @blocknote/react + @blocknote/mantine 설치 및 연동 | ✅ |
| /admin/analytics — 로그인 추이 차트, 조회수 Top 10, 최근 활동 로그, 좋아요 요약 | ✅ |
| 배지 자동 부여 API (POST /api/admin/badges/check) — 4종 배지 조건 체크 | ✅ |
| 댓글 고정 API (POST /api/admin/comments/[id]/pin) — Level 4 전용 | ✅ |
| npm run build 에러 없음 | ✅ |
| SiteShell 컴포넌트 — /admin 경로에서 사이트 Navbar/Sidebar/Footer 분리 | ✅ |
| Git commit + push | ✅ 5bbf3a7 |
| Vercel 배포 확인 | ✅ (2026-03-24) |

### Phase 4 노트

- **BlockNote:** `@blocknote/react + @blocknote/mantine` dynamic import (SSR: false) 사용. 콘텐츠 body_mdx에 HTML 저장
- **참여율 공식:** `MIN((A×5 + B×2 + C) / MAX(10, 일수×0.5) × 100, 100)` — 회원 상세 좌측 카드에 프로그레스 바 표시
- **배지 체크:** `/api/admin/badges/check?user_id=xxx` POST로 수동 트리거. `user_badges` 테이블 UPSERT (ignoreDuplicates)
- **계정 차단:** signIn callback에서 status=suspended/banned 시 `/login?error=AccountBlocked` 반환
- **Admin Test SQL:** `UPDATE users SET role = 4 WHERE email = 'poisian@gmail.com';`

---

## Phase 4 보완 2 — 드래그앤드롭 + ISR 최적화 ✅ 완료 (2026-03-26)

| 항목 | 상태 |
|------|------|
| /admin/contents — ▲▼ 버튼 → @dnd-kit 드래그앤드롭으로 교체 | ✅ |
| POST /api/admin/contents/reorder — pair swap → bulk items 배열로 변경 | ✅ |
| canDrag 필터 제한 제거 — Custom Order면 필터 유무 무관하게 drag 활성 | ✅ |
| ISR 적용 — force-dynamic → revalidate (홈 3600, 카테고리 3600, 콘텐츠 상세 600, Q&A 목록 60, Q&A 상세 300) | ✅ |
| ViewTracker 클라이언트 컴포넌트 — ISR 캐시 여부와 무관하게 view_count 증가 | ✅ |
| POST /api/contents/[slug]/view — 클라이언트 호출용 view_count 증가 API | ✅ |
| Vercel Function Region → icn1 (Seoul) 변경 + 재배포 | ✅ |
| /[category] 쿼리 — nullsFirst: false + created_at 보조 정렬 추가 | ✅ |

### Phase 4 보완 2 노트

- **dnd-kit:** `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` 설치. PointerSensor(distance: 5) 사용
- **ISR:** admin/profile/search는 force-dynamic 유지. 나머지 공개 페이지만 revalidate 적용
- **ViewTracker:** `useEffect`에서 `/api/contents/[slug]/view` POST 호출 (fire-and-forget). 서버 컴포넌트에서 view_count 증가 코드 제거
- **서울 리전:** Vercel Settings → Functions → Function Region → icn1 변경 후 empty commit으로 재배포

---

## Phase 4 보완 — Admin Content 관리 개선 ✅ 완료 (2026-03-25)

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
| 필터/정렬 버그 수정 — startTransition+router.push → window.location.href (하드 네비게이션) | ✅ |
| useEffect로 initialContents 동기화 — 필터 후 클라이언트 state 즉시 반영 | ✅ |

### Phase 4 보완 노트

- **filter/sort 버그 원인:** `startTransition(() => router.push(...))` 이 Next.js 14 App Router에서 서버 컴포넌트 searchParams를 신뢰할 수 있게 업데이트하지 않음 → `window.location.href` 하드 네비게이션으로 교체
- **sort_order:** Supabase SQL Editor에서 `002_add_sort_order.sql` 수동 실행 필요. 신규 글은 sort_order=NULL → PostgreSQL이 자동으로 마지막 배치
- **공개 카테고리 페이지:** sort_order ASC로 정렬 → admin에서 설정한 순서가 사용자에게 그대로 반영

---

## 다음 세션 시작 방법

```
PROGRESS.md 읽고 Phase 5 (배포 최적화, 운영 준비) 작업해줘
```

## Vercel 배포 URL

- **Production:** https://know-korea-bweqru87f-ventureops-projects.vercel.app
- **GitHub:** https://github.com/ventureops/know-korea

---

## 참고 사항

- `content/pages/` 에 about.mdx, faq.mdx, legal.mdx 이미 존재 (Phase 1에서는 직접 컴포넌트로 구현)
- `app/fonts/` 에 Geist 폰트 파일 있음 (사용 안 함 — Google Fonts CDN 사용)
- Supabase / Vercel / Cloudinary 계정 연결은 별도로 진행 필요
- Phase 1 보완: Unsplash 이미지 URL 계속 사용 (Phase 2 이후 Cloudinary 교체)
- Vercel 환경변수도 별도 설정 필요 (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
