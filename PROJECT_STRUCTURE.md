# 📁 PlaceUp 프로젝트 구조

이 문서는 PlaceUp 프로젝트의 전체 파일 구조와 각 파일의 역할을 설명합니다.

## 🌳 전체 디렉토리 구조

```
placeup/
├── .github/                          # GitHub 관련 설정
│   └── workflows/
│       └── deploy.yml               # GitHub Pages 자동 배포 워크플로우
│
├── src/                             # 소스 코드 루트
│   ├── app/                         # React 애플리케이션
│   │   ├── components/              # 공통 컴포넌트
│   │   │   ├── Header.tsx          # 상단 네비게이션 헤더
│   │   │   ├── figma/              # Figma 관련 컴포넌트
│   │   │   │   └── ImageWithFallback.tsx  # 이미지 폴백 처리
│   │   │   └── ui/                 # UI 컴포넌트 라이브러리
│   │   │       ├── button.tsx      # 버튼 컴포넌트
│   │   │       ├── card.tsx        # 카드 컴포넌트
│   │   │       ├── input.tsx       # 입력 필드
│   │   │       └── ... (기타 UI 컴포넌트)
│   │   │
│   │   ├── pages/                   # 페이지 컴포넌트
│   │   │   ├── LoginPage.tsx       # 로그인/홈 페이지
│   │   │   ├── Dashboard.tsx       # 대시보드 (URL 입력)
│   │   │   ├── AnalysisProgress.tsx # 분석 진행 상태
│   │   │   ├── AnalysisResult.tsx  # 분석 결과 페이지
│   │   │   ├── KeywordRanking.tsx  # 키워드 순위 추적
│   │   │   └── MyPage.tsx          # 마이페이지 (매장 관리)
│   │   │
│   │   ├── services/                # 서비스 레이어
│   │   │   └── api.ts              # API 클라이언트 및 Mock 데이터
│   │   │
│   │   ├── data/                    # 데이터 관련
│   │   │   └── mockData.ts         # Mock 데이터 (데모용)
│   │   │
│   │   ├── routes.tsx               # 라우팅 설정
│   │   └── App.tsx                  # 메인 앱 컴포넌트
│   │
│   ├── styles/                      # 스타일 파일
│   │   ├── index.css               # 전역 스타일
│   │   ├── tailwind.css            # Tailwind CSS 설정
│   │   ├── theme.css               # 테마/디자인 토큰
│   │   └── fonts.css               # 폰트 임포트
│   │
│   └── main.tsx                     # React 앱 진입점
│
├── index.html                       # HTML 진입점
├── vite.config.ts                   # Vite 빌드 설정
├── postcss.config.mjs               # PostCSS 설정
├── package.json                     # 프로젝트 의존성 및 스크립트
│
├── .env                             # 환경 변수 (gitignore됨)
├── .gitignore                       # Git 제외 파일 목록
│
├── README.md                        # 프로젝트 소개 및 사용법
├── DEPLOYMENT.md                    # 배포 가이드
├── PROJECT_STRUCTURE.md             # 이 파일
├── BACKEND_API_SPEC.md             # 백엔드 API 명세서
├── database_init.sql                # 데이터베이스 초기화 스크립트
└── SETUP_GUIDE.md                   # 개발 환경 설정 가이드
```

## 📄 주요 파일 설명

### 🔧 설정 파일

#### `index.html`
- React 앱이 마운트되는 HTML 파일
- SEO 메타 태그 포함
- Google Fonts 로드
- Vite가 자동으로 처리

#### `vite.config.ts`
- Vite 빌드 도구 설정
- React, Tailwind CSS 플러그인 설정
- 경로 별칭 (`@`) 설정
- GitHub Pages 배포를 위한 base URL 설정

#### `package.json`
- 프로젝트 메타데이터
- 의존성 패키지 목록
- 빌드 스크립트 정의
- `dev`: 개발 서버 실행
- `build`: 프로덕션 빌드
- `preview`: 빌드 결과 미리보기

#### `.env`
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_USE_MOCK_DATA=true
VITE_NAVER_CLIENT_ID=
VITE_NAVER_REDIRECT_URI=http://localhost:5173/auth/callback
```

### 🎨 스타일 파일

#### `src/styles/index.css`
- 전역 CSS 스타일
- CSS 리셋
- 기본 요소 스타일

#### `src/styles/tailwind.css`
- Tailwind CSS 임포트
- `@import "tailwindcss"`

#### `src/styles/theme.css`
- 색상 토큰
- 타이포그래피 설정
- 커스텀 CSS 변수

#### `src/styles/fonts.css`
- 커스텀 폰트 임포트
- Google Fonts 설정

### 🎯 React 컴포넌트

#### `src/main.tsx`
```typescript
// React 앱의 진입점
// ReactDOM.createRoot()로 앱 마운트
// 전역 스타일 임포트
```

#### `src/app/App.tsx`
```typescript
// 메인 앱 컴포넌트
// RouterProvider로 라우팅 설정
```

#### `src/app/routes.tsx`
```typescript
// 페이지 라우팅 설정
// React Router 7의 createBrowserRouter 사용
// 6개 페이지 경로 정의
```

### 📱 페이지 컴포넌트

| 파일 | 경로 | 설명 |
|------|------|------|
| `LoginPage.tsx` | `/` | 네이버 로그인 및 서비스 소개 |
| `Dashboard.tsx` | `/dashboard` | URL 입력 및 분석 시작 |
| `AnalysisProgress.tsx` | `/analysis/:placeId` | 6단계 분석 진행 상태 표시 |
| `AnalysisResult.tsx` | `/result/:placeId` | SEO 점수, 키워드 추천, 경쟁사 분석 결과 |
| `KeywordRanking.tsx` | `/keyword-ranking` | 키워드별 검색 순위 추적 |
| `MyPage.tsx` | `/mypage` | 등록된 매장 목록 및 관리 |

### 🧩 공통 컴포넌트

#### `src/app/components/Header.tsx`
- 상단 네비게이션 바
- 로고 및 메뉴 링크
- 사용자 프로필 (로그인 후)
- 반응형 모바일 메뉴

#### `src/app/components/ui/`
- Radix UI 기반 컴포넌트 라이브러리
- 재사용 가능한 UI 요소
- 접근성 준수
- Tailwind CSS로 스타일링

### 🔌 서비스 레이어

#### `src/app/services/api.ts`
- API 호출 관리
- Mock/Real API 전환 로직
- 타입 정의 (TypeScript Interface)
- 주요 클래스: `ApiClient`

**주요 메서드:**
```typescript
- naverLogin(): 네이버 OAuth 로그인
- startPlaceAnalysis(): 플레이스 분석 시작
- getAnalysisStatus(): 분석 상태 조회
- getPlaceInfo(): 플레이스 정보 조회
- getAnalysisResult(): 분석 결과 조회
- getKeywordRankings(): 키워드 순위 조회
- getUserPlaces(): 내 매장 목록 조회
```

### 📊 데이터 파일

#### `src/app/data/mockData.ts`
- 개발/데모용 Mock 데이터
- 2개의 샘플 매장:
  - `place1`: 강남 맛집 카페
  - `place2`: 이태원 파스타하우스
- 키워드, SEO 점수, 경쟁사 정보 포함

### 🚀 배포 파일

#### `.github/workflows/deploy.yml`
- GitHub Actions 워크플로우
- `main` 브랜치 푸시 시 자동 배포
- 빌드 → 테스트 → 배포 파이프라인
- GitHub Pages에 자동 배포

## 🔄 데이터 흐름

```
사용자 입력 (URL)
    ↓
Dashboard Component
    ↓
api.ts (apiClient.startPlaceAnalysis())
    ↓
Mock Data (현재) / Backend API (향후)
    ↓
AnalysisProgress Component (진행 상태 표시)
    ↓
AnalysisResult Component (결과 표시)
```

## 🎯 주요 기능별 파일

### 1️⃣ 로그인 기능
- `LoginPage.tsx`: UI
- `api.ts`: `naverLogin()` 메서드
- (향후) 백엔드 OAuth 처리

### 2️⃣ 플레이스 분석
- `Dashboard.tsx`: URL 입력
- `AnalysisProgress.tsx`: 진행 상태
- `AnalysisResult.tsx`: 결과 표시
- `api.ts`: 분석 관련 메서드

### 3️⃣ 키워드 추천
- `AnalysisResult.tsx`: 키워드 목록 표시
- `mockData.ts`: Mock 키워드 데이터
- `api.ts`: `getAnalysisResult()`

### 4️⃣ SEO 점수
- `AnalysisResult.tsx`: 점수 시각화
- `recharts`: 차트 라이브러리
- `mockData.ts`: Mock SEO 데이터

### 5️⃣ 경쟁사 분석
- `AnalysisResult.tsx`: 경쟁사 비교
- `mockData.ts`: Mock 경쟁사 데이터

### 6️⃣ 키워드 순위 추적
- `KeywordRanking.tsx`: 순위 추적 페이지
- `recharts`: 라인 차트
- `api.ts`: `getKeywordRankings()`

### 7️⃣ 매장 관리
- `MyPage.tsx`: 매장 목록 및 관리
- `api.ts`: `getUserPlaces()`

## 🛠️ 개발 워크플로우

### 새 기능 추가 시

1. **컴포넌트 추가**
   ```
   src/app/components/NewComponent.tsx
   ```

2. **페이지 추가**
   ```
   src/app/pages/NewPage.tsx
   ```

3. **라우트 추가**
   ```typescript
   // src/app/routes.tsx
   {
     path: "/new-page",
     Component: NewPage,
   }
   ```

4. **API 메서드 추가**
   ```typescript
   // src/app/services/api.ts
   async getNewData(): Promise<NewData> {
     // 구현
   }
   ```

### 스타일 수정 시

1. **컴포넌트별 스타일**: Tailwind CSS 클래스 사용
2. **전역 스타일**: `src/styles/index.css`
3. **테마 변경**: `src/styles/theme.css`

## 📚 기술 스택별 위치

| 기술 | 파일 위치 |
|------|-----------|
| React | `src/app/**/*.tsx` |
| TypeScript | 모든 `.tsx`, `.ts` 파일 |
| Tailwind CSS | `src/styles/`, 인라인 클래스 |
| React Router | `src/app/routes.tsx` |
| Recharts | `AnalysisResult.tsx`, `KeywordRanking.tsx` |
| Lucide Icons | 모든 페이지 컴포넌트 |
| Vite | `vite.config.ts`, `index.html` |

## 🔍 코드 찾기 가이드

**특정 기능을 수정하려면?**

| 수정 항목 | 파일 위치 |
|-----------|-----------|
| 로그인 UI | `src/app/pages/LoginPage.tsx` |
| 대시보드 | `src/app/pages/Dashboard.tsx` |
| 분석 결과 레이아웃 | `src/app/pages/AnalysisResult.tsx` |
| 헤더/네비게이션 | `src/app/components/Header.tsx` |
| API 엔드포인트 | `src/app/services/api.ts` |
| Mock 데이터 | `src/app/data/mockData.ts` |
| 라우팅 | `src/app/routes.tsx` |
| 색상/테마 | `src/styles/theme.css` |
| 배포 설정 | `.github/workflows/deploy.yml` |

## 🎓 학습 경로

1. **React 기초**: `src/app/pages/LoginPage.tsx` (가장 단순한 페이지)
2. **상태 관리**: `src/app/pages/Dashboard.tsx` (useState 예제)
3. **API 호출**: `src/app/services/api.ts`
4. **라우팅**: `src/app/routes.tsx`
5. **복잡한 UI**: `src/app/pages/AnalysisResult.tsx` (차트, 그리드 레이아웃)

## 💡 팁

- **컴포넌트 재사용**: `src/app/components/` 활용
- **타입 안전성**: 모든 API 응답에 TypeScript 인터페이스 정의
- **스타일 일관성**: Tailwind CSS 클래스 사용
- **코드 정리**: 각 컴포넌트는 단일 책임 원칙 준수

---

**업데이트**: 2024-04-01
**버전**: 1.0.0
