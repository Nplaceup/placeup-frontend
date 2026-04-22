<브랜치 구조>
main - 최종 작업물
feat/init - 작업 테스트, 작업하는 공간
develop - 백엔드와 프론트엔드 연결 테스트, 코드 이해를 위한 구조와 파일 설명이 정리됨

<프로젝트 설명>
PlaceUp - 네이버 플레이스 SEO 분석 서비스
네이버 플레이스 정보를 기반으로 검색 키워드를 추천하고, SEO 점수를 분석하며, 플레이스 관리를 도와주는 웹 애플리케이션.

<주요 기능>
플레이스 URL 분석 : 네이버 플레이스 URL 입력만으로 기본 정보 자동 분석 (현재 테스트용 데이터 기준 동작)
SEO 점수 계산 : 5가지 지표를 기반으로 플레이스 SEO 종합 점수 산출 (지표 및 기준 추후 조정 예정)
키워드 추천 : 리뷰 데이터를 기반으로 노출에 유리한 키워드 제안
검색 순위 추적 : 키워드별 검색 순위 변화 모니터링 (사내 데이터 연동 예정)
경쟁사 비교 : 주변 경쟁 플레이스 비교 및 분석 기능 (고도화 예정)
네이버 OAuth 로그인 : 네이버 계정을 통한 간편 로그인 기능(고도화 예정)

<📁프로젝트 구조>
```
src/
├── app/
│   ├── components/
│   │   ├── Header.tsx              # 공통 헤더 (로고 + 네비게이션)
│   │   ├── figma/
│   │   │   └── ImageWithFallback.tsx  # 이미지 로딩 실패 시 대체 표시
│   │   └── ui/                     # shadcn/ui 기반 공통 컴포넌트 48개
│   ├── data/
│   │   └── MockFallBack.ts         # 백엔드 미연결 시 사용하는 예시 데이터
│   ├── pages/
│   │   ├── Dashboard.tsx           # 홈 — URL 입력 및 분석 시작
│   │   ├── AnalysisProgress.tsx    # 분석 진행 — 단계별 진행률 표시
│   │   ├── AnalysisResult.tsx      # 분석 결과 — SEO·키워드·리뷰 종합
│   │   └── KeywordRanking.tsx      # 키워드 순위 상세
│   ├── services/
│   │   └── api.ts                  # API 클라이언트 + 응답 타입 정의
│   ├── App.tsx                     # RouterProvider 루트 컴포넌트
│   └── routes.tsx                  # 라우팅 설정
├── styles/
│   ├── index.css                   # 전역 기본 스타일
│   ├── tailwind.css                # Tailwind 진입점
│   ├── theme.css                   # 커스텀 테마 변수
│   └── fonts.css                   # 폰트 설정
└── main.tsx                        # React 앱 진입점 (DOM 마운트)
```

*
현재 백엔드가 완성되지 않았으므로, Mock 데이터로 작동합니다. (VITE_USE_MOCK_DATA=true)

예시 데이터는 /src/app/data/MockFallBack.ts 파일에 정의되어 있습니다.
1개의 샘플 매장 데이터가 포함되어 있습니다:

FALLBACK_PLACE_ID: 201 — 강남 맛집 카페 (추천 키워드 · 순위 · SEO 점수 · 리뷰 분석 포함)
```env
VITE_USE_MOCK_DATA=false
```
백엔드가 실행되면 vite.config.ts에 프록시 설정을 추가

ts  server: {
    proxy: {
      '/api': 'http://localhost:1537'
    }
  }