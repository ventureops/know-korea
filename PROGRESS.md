# PROGRESS.md — Know Korea

> 새 세션 시작 시 이 파일을 먼저 읽어 현재 상태를 파악한다.

---

## 현재 상태

**Phase 1 보완 완료 + 실 DB 검증 완료 / Phase 2 진행 중 (Google OAuth ✅, 사용자 기능 ⬜)**

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

## Phase 2 — 인증 + 사용자 기능 🏗️ 진행 중

SPEC.md §17 Phase 3 체크리스트 참조.

| 항목 | 상태 |
|------|------|
| NextAuth.js 설정 (Google OAuth) | ✅ (665d20d) |
| lib/auth-options.ts (authOptions 분리) | ✅ |
| components/auth/LoginButtons.tsx (Google signIn) | ✅ |
| components/auth/SessionProvider.tsx | ✅ |
| types/next-auth.d.ts (id, role, nickname 타입 확장) | ✅ |
| Navbar 세션 연동 (프로필 드롭다운, 로그아웃) | ✅ |
| 로그인 / 회원가입 기능 연결 | ✅ (Google OAuth 작동) |
| .env.local.example 플레이스홀더로 정리 | ✅ |
| 프로필 페이지 DB 연동 | ⬜ |
| 좋아요 기능 | ⬜ |
| 읽음 표시 기능 | ⬜ |
| 댓글 기능 | ⬜ |
| 알림 기능 | ⬜ |

---

## 다음 세션 시작 방법

```
PROGRESS.md 읽고 Phase 2 이어서 작업해줘
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
