# 리서치 랭크

https://social-archive.github.io/ 에서 운영하는 리서치 순위·브리핑 대시보드입니다. 기존 Bachata 사이트를 대체합니다.

## 구조

- 프런트엔드: GitHub Pages (Vite 정적 빌드)
- 백엔드: `https://sarc.uaru-corn.ts.net/api/research` (Tailscale Funnel)
- 인증·DB: Supabase. 로그인 후 소유자 계정의 데이터만 읽습니다.
- AI 워크플로우: 주제, 출처, 순위 기준을 결정하고 Supabase에 결과를 저장합니다. 아직 연결하지 않았습니다.

이 공개 저장소에 리서치 데이터, 사용자 정보, 서비스 역할 키는 넣지 않습니다. 로그인용 publishable 설정은 백엔드의 `/config`에서 받습니다.

## 실행과 배포

Node 24 이상에서 `npm ci`, `npm run dev`로 실행합니다. `npm test`, `npm run build` 후 main 푸시 시 GitHub Actions가 `dist/`만 Pages에 배포합니다.

API 주소를 바꿀 때는 빌드 시 `VITE_API_BASE`를 지정합니다. 로컬 UI에서 API를 사용할 때는 백엔드의 CORS 허용 출처를 개발 환경에 맞게 설정해야 합니다. 운영에서는 GitHub Pages 출처만 허용합니다.

## 최초 Supabase 설정

백엔드 저장소의 `supabase/migrations/202611060001_research_briefings.sql`을 Supabase SQL Editor에서 실행합니다. 테이블은 RLS를 사용하며 로그인한 소유자만 자신의 행을 읽을 수 있습니다.

Supabase Authentication → URL Configuration의 Redirect URLs에 `https://social-archive.github.io/`를 추가합니다. 백엔드 `.env`는 기존 Supabase URL·publishable key·소유자 이메일 설정을 사용합니다. 서비스 역할 키는 브라우저에 전달하지 않습니다.

## AI 워크플로우 데이터

`research_briefings` 테이블에 다음 필드를 저장합니다. `id`는 UUID이며 워크플로우가 같은 결과를 갱신할 때 유지합니다. `owner_id`에는 브리핑을 볼 사용자의 Supabase Auth UUID를 넣습니다.

| 필드 | 의미 |
| --- | --- |
| title / category | 제목 / 주제 |
| rank | 워크플로우가 결정한 양의 정수 순위 |
| summary / content | 핵심 요약 / 상세 브리핑 (일반 텍스트) |
| rationale / ranking_basis | 선정 이유 / 순위 기준 |
| sources | `[{"title":"원문 제목","url":"https://..."}]` |
| published_at | 발행 시각 |

브리핑 API는 순위순 최대 500건을 반환합니다. 주제별 순위 기준과 히스토리가 확정되면 발행 단위·페이지네이션을 확장합니다. 현재 화면은 순위를 다시 계산하지 않습니다.
