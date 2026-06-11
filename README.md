# PlaceUp

네이버 플레이스 URL을 입력하면 키워드 추천, 플레이스 점수, 개선 방안을 제공하는 SEO 분석 웹 서비스입니다.

## Branch

| Branch | Description |
|--------|-------------|
| `main` | 최종 결과물 |
| `develop` | 변경 후 테스트 |
| `feat/api-integration` | API 연동 작업 |
| `feat/ui` | UI 작업 |

## Features

- **플레이스 URL 분석** — 네이버 플레이스 URL 입력 시 매장 정보 자동 수집
- **플레이스 점수** — 매장 정보 완성도와 리뷰 품질 기반 종합 점수
- **키워드 추천** — 월간 검색량 · 경쟁도 · 유효성 기반 키워드 추천
- **검색 순위 추적** — 키워드별 네이버 검색 순위 제공
- **개선 방안** — 플레이스 · 리뷰 · 경쟁사 관점 피드백 및 방문자 키워드 요약

## Tech Stack

### Design
| | Tool |
|-|------|
| UI/UX | Figma |
| DB 설계 | ERDCloud |
| 아키텍처 | Lucidchart |

### Frontend
| | Tool |
|-|------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS |
| Components | Radix UI + shadcn/ui |
| Charts | Recharts |
| Routing | React Router v7 |
| HTTP | Axios |
| Package Manager | pnpm |

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analysis.ts
│   │   ├── index.ts
│   │   └── type.ts
│   ├── components/
│   │   └── Header.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── AnalysisProgress.tsx
│   │   └── AnalysisResult.tsx
│   ├── App.tsx
│   └── routes.tsx
├── styles/
│   ├── index.css
│   ├── tailwind.css
│   ├── theme.css
│   └── fonts.css
└── main.tsx
```
## Pages
<img width="2543" height="1180" alt="image" src="https://github.com/user-attachments/assets/757673c3-92bf-4707-8023-1ea24f26845f" />
<img width="2267" height="1416" alt="image" src="https://github.com/user-attachments/assets/807f24e9-8d65-40eb-b137-16c5bb270d5c" />
<img width="2249" height="845" alt="image" src="https://github.com/user-attachments/assets/1d413df1-7662-4469-b322-9e1434c26741" />
<img width="2108" height="1322" alt="image" src="https://github.com/user-attachments/assets/35f50930-f30f-40bc-9bb5-56dbd6d4676a" />


## API

Base URL: `https://disk-flow-snow-elements.trycloudflare.com`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/v1/place-analysis` | 분석 시작, `naverPlaceId` 반환 |
| `GET` | `/v1/place-analysis?naverPlaceId={id}` | 분석 상태 및 결과 조회 |

분석 진행 중(`analyzing: true`)이면 5초 간격으로 상태를 폴링하며, `COMPLETED` 시 결과 페이지로 자동 이동합니다.
