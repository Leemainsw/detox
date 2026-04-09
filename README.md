# Detox

**디지털 구독 다이어트**를 돕는 웹 서비스입니다. 구독을 한곳에서 관리하고, 월별 지출·시장 평균과 비교하며, 커뮤니티에서 정보를 나눌 수 있습니다.

## 앱 구성 (하단 탭)

| 경로 | 설명 |
|------|------|
| `/` **홈** | 내 구독 목록·요약, 구독 추가/상세로 이동 |
| `/statistics` **통계** | 월별 지출, 연령대·서비스 비교, AI 분석 요약 카드 |
| `/statistics/ai` | AI 디톡이와 빠른 질문 기반 소비 분석 (채팅형) |
| `/community` **커뮤니티** | 게시글 목록 (서버 프리패치 + 무한 스크롤) |
| `/community/new`, `/community/[id]`, `…/edit` | 글 작성·상세·수정 |
| `/mypage` **내정보** | 프로필·설정 |
| `/subscription/add`, `/subscription/[id]`, `…/edit` | 구독 등록·상세·수정 |
| `/login` | 로그인 (OAuth·익명 등 Supabase Auth 흐름) |
| `/notifications`, `/notifications/settings` | 알림·알림 설정 |

## 기술 스택

| 영역 | 사용 |
|------|------|
| 프레임워크 | **Next.js 16** (App Router), **React 19** |
| 스타일 | **Tailwind CSS 4**, Radix UI, Framer Motion |
| 아이콘 | Font Awesome (React) |
| 백엔드·인증 | **Supabase** (DB, Auth, `@supabase/ssr`로 서버/클라이언트 연동) |
| 서버 상태 | **TanStack React Query 5** |
| 클라이언트 상태 | **Zustand** (예: AI 분석 결과 로컬 persist) |
| 차트 | Recharts |
| AI (선택 기능) | OpenAI 스트리밍, Tavily 검색 (`/api/analyze`) |

## 시작하기

### 요구 사항

- **Node.js 20** 권장  
- **npm** (또는 pnpm / yarn)

### 설치 및 개발 서버

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인합니다.

### npm 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 |
| `npm run lint` | ESLint |
| `npm run format` | Prettier 적용 |
| `npm run format:check` | Prettier 검사만 |
| `npm run generate-supabase-types` | Supabase 스키마 → `types/supabase.types.ts` 생성 |

## 환경 변수

루트에 `.env.local` 을 두고 설정합니다.

### 필수 (앱·DB·인증)

| 변수 | 설명 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon 공개 키 |

### AI 분석 API 사용 시

통계의 AI 디톡이·`/api/analyze` 를 쓰려면 추가로 필요합니다.

| 변수 | 설명 |
|------|------|
| `OPENAI_API_KEY` | OpenAI API 키 |
| `TAVILY_API_KEY` | Tavily 검색 API 키 |

타입 생성 스크립트 실행 시 `NEXT_PUBLIC_SUPABASE_PROJECT_ID` 가 필요할 수 있습니다.

## 프로젝트 구조 (요약)

```
app/                    # App Router 페이지·레이아웃·API Route
  (home)/               # 홈
  community/            # 커뮤니티 목록·상세·작성·수정
  subscription/         # 구독 CRUD
  statistics/           # 통계 (서버 프리패치 + 클라이언트 컴포넌트)
  statistics/ai/        # AI 분석 화면
  mypage/, login/, notifications/
  api/                  # Route Handlers (예: analyze)
  components/           # 공통 UI (헤더, 하단 네비, 토스트 등)
  providers/            # React Query 등 프로바이더
components/             # shadcn 스타일 UI (`@/components/ui`)
hooks/                  # 커스텀 훅
lib/                    # 유틸 (예: supabase 클라이언트, cn)
query/                  # React Query 키·옵션
services/               # Supabase 호출 등 서비스 레이어
store/                  # Zustand 스토어
types/                  # `supabase.types.ts` 등
app/utils/              # 도메인 유틸 (구독 계산, 브랜드 매핑 등)
```

- **서버 컴포넌트**: 초기 데이터를 서버에서 준비하는 페이지(예: `app/statistics/page.tsx`, `app/community/page.tsx`).  
- **클라이언트 컴포넌트**: 폼, 훅, 인터랙션이 필요한 화면은 `"use client"` 로 분리합니다.

## 배포

Vercel 등 Next.js 호스팅에 맞게 배포합니다.  
프로덕션에도 Supabase 환경 변수는 필수이며, AI 기능을 쓰면 OpenAI·Tavily 키도 함께 넣습니다.

## 라이선스

Private 프로젝트 (`package.json`의 `"private": true`).
