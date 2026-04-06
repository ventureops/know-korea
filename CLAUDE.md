# CLAUDE.md — Know Korea

## 세션 시작 시 필수 순서
1. CLAUDE.md (이 파일) 읽기
2. PROGRESS.md 읽고 현재 상태 파악
3. SPEC.md에서 현재 Phase 해당 섹션 확인
4. DESIGN.md 참조
5. brand_assets/ 폴더 확인
6. 작업 시작

---

## ⚠️ SPEC과 실제 구현이 다른 사항

아래 항목은 SPEC.md와 실제 코드베이스가 다릅니다. 
**항상 실제 코드 기준으로 작업할 것.**

| SPEC 표기 | 실제 구현 | 비고 |
|-----------|----------|------|
| `profiles` 테이블 | `users` 테이블 | RLS 정책, JOIN, 쿼리 모두 `users` 사용 |

SQL 마이그레이션이나 RLS 정책 작성 시 반드시 기존 마이그레이션 파일을 먼저 확인하고,
테이블명·정책명 중복 여부를 체크할 것.

## Next.js App Router 주의사항

- 서버 컴포넌트에서는 onClick, onChange 등 이벤트 핸들러 사용 불가 → <Link> 사용
- "use client" 컴포넌트에서는 export const metadata 불가 → layout.tsx로 분리
- 새 페이지 생성 시, 대상 파일이 서버/클라이언트 중 어느 쪽인지 먼저 확인할 것

## Vercel 배포 주의사항
- 환경변수 추가/수정 후 반드시 Redeploy 필요 (자동 반영 안 됨)


## 프로젝트 정보

| 항목 | 값 |
|------|-----|
| 사이트명 | Know Korea |
| 태그라인 | The Modern Envoy — Your Digital Curator |
| 프레임워크 | Next.js 14 (App Router) |
| 스타일링 | Tailwind CSS (커스텀 토큰은 DESIGN.md 참조) |
| DB | Supabase (PostgreSQL) |
| 인증 | NextAuth.js (Google / Apple OAuth) |
| 이미지 | Cloudinary |
| 배포 | Vercel |

---

## 문서 우선순위

동일 주제에 대해 문서 간 충돌이 있으면 아래 순서를 따른다:

1. **DESIGN.md** — 색상, 타이포, 스페이싱, 시각적 패턴의 최종 기준
2. **SPEC.md** — 기능, 권한, DB 스키마, 라우팅의 최종 기준
3. **CLAUDE.md** (이 파일) — 코딩 규칙과 행동 규칙

시각적 요소(Nav 구조, 레이아웃 배치 등)에서 SPEC.md와 DESIGN.md가 다를 경우, **DESIGN.md(Stitch 디자인)을 따른다.** SPEC.md는 추후 동기화 예정이다.

---

## 코딩 규칙

### 색상
- DESIGN.md의 Tailwind Config에 정의된 커스텀 토큰만 사용
- Tailwind 기본 색상(blue-500, indigo-600, gray-300 등) 사용 금지
- 순수 회색(#808080 계열) 금지 → navy/lavender 틴트가 있는 커스텀 토큰 사용
- 순백(#FFFFFF)은 `surface-container-lowest` 토큰으로만 사용, 배경에 직접 쓰지 않음
- 읽음 버튼 활성 상태: `success` (#16A34A) 토큰 사용

### 레이아웃
- No-Line Rule: `border`로 영역을 나누지 않는다. Surface 색상 단계 변화로 경계 표현
- Ghost Border 허용: 불가피한 경우 `border-outline-variant/15`만
- 리스트 아이템 구분선(divider) 금지 → spacing으로만 구분

### 인터랙션
- 모든 클릭 요소에 hover / focus-visible / active 상태 필수
- transition-all, transition-colors 사용 허용 (DESIGN.md 기준)
- 버튼 press: `active:scale-95`
- 카드 hover: shadow 증가 + transition

### 반응형
- 모바일 퍼스트로 작성
- `md`(768px): 사이드바 표시
- `lg`(1024px): 2-column split
- 사이드바: 모바일에서 `hidden md:flex`

### 아이콘
- Material Symbols Outlined 사용
- 기본: `FILL: 0, wght: 400`
- 강조/활성 시에만 `FILL: 1`

### 파일 구조
- 컴포넌트 위치: SPEC.md 19번 파일 구조 참조
- 페이지: `app/` 디렉토리 (App Router)
- 재사용 컴포넌트: `components/` 하위 도메인별 폴더

---

## 권한 체계 (반드시 준수)

| Level | 이름 | 핵심 |
|-------|------|------|
| 0 | Visitor | 열람만 |
| 1 | Subscriber | 댓글, Q&A, 좋아요, 읽음 |
| 2 | Contributor | Level 1 + 향후 글쓰기 |
| 3 | Moderator | + 댓글 삭제, 회원 모니터링, 대댓글(콘텐츠) |
| 4 | Admin | 전체 권한 |

기능별 상세 매핑: SPEC.md §3 참조. 특히:
- 콘텐츠 대댓글: Level 3 이상만
- Q&A 대댓글: Level 1 이상 모두 가능
- 댓글 고정: Level 4만
- 회원 권한 변경: Level 4만

---

## Phase 구조 (5단계)

각 Phase에서 무엇을 만드는지 빠르게 파악하기 위한 요약이다. 상세 체크리스트는 SPEC.md §17 참조.

| Phase | 핵심 목표 | 주요 산출물 |
|-------|----------|------------|
| 1 | 레이아웃 + 정적 페이지 | Nav, Sidebar, Footer, Home, About, FAQ, Legal, 404, Login/Signup UI |
| 2 | 콘텐츠 페이지 + DB 읽기 | 카테고리 목록, 콘텐츠 상세, 검색, Supabase 연동, SEO |
| 3 | 인증 + 사용자 기능 | OAuth, 프로필/수정/활동내역, 알림, 읽음, 좋아요, 댓글 |
| 4 | Q&A + 커뮤니티 | Q&A CRUD, TipTap, 대댓글, 도움됨, BMC, 관련글 연결 |
| 5 | 어드민 + 배지 | Admin 대시보드, 회원/콘텐츠/Q&A 관리, BlockNote, 배지 자동부여 |

**원칙:** 이전 Phase가 완료되기 전에 다음 Phase로 넘어가지 않는다.

---

## Context 관리 규칙

- context 잔여량 30% 이하 → 현재 작업 단위 완료 후 즉시 중단
- PROGRESS.md 업데이트 후 아래 메시지 출력:

```
⚠️ Context 30% 남았습니다. PROGRESS.md 업데이트 완료.
새 세션에서 'PROGRESS.md 읽고 이어서 작업해줘'로 시작하세요.
```

---

## 스크린샷 워크플로우

- 반드시 `localhost:3000`에서 실행 (file:// 금지)
- `npm run dev` 실행 후 스크린샷
- 최소 2라운드 비교 검토
- 비교 시 구체적으로 기록: "카드 gap 16px → 24px로 변경 필요"

---

## 금지 사항

- SPEC.md에 없는 기능 임의 추가 금지
- DESIGN.md 기준 외 디자인 임의 변경 금지
- 환경변수 값 코드에 하드코딩 금지
- PROCEDURE.md는 읽지 않아도 됨 (사람용 문서)
- Tailwind 기본 색상 팔레트 사용 금지 (커스텀 토큰만)
