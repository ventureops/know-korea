# Design System — Know Korea — Actually need to navigate Korea

> **목적:** 이 문서는 AI 코드 에이전트(Claude Code)가 디자인 의도를 정확히 이해하고 일관된 UI를 생성하기 위한 가이드라인이다.  
> **원본 소스:** Stitch에서 내보낸 22개 HTML 화면 + 스크린샷  
> **함께 참조:** `spec.md` (기능 명세)

---

## 1. Creative Direction

Know Korea는 "프리미엄 트래블 매거진"과 "커뮤니티 포럼"의 중간 지점이다.

**핵심 키워드:** Authoritative · Welcoming · Editorial · Breathable

- 에디토리얼 명확성: 큰 타이포그래피와 넉넉한 여백으로 잡지 같은 느낌
- Reddit 스타일이 아닌, 정제된 톤과 프리미엄 레이아웃
- 한국적 정체성은 "단청 레드" 액센트와 은은한 전통 모티프로 표현 (과하지 않게)

---

## 2. Color System

### Core Tokens

모든 화면에서 공통으로 사용하는 Tailwind custom color 토큰이다.

**Brand Colors:**

| Token | Hex | 역할 |
|-------|-----|------|
| `primary` | `#425C85` | 주요 브랜드, CTA, 활성 상태 |
| `primary-dim` | `#365079` | Primary hover 상태 |
| `primary-container` | `#B3CDFD` | 뱃지/아이콘 배경, 프로필 테두리 |
| `tertiary` | `#B31A35` | "단청 레드" — 알림, 강조 액센트. 절제해서 사용 |
| `tertiary-container` | `#FF9196` | 알림/경고 배경 |
| `brand-navy` | `#1A365D` | 로고, 강조 링크 |

**Surface 계층 (핵심 원칙):**

선(border)이 아니라 배경색 단계 변화로 영역을 구분한다.

| Token | Hex | 개념 |
|-------|-----|------|
| `surface` | `#F6F5FF` | 전역 캔버스 (라벤더 틴트, 순백 아님) |
| `surface-container-low` | `#EEF0FF` | 그룹 영역, 푸터, 입력 필드 배경 |
| `surface-container` | `#E2E7FF` | 중간 레벨 영역, 썸네일 배경 |
| `surface-container-high` | `#DBE1FF` | 필터 칩, 인터랙션 요소 배경 |
| `surface-container-highest` | `#D3DCFF` | 테이블/보더 대용 |
| `surface-container-lowest` | `#FFFFFF` | 최상위 — 카드, 모달 (유일한 순백) |
| `inverse-surface` | `#000B2D` | 다크 배너, 어두운 블록 |

**텍스트 Colors:**

| Token | Hex | 역할 |
|-------|-----|------|
| `on-surface` | `#202D51` | 기본 본문, 제목 |
| `on-surface-variant` | `#4E5A81` | 보조 텍스트, 메타 정보 |
| `on-primary` | `#EFF2FF` | Primary 배경 위 텍스트 |
| `on-tertiary` | `#FFEFEE` | Tertiary 배경 위 텍스트 |
| `outline` | `#69769E` | 약한 외곽선, disclaimer |
| `outline-variant` | `#9FACD7` | Ghost border (15% opacity로 사용) |

**Error:**

| Token | Hex |
|-------|-----|
| `error` | `#B31B25` |
| `error-container` | `#FB5151` |

**Success (읽음 표시 전용):**

| Token | Hex | 역할 |
|-------|-----|------|
| `success` | `#16A34A` | 읽음 버튼 활성 상태 (green-600 기반) |
| `success-container` | `#DCFCE7` | 읽음 버튼 배경 (green-100 기반) |
| `on-success` | `#FFFFFF` | success 배경 위 텍스트/아이콘 |

**Special (1회성):**

| Hex | 용도 |
|-----|------|
| `#2D456E` | Buy Me a Coffee 섹션 배경 |
| `#E9C48C` | Buy Me a Coffee 버튼 (골드) |

### 색상 규칙 (AI 필수 준수)

1. **No-Line Rule:** `border`로 영역을 나누지 마라. Surface 색상 단계 변화로 경계를 만들어라.
2. **Ghost Border만 허용:** 불가피한 경우 `border-outline-variant/15` (거의 안 보이는 수준).
3. **순백 #FFFFFF 제한:** 카드(`surface-container-lowest`)에만 사용. 배경은 반드시 `surface`(#F6F5FF).
4. **순수 회색 금지:** 모든 중성색은 navy 또는 lavender 틴트가 있어야 한다.

---

## 3. Typography

### Font Pairing

| 역할 | Font | Tailwind Class |
|------|------|----------------|
| Display / Headline | **Plus Jakarta Sans** | `font-headline` |
| Body / Label | **Manrope** | `font-body`, `font-label` |
| Icon | Material Symbols Outlined | `material-symbols-outlined` |

```css
body { font-family: 'Manrope', sans-serif; }
h1, h2, h3, h4 { font-family: 'Plus Jakarta Sans', sans-serif; }
```

### Type Scale 가이드

| 용도 | 대략적 크기 | 스타일 |
|------|-----------|--------|
| 히어로 타이틀 | 3–4.5rem | Jakarta, extrabold, tracking-tight |
| 페이지 타이틀 | 2.25–3rem | Jakarta, extrabold, tracking-tight |
| 섹션 타이틀 | 1.5rem | Jakarta, bold |
| 카드 타이틀 | 1.125rem | Jakarta, bold |
| 본문 | 1rem | Manrope, regular–medium |
| 보조 텍스트 | 0.875rem | Manrope, regular–medium |
| 메타/라벨 | 0.75rem | Manrope, bold |
| 오버라인 | 10px | uppercase, tracking-wider, bold |

### Typography 원칙

- Display 레벨은 `tracking-tight`, 오버라인은 `tracking-wider`
- 카드 내 텍스트는 `line-clamp`으로 일관된 높이 유지
- 본문은 `leading-relaxed`로 여유 있는 행간

---

## 4. Spacing & Layout

### Global Structure

- **Top Nav:** fixed, z-50, 높이 약 48–64px
- **Side Nav:** fixed left, z-40, 너비 256px (w-64), 모바일에서 숨김
- **Main Content:** top nav + side nav 오프셋 후 시작
- **Max Width:** 페이지별로 `max-w-4xl` ~ `max-w-7xl`

### Spacing 원칙

- **컴포넌트 내부:** 16–24px (p-4 ~ p-6)
- **컴포넌트 간:** 16–32px (gap-4 ~ gap-8)
- **섹션 간:** 48–96px (mb-12 ~ mb-24)
- **리스트 아이템 구분:** 선(divider) 없이 spacing만으로 (`space-y-4`)

### Grid 패턴

- **콘텐츠 + 사이드바:** 12-column → 8:4 비율
- **카테고리 Bento:** 3-column even
- **Admin 통계:** 4-column (xl 이상)
- **2-column split:** 로그인/회원가입 (일러스트 + 폼)

### Responsive

- `md`(768px)부터 사이드바 표시
- `lg`(1024px)부터 2-column split 레이아웃
- 모바일은 단일 컬럼, 사이드바 숨김

---

## 5. Border Radius

| 크기 | 사용처 |
|------|--------|
| `rounded-lg` (8px) | 입력 필드, 작은 카드 |
| `rounded-xl` (12px) | 중형 카드, 버튼 |
| `rounded-2xl` (16px) | 대형 카드, 알림 아이템 |
| `rounded-3xl` (24px) | Bento 블록 |
| `rounded-full` | 프로필 이미지, 칩, 아이콘 버튼 |

전반적으로 넉넉한 라운딩을 사용하여 부드러운 인상을 준다.

---

## 6. Elevation & Effects

### Glassmorphism

고정 요소(Top Nav, Side Nav)에만 적용한다:
- 반투명 배경: `bg-surface/70`
- 블러: `backdrop-blur-xl` ~ `backdrop-blur-2xl`

### Shadow

- 기본 카드: `shadow-sm` (거의 안 보이는 수준)
- 카드 hover: `shadow-xl` (부드러운 전환)
- 강조 블록: `shadow-xl shadow-primary/20` (컬러 틴트)
- **Drop shadow를 무겁게 사용하지 않는다.** 2010년대 Material Design의 "떠있는 박스" 느낌을 피한다.

### Transition

- 모든 인터랙션에 `transition-all` 또는 `transition-colors` 적용
- 버튼 press: `active:scale-95`
- 사이드바 hover: `hover:translate-x-1`

---

## 7. Iconography

- **Material Symbols Outlined** 사용
- 기본: `FILL: 0, wght: 400` (thin-stroke)
- 강조/활성 상태에서만 `FILL: 1` (filled)
- Bento 카테고리의 장식 아이콘: 크게(text-6xl), 낮은 opacity(20%), 살짝 기울임(rotate-12)

---

## 8. Component 패턴 가이드

> 아래는 "이렇게 만들어라"는 정확한 CSS가 아니라, 각 컴포넌트의 **디자인 의도와 패턴**이다.

### Navigation

- **Top Nav:** Glassmorphism, 로고 + 메인 링크 + 검색 + 프로필. 활성 링크는 `font-bold` + `border-b-2`.
- **Side Nav:** Glassmorphism, 카테고리 목록. 활성 아이템은 왼쪽 2–4px 세로 pill indicator + bold + 배경색 변화. 선(border)으로 메인 콘텐츠와 구분하지 않는다.

### Buttons

- **Primary:** `bg-primary` + `text-on-primary`, 둥근 모서리, bold. Hover 시 `primary-dim`.
- **Secondary/Ghost:** Surface 계열 배경, border 없음. UI에 자연스럽게 녹아드는 느낌.
- **Dark/Inverse:** `bg-on-background` + `text-surface`. Apple 로그인, Admin 강조 액션에 사용.
- **Pill:** `rounded-full`. BMC 버튼, 필터 칩에 사용.

### Cards

- 배경: `surface-container-lowest` (순백)
- Ghost border: `border-outline-variant/15`
- Hover: shadow 증가 + 전환 애니메이션
- 내부: 카테고리 오버라인 + 타이틀 + 설명 + 메타
- **Bento 카테고리 카드:** 색상 배경(primary/tertiary/highest) + 장식 아이콘(큰 크기, 저 opacity, 회전)

### Lists

- **구분선(divider) 금지.** 여백(`space-y-4`)으로만 아이템을 구분한다.
- Hover 시 `bg-surface-container-lowest`로 약한 하이라이트
- 썸네일(있을 경우) + 타이틀 + 설명 + 우측 메타 + 화살표 아이콘

### Filter Chips

- 활성: `bg-primary text-on-primary rounded-full`
- 비활성: `bg-surface-container-high text-on-surface-variant rounded-full`

### Forms

- 입력 필드: `bg-surface-container-low`, border 없음, focus 시 `ring-2 ring-primary`
- placeholder: 약한 opacity

### Footer

- `bg-surface-container-low`, 로고 + 저작권 + 링크 목록
- 간결하게, 과도한 정보 없이

---

## 9. Do's & Don'ts

### ✅ Do

- Surface 색상 변화로 영역 경계를 표현한다
- 카드에 `group` hover 패턴을 사용한다
- 오버라인 텍스트에 `uppercase tracking-wider` 적용
- 아이콘은 기본 Outlined, 강조 시에만 Filled
- 모든 인터랙션에 부드러운 transition
- "흰색 배경"은 `#F6F5FF`(surface), 순백은 카드에만

### ❌ Don't

- `1px solid` border로 사이드바/섹션을 구분하지 않는다
- 무거운 drop shadow를 사용하지 않는다
- 순수 회색(#808080 계열)을 사용하지 않는다
- 콘텐츠를 빽빽하게 채우지 않는다 — 여백을 충분히
- 리스트에 구분선(hr, border-b)을 넣지 않는다
- 아이콘 stroke를 2pt 이상으로 두껍게 하지 않는다

---

## 10. Tailwind Config

모든 화면에서 공통으로 사용하는 설정이다.

```javascript
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#425c85",
        "primary-dim": "#365079",
        "primary-container": "#b3cdfd",
        "primary-fixed": "#b3cdfd",
        "primary-fixed-dim": "#a5bfee",
        "on-primary": "#eff2ff",
        "on-primary-container": "#2a446c",
        "on-primary-fixed": "#133057",
        "on-primary-fixed-variant": "#334d76",
        "secondary": "#575c60",
        "secondary-dim": "#4b5054",
        "secondary-container": "#dfe3e7",
        "secondary-fixed": "#dfe3e7",
        "secondary-fixed-dim": "#d1d5d9",
        "on-secondary": "#eff3f7",
        "on-secondary-container": "#4d5256",
        "on-secondary-fixed": "#3b4043",
        "on-secondary-fixed-variant": "#575c60",
        "tertiary": "#b31a35",
        "tertiary-dim": "#a2052b",
        "tertiary-container": "#ff9196",
        "tertiary-fixed": "#ff9196",
        "tertiary-fixed-dim": "#ff7982",
        "on-tertiary": "#ffefee",
        "on-tertiary-container": "#680017",
        "on-tertiary-fixed": "#390009",
        "on-tertiary-fixed-variant": "#79001d",
        "error": "#b31b25",
        "error-dim": "#9f0519",
        "error-container": "#fb5151",
        "on-error": "#ffefee",
        "on-error-container": "#570008",
        "success": "#16a34a",
        "success-container": "#dcfce7",
        "on-success": "#ffffff",
        "surface": "#f6f5ff",
        "surface-bright": "#f6f5ff",
        "surface-dim": "#c7d3ff",
        "surface-variant": "#d3dcff",
        "surface-tint": "#425c85",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eef0ff",
        "surface-container": "#e2e7ff",
        "surface-container-high": "#dbe1ff",
        "surface-container-highest": "#d3dcff",
        "on-surface": "#202d51",
        "on-surface-variant": "#4e5a81",
        "on-background": "#202d51",
        "background": "#f6f5ff",
        "outline": "#69769e",
        "outline-variant": "#9facd7",
        "inverse-surface": "#000b2d",
        "inverse-on-surface": "#8f9cc6",
        "inverse-primary": "#b3cdfd",
        "brand-navy": "#1A365D"
      },
      fontFamily: {
        "headline": ["Plus Jakarta Sans"],
        "body": ["Manrope"],
        "label": ["Manrope"]
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      }
    }
  }
}
```

### Font CDN

```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
```
