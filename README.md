# 리서치 랭크

https://social-archive.github.io/ 에서 운영하는 리서치 순위·브리핑 대시보드입니다. 기존 Bachata 사이트를 대체합니다.

## 구조

- 프런트엔드: GitHub Pages (Vite 정적 빌드)
- 백엔드: `https://sarc.uaru-corn.ts.net/api/research` (Tailscale Funnel)
- DB: Supabase. 현재 화면은 로그인 없이 공개 발행된 리서치만 읽습니다.
- AI 워크플로우: 주제, 출처, 순위 기준을 결정하고 Supabase에 결과를 저장합니다. 아직 연결하지 않았습니다.

이 공개 저장소에 리서치 데이터, 사용자 정보, 서비스 역할 키는 넣지 않습니다. 소셜 로그인은 `social-login.js`와 백엔드 인증 경로에 보관하며, 현재 화면에서 불러오거나 실행하지 않습니다.

## 실행과 배포

Node 24 이상에서 `npm ci`, `npm run dev`로 실행합니다. `npm test`, `npm run build` 후 main 푸시 시 GitHub Actions가 `dist/`만 Pages에 배포합니다.

API 주소를 바꿀 때는 빌드 시 `VITE_API_BASE`를 지정합니다. 로컬 UI에서 API를 사용할 때는 백엔드의 CORS 허용 출처를 개발 환경에 맞게 설정해야 합니다. 운영에서는 GitHub Pages 출처만 허용합니다.

## 최초 Supabase 설정

백엔드 저장소의 `supabase/migrations/202611060001_research_briefings.sql`, `202611060002_public_briefings.sql`을 순서대로 적용합니다. 테이블은 RLS를 사용하며 익명 사용자는 `is_public = true`인 행만 읽습니다. 기존 행과 신규 행의 기본값은 비공개입니다.

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
| is_public | 공개 발행 여부. 명시적으로 true인 결과만 로그인 없는 화면에 노출 |

브리핑 API는 순위순 최대 500건을 반환합니다. 주제별 순위 기준과 히스토리가 확정되면 발행 단위·페이지네이션을 확장합니다. 현재 화면은 순위를 다시 계산하지 않습니다.
