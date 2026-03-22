# PROGRESS.md — Know Korea

> 새 세션 시작 시 이 파일을 먼저 읽어 현재 상태를 파악한다.

---

## 현재 상태

**Phase 1 완료 / Phase 2 시작 전**

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
| 모바일 반응형 확인 (375px / 768px) | ⬜ (직접 확인 필요) |
| 첫 Vercel 배포 | ⬜ |

### Phase 1 구현 노트

- **Navbar:** Glassmorphism (bg-surface/70 backdrop-blur-xl), 로고 + 링크 + 검색 아이콘 + 프로필
- **Sidebar:** 카테고리 12개, 활성 아이템 left pill indicator + filled icon
- **Footer:** bg-surface-container-low, 로고 + 저작권 + 링크 4개
- **레이아웃:** pt-14 md:pl-64 로 nav/sidebar 오프셋
- **홈:** Hero + 카드 3개(상단) + 컴팩트 2개(하단) + Bento 3개 + 최신 가이드 리스트
- **카테고리:** 더미 6개 카드 그리드, 페이지네이션 UI
- **상세:** TOC 사이드바, BMC 섹션, 댓글 영역, 관련 글
- **정적 페이지:** About(스토리+feature grid), FAQ(아코디언), Legal(Privacy+Terms)
- **검색:** 필터 칩 + 카드 그리드 결과
- **404:** 이미지 + 텍스트 + 홈/뒤로가기 버튼
- **로그인/회원가입:** 2-column split (이미지+폼 / 기능목록+폼), Google+Apple OAuth UI

---

## Phase 2 — 콘텐츠 페이지 + DB 읽기 🏗️ 대기 중

SPEC.md §17 Phase 2 체크리스트 참조.

| 항목 | 상태 |
|------|------|
| Supabase 연동 (클라이언트/서버 설정) | ⬜ |
| 카테고리 목록 페이지 DB 연동 | ⬜ |
| 콘텐츠 상세 페이지 DB 연동 | ⬜ |
| 검색 기능 구현 | ⬜ |
| SEO (메타태그, OG 태그) | ⬜ |

---

## 다음 세션 시작 방법

```
PROGRESS.md 읽고 Phase 2 이어서 작업해줘
```

---

## 참고 사항

- `content/pages/` 에 about.mdx, faq.mdx, legal.mdx 이미 존재 (Phase 1에서는 직접 컴포넌트로 구현)
- `app/fonts/` 에 Geist 폰트 파일 있음 (사용 안 함 — Google Fonts CDN 사용)
- Supabase / Vercel / Cloudinary 계정 연결은 별도로 진행 필요
- Phase 1 더미 데이터는 Unsplash 이미지 URL 사용 (Phase 2에서 Cloudinary로 교체)
