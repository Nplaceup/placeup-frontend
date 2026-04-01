# PlaceUp - 네이버 플레이스 SEO 분석 서비스

네이버 플레이스 정보를 기반으로 검색 키워드를 추천하고, SEO 점수를 분석하며, 플레이스 관리를 도와주는 웹 애플리케이션입니다.

## 🎯 주요 기능

- ✅ **네이버 OAuth 로그인** - 간편한 소셜 로그인
- 🔍 **플레이스 URL 분석** - URL 입력만으로 자동 분석
- 📊 **SEO 점수 계산** - 5가지 항목 기반 종합 점수
- 🎯 **키워드 추천** - 리뷰 데이터 기반 최적 키워드 제안
- 📈 **검색 순위 추적** - 키워드별 순위 변화 모니터링
- 🏢 **경쟁사 비교** - 주변 경쟁 업체 분석
- 📋 **매장 관리** - 여러 매장 통합 관리

## 🛠️ 기술 스택

### 프론트엔드
- **React 18.3** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **React Router 7** - 클라이언트 라우팅
- **Tailwind CSS 4** - 스타일링
- **Vite** - 빌드 도구
- **Lucide React** - 아이콘
- **Recharts** - 차트 시각화

### 백엔드 (예정)
- **Spring Boot 3.x** - 백엔드 프레임워크
- **MySQL 8.0+** - 데이터베이스
- **JWT** - 인증
- **Naver OAuth 2.0** - 소셜 로그인

## 📁 프로젝트 구조

```
/
├── src/
│   ├── app/
│   │   ├── pages/              # 페이지 컴포넌트
│   │   │   ├── LoginPage.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── AnalysisProgress.tsx
│   │   │   ├── AnalysisResult.tsx
│   │   │   ├── KeywordRanking.tsx
│   │   │   └── MyPage.tsx
│   │   ├── components/         # 공통 컴포넌트
│   │   │   └── Header.tsx
│   │   ├── services/           # API 서비스 레이어
│   │   │   └── api.ts
│   │   ├── data/               # 데모 데이터
│   │   ├── routes.tsx          # 라우팅 설정
│   │   └── App.tsx             # 메인 앱
│   └── styles/                 # 스타일 파일
├── .env                        # 환경 변수
├── BACKEND_API_SPEC.md         # API 명세서
├── database_init.sql           # DB 초기화 스크립트
└── package.json
```

## 🚀 시작하기

### 1. 프론트엔드 설치 및 실행

```bash
# 의존성 설치
npm install
# 또는
pnpm install

# 개발 서버 실행
npm run dev
# 또는
pnpm dev
```

개발 서버는 `http://localhost:5173`에서 실행됩니다.

### 2. 환경 변수 설정

`.env` 파일을 생성하고 아래 내용을 입력하세요:

```env
# Mock 데이터 사용 (백엔드 개발 전)
VITE_API_BASE_URL=http://localhost:8080/api
VITE_USE_MOCK_DATA=true

# 네이버 OAuth (추후 설정)
VITE_NAVER_CLIENT_ID=
VITE_NAVER_REDIRECT_URI=http://localhost:5173/auth/callback
```

**현재는 `VITE_USE_MOCK_DATA=true`로 설정하여 백엔드 없이 프론트엔드만 테스트할 수 있습니다.**

### 3. 백엔드 설정 (개발 시)

#### 데이터베이스 초기화

```bash
# MySQL 접속
mysql -u root -p

# SQL 파일 실행
source database_init.sql
```

또는 MySQL Workbench에서 `database_init.sql` 파일을 열어 실행하세요.

#### Spring Boot 설정

`application.yml` 파일 예시:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/placeup?useSSL=false&serverTimezone=UTC&characterEncoding=UTF-8
    username: root
    password: YOUR_PASSWORD
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  jpa:
    hibernate:
      ddl-auto: none
    show-sql: true
    properties:
      hibernate:
        format_sql: true

naver:
  oauth:
    client-id: YOUR_NAVER_CLIENT_ID
    client-secret: YOUR_NAVER_CLIENT_SECRET
    redirect-uri: http://localhost:5173/auth/callback

jwt:
  secret: YOUR_JWT_SECRET_KEY
  expiration: 3600000

server:
  port: 8080

logging:
  level:
    com.placeup: DEBUG
```

#### 백엔드 실행

```bash
# Spring Boot 실행
./mvnw spring-boot:run
# 또는
./gradlew bootRun
```

#### 백엔드 연결

백엔드가 실행되면 `.env` 파일을 수정:

```env
VITE_USE_MOCK_DATA=false
```

## 📖 API 명세서

자세한 API 명세는 [`BACKEND_API_SPEC.md`](./BACKEND_API_SPEC.md) 파일을 참조하세요.

### 주요 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/auth/naver` | 네이버 OAuth 로그인 |
| POST | `/api/places/analyze` | 플레이스 분석 시작 |
| GET | `/api/analysis/{id}/status` | 분석 진행 상태 조회 |
| GET | `/api/places/{id}` | 플레이스 정보 조회 |
| GET | `/api/places/{id}/analysis` | 분석 결과 조회 |
| GET | `/api/places/{id}/keywords/ranking` | 키워드 순위 조회 |
| GET | `/api/users/{id}/places` | 내 매장 목록 조회 |

## 🎨 페이지 구성

1. **로그인 페이지** (`/`) - 네이버 OAuth 로그인
2. **대시보드** (`/dashboard`) - 플레이스 URL 입력 및 분석 시작
3. **분석 진행** (`/analysis/:placeId`) - 실시간 분석 진행 상태
4. **분석 결과** (`/result/:placeId`) - SEO 점수, 키워드 추천, 경쟁사 분석
5. **키워드 순위** (`/keywords/:placeId`) - 키워드별 순위 추적
6. **마이페이지** (`/mypage`) - 등록된 매장 관리

## 🔧 개발 모드

현재 백엔드가 완성되지 않았으므로, **Mock 데이터 모드**로 작동합니다.

- Mock 데이터는 `/src/app/services/api.ts` 파일의 `mockXXX` 메서드에 정의되어 있습니다
- 2개의 샘플 매장 데이터가 포함되어 있습니다:
  - `place1`: 강남 맛집 카페
  - `place2`: 이태원 파스타하우스

### 빠른 테스트 방법

1. 로그인 페이지에서 "네이버로 로그인" 클릭
2. 대시보드에서 "빠른 시작" 섹션의 샘플 매장 클릭
3. 분석 진행 후 결과 확인

## 📦 빌드

```bash
# 프로덕션 빌드
npm run build
# 또는
pnpm build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

## 🐛 트러블슈팅

### 포트 충돌
```bash
# 포트 5173이 사용 중인 경우
npx vite --port 3000
```

### CORS 오류
백엔드에서 CORS 설정이 되어있는지 확인하세요. 자세한 내용은 `BACKEND_API_SPEC.md`의 CORS 설정 섹션을 참조하세요.

### Mock 데이터가 표시되지 않는 경우
`.env` 파일에서 `VITE_USE_MOCK_DATA=true`로 설정되어 있는지 확인하세요.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 📧 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 등록해주세요.

---

**PlaceUp** - 네이버 플레이스 검색 최적화의 시작 🚀
