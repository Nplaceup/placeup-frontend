# PlaceUp

네이버 플레이스 URL을 입력하면 키워드 추천, 플레이스 점수, 개선 방안을 제공하는 SEO 분석 웹 서비스입니다.

https://placeup-frontend.pages.dev

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
1. 대쉬보드 페이지 - Dashboard
<img width="2780" height="1034" alt="image" src="https://github.com/user-attachments/assets/2b7c069f-9dd7-4626-9bca-46967f2d4670" />
<img width="2829" height="1185" alt="image" src="https://github.com/user-attachments/assets/fcf8f14f-4e26-4225-a370-549689331a1c" />
<img width="2838" height="1327" alt="image" src="https://github.com/user-attachments/assets/c9fcbddc-963d-49fc-bae2-b3a332fcf996" />

2. 분석 진행 페이지 - AnalysisProgress
<img width="2781" height="1377" alt="image" src="https://github.com/user-attachments/assets/ba4c7b74-a70c-47d3-b11e-3a00dc414962" />
<img width="2804" height="1366" alt="image" src="https://github.com/user-attachments/assets/6ab81597-cdb1-4972-b739-dfda305d02a1" />

3. 분석 결과 페이지 - AnalysisResult
<img width="2078" height="947" alt="image" src="https://github.com/user-attachments/assets/ba8f5113-98e3-4348-b3f2-351257b4e3e2" />
<img width="2045" height="1372" alt="image" src="https://github.com/user-attachments/assets/f2c24f5b-8cc4-4f2e-a462-f540197a030b" />
<img width="2044" height="1107" alt="image" src="https://github.com/user-attachments/assets/935a143f-779e-4158-9c6d-5c115cb91d7f" />
<img width="2049" height="853" alt="image" src="https://github.com/user-attachments/assets/ccfd3925-403c-4f6a-b947-6e12826fd10b" />


## API

Base URL: 'https://none-expansys-florence-variety.trycloudflare.com'

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/v1/place-analysis` | 분석 시작, `naverPlaceId` 반환 |
| `GET` | `/v1/place-analysis?naverPlaceId={id}` | 분석 상태 및 결과 조회 |

분석 진행 중(`analyzing: true`)이면 5초 간격으로 상태를 폴링하며, `COMPLETED` 시 결과 페이지로 자동 이동합니다.
