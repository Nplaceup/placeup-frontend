# PlaceUp 프로젝트 설정 가이드

## 📋 목차
1. [프론트엔드만 실행하기 (현재)](#1-프론트엔드만-실행하기-현재)
2. [Spring Boot 백엔드 연동하기](#2-spring-boot-백엔드-연동하기)
3. [파일 구조 설명](#3-파일-구조-설명)

---

## 1. 프론트엔드만 실행하기 (현재)

백엔드가 완성되기 전까지는 Mock 데이터로 프론트엔드를 테스트할 수 있습니다.

### 설치 및 실행

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev

# 3. 브라우저에서 확인
# http://localhost:5173
```

### 환경 설정

`.env` 파일이 이미 생성되어 있으며, Mock 데이터 모드로 설정되어 있습니다:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_USE_MOCK_DATA=true  # 백엔드 없이 동작
```

### 테스트 방법

1. **로그인**: "네이버로 로그인" 버튼 클릭 → 자동으로 대시보드로 이동
2. **데모 분석**: 대시보드의 "빠른 시작" 섹션에서 샘플 매장 클릭
3. **분석 확인**: 자동으로 분석 진행 후 결과 페이지로 이동

**샘플 매장:**
- 강남 맛집 카페 (place1)
- 이태원 파스타하우스 (place2)

---

## 2. Spring Boot 백엔드 연동하기

### 2.1 데이터베이스 설정

#### MySQL 설치 및 데이터베이스 생성

```bash
# MySQL 실행
mysql -u root -p

# 데이터베이스 생성 및 샘플 데이터 삽입
source database_init.sql
```

`database_init.sql` 파일은 다음을 포함합니다:
- 테이블 생성 (users, places, analyses, keyword_rankings)
- 샘플 데이터 (2개의 매장, 분석 결과, 키워드 순위 히스토리)

### 2.2 Spring Boot 프로젝트 생성

#### 필요한 의존성

```xml
<!-- pom.xml -->
<dependencies>
    <!-- Spring Boot Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- MySQL Driver -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    
    <!-- Lombok (optional) -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>
```

#### application.yml 설정

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/placeup?useSSL=false&serverTimezone=UTC&characterEncoding=UTF-8
    username: root
    password: YOUR_PASSWORD
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  jpa:
    hibernate:
      ddl-auto: none  # 테이블은 이미 생성됨
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.MySQL8Dialect

naver:
  oauth:
    client-id: YOUR_NAVER_CLIENT_ID
    client-secret: YOUR_NAVER_CLIENT_SECRET
    redirect-uri: http://localhost:5173/auth/callback

jwt:
  secret: YOUR_SUPER_SECRET_KEY_AT_LEAST_256_BITS
  expiration: 3600000  # 1시간

server:
  port: 8080

# CORS 설정
cors:
  allowed-origins: http://localhost:5173
```

### 2.3 CORS 설정

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Value("${cors.allowed-origins}")
    private String allowedOrigins;
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### 2.4 주요 API 엔드포인트 구현

자세한 API 명세는 `BACKEND_API_SPEC.md` 파일을 참조하세요.

#### 필수 구현 API:

1. **POST /api/auth/naver** - 네이버 OAuth 로그인
2. **POST /api/places/analyze** - 플레이스 분석 시작
3. **GET /api/analysis/{id}/status** - 분석 상태 조회
4. **GET /api/places/{id}** - 플레이스 정보
5. **GET /api/places/{id}/analysis** - 분석 결과
6. **GET /api/places/{id}/keywords/ranking** - 키워드 순위
7. **GET /api/users/{userId}/places** - 내 매장 목록

### 2.5 프론트엔드 연동

백엔드가 실행되면 `.env` 파일 수정:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_USE_MOCK_DATA=false  # 실제 API 사용
```

---

## 3. 파일 구조 설명

### 프론트엔드 주요 파일

```
/
├── src/app/
│   ├── services/api.ts           # ⭐ API 서비스 레이어
│   │   - apiClient 싱글톤
│   │   - 백엔드 API 호출 메서드
│   │   - Mock 데이터 메서드
│   │
│   ├── pages/                    # 페이지 컴포넌트
│   │   ├── LoginPage.tsx         # 로그인
│   │   ├── Dashboard.tsx         # URL 입력 및 분석 시작
│   │   ├── AnalysisProgress.tsx  # 분석 진행 상태
│   │   ├── AnalysisResult.tsx    # 분석 결과
│   │   ├── KeywordRanking.tsx    # 키워드 순위 추적
│   │   └── MyPage.tsx            # 매장 관리
│   │
│   ├── routes.tsx                # 라우팅 설정
│   └── App.tsx                   # 메인 엔트리
│
├── .env                          # ⭐ 환경 변수 (API URL, Mock 모드)
├── BACKEND_API_SPEC.md           # ⭐ API 명세서
├── database_init.sql             # ⭐ DB 초기화 스크립트
└── README.md                     # 프로젝트 소개
```

### API 서비스 레이어 (`/src/app/services/api.ts`)

이 파일은 프론트엔드와 백엔드 간의 **모든 통신을 담당**합니다.

```typescript
// Mock 모드일 때
const USE_MOCK_DATA = true;

// API 호출 예시
apiClient.startPlaceAnalysis({
  placeUrl: "https://place.naver.com/...",
  userId: "user1"
});

// Mock 데이터 반환 또는 실제 API 호출
```

#### 주요 메서드:

| 메서드 | 설명 |
|--------|------|
| `naverLogin(code)` | 네이버 OAuth 로그인 |
| `startPlaceAnalysis(request)` | 플레이스 분석 시작 |
| `getAnalysisStatus(id)` | 분석 상태 조회 |
| `getPlaceInfo(id)` | 플레이스 정보 조회 |
| `getAnalysisResult(id)` | 분석 결과 조회 |
| `getKeywordRankings(id)` | 키워드 순위 조회 |
| `getUserPlaces(userId)` | 내 매장 목록 |

---

## 4. 개발 워크플로우

### 현재 상태 (백엔드 개발 전)

```
사용자 입력 → API 서비스 → Mock 데이터 반환 → 화면 표시
```

### 백엔드 연동 후

```
사용자 입력 → API 서비스 → Spring Boot API → DB 조회 → 응답 → 화면 표시
```

---

## 5. 주요 작업 흐름

### URL 입력 시 흐름

1. **Dashboard.tsx**: 사용자가 URL 입력
2. **api.ts**: `startPlaceAnalysis()` 호출
   - Mock: 즉시 `{analysisId, placeId}` 반환
   - 실제: Spring Boot API 호출
3. **AnalysisProgress.tsx**: 분석 진행 상태 표시
4. **AnalysisResult.tsx**: 결과 표시

---

## 6. 체크리스트

### 프론트엔드 (완료 ✅)
- [x] 6개 주요 페이지 구현
- [x] React Router 설정
- [x] API 서비스 레이어 구현
- [x] Mock 데이터 설정
- [x] 환경 변수 설정

### 백엔드 (TODO ⏳)
- [ ] Spring Boot 프로젝트 생성
- [ ] MySQL 데이터베이스 연결
- [ ] JPA Entity 생성
- [ ] API 엔드포인트 구현
- [ ] 네이버 OAuth 연동
- [ ] JWT 인증 구현
- [ ] 플레이스 크롤링 로직
- [ ] 키워드 분석 알고리즘

---

## 7. 도움말

### Q: Mock 데이터는 어디서 수정하나요?
**A:** `/src/app/services/api.ts` 파일의 `mockXXX` 메서드에서 수정할 수 있습니다.

### Q: 백엔드 API 주소를 변경하려면?
**A:** `.env` 파일의 `VITE_API_BASE_URL`을 수정하세요.

### Q: 실제 API 호출로 전환하려면?
**A:** `.env` 파일에서 `VITE_USE_MOCK_DATA=false`로 변경하세요.

### Q: VS Code에서 작업하려면?
**A:** 
1. 이 폴더를 VS Code로 열기
2. 터미널에서 `npm install` 실행
3. `npm run dev` 실행

---

## 8. 참고 문서

- **README.md**: 프로젝트 전체 소개
- **BACKEND_API_SPEC.md**: 백엔드 API 상세 명세
- **database_init.sql**: DB 스키마 및 샘플 데이터

---

**문의사항이 있으시면 이슈를 등록해주세요!** 🚀
