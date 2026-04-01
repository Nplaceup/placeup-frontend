# PlaceUp Backend API 명세서

## 개요
PlaceUp 프론트엔드와 Spring Boot 백엔드 간의 API 통신 규격입니다.

**Base URL:** `http://localhost:8080/api`

**응답 형식:** JSON

**인증:** JWT Bearer Token (Authorization: Bearer {token})

---

## 1. 인증 (Authentication)

### 1.1 네이버 OAuth 콜백 처리
**Endpoint:** `POST /auth/naver`

**설명:** 네이버 OAuth 인증 후 받은 code를 검증하고 JWT 토큰을 발급합니다.

**Request Body:**
```json
{
  "code": "string"  // 네이버 OAuth 콜백에서 받은 인증 코드
}
```

**Response:**
```json
{
  "token": "string",  // JWT 토큰
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "profileImage": "string"
  }
}
```

**Error Response:**
```json
{
  "error": "INVALID_AUTH_CODE",
  "message": "유효하지 않은 인증 코드입니다."
}
```

---

## 2. 플레이스 분석 (Place Analysis)

### 2.1 플레이스 분석 시작
**Endpoint:** `POST /places/analyze`

**설명:** 네이버 플레이스 URL을 받아 분석을 시작합니다.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "placeUrl": "string",  // 네이버 플레이스 URL
  "userId": "string"     // 사용자 ID (optional, 토큰에서 추출 가능)
}
```

**Response:**
```json
{
  "analysisId": "string",        // 분석 작업 ID
  "placeId": "string",           // 플레이스 고유 ID
  "status": "processing",        // pending | processing | completed | failed
  "estimatedTime": 30            // 예상 소요 시간 (초)
}
```

**Error Response:**
```json
{
  "error": "INVALID_URL",
  "message": "유효하지 않은 플레이스 URL입니다."
}
```

---

### 2.2 분석 상태 확인
**Endpoint:** `GET /analysis/{analysisId}/status`

**설명:** 분석 진행 상태를 조회합니다 (폴링용).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "analysisId": "string",
  "placeId": "string",
  "status": "processing",        // pending | processing | completed | failed
  "progress": 65,                // 진행률 (0-100)
  "currentStep": "키워드 추출 및 분석",
  "estimatedRemainingTime": 15   // 남은 예상 시간 (초)
}
```

---

### 2.3 플레이스 정보 조회
**Endpoint:** `GET /places/{placeId}`

**설명:** 플레이스 기본 정보를 조회합니다.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "category": "string",
  "address": "string",
  "phone": "string",
  "rating": 4.5,
  "reviewCount": 342,
  "images": ["url1", "url2"],
  "description": "string",
  "businessHours": {
    "monday": "09:00-22:00",
    "tuesday": "09:00-22:00"
  },
  "createdAt": "2026-03-28T10:30:00Z",
  "updatedAt": "2026-03-28T10:30:00Z"
}
```

---

### 2.4 분석 결과 조회
**Endpoint:** `GET /places/{placeId}/analysis`

**설명:** 플레이스의 전체 분석 결과를 조회합니다.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "placeId": "string",
  "placeName": "string",
  "seoScore": 78,
  "keywords": [
    {
      "keyword": "강남 카페",
      "score": 92,
      "searchVolume": 12500,
      "competition": "high",  // low | medium | high
      "currentRank": 15,
      "recommendedRank": 5
    }
  ],
  "competitors": [
    {
      "id": "string",
      "name": "string",
      "rating": 4.3,
      "reviewCount": 892,
      "distance": "200m",
      "rank": 1,
      "seoScore": 95
    }
  ],
  "seoDetails": {
    "titleScore": 85,
    "descriptionScore": 75,
    "reviewScore": 82,
    "photoScore": 70,
    "responseScore": 65
  },
  "recommendations": [
    "업체명에 '강남역' 키워드를 추가하세요",
    "메뉴 설명을 더 상세하게 작성하세요"
  ],
  "analyzedAt": "2026-03-28T10:30:00Z"
}
```

---

## 3. 키워드 순위 추적 (Keyword Ranking)

### 3.1 키워드 순위 조회
**Endpoint:** `GET /places/{placeId}/keywords/ranking`

**설명:** 특정 플레이스의 키워드별 검색 순위를 조회합니다.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `period` (optional): 조회 기간 (7d, 30d, 90d) - 기본값: 30d

**Response:**
```json
[
  {
    "keyword": "강남 카페",
    "currentRank": 15,
    "previousRank": 18,
    "change": 3,
    "searchVolume": 12500,
    "history": [
      { "date": "2026-03-01", "rank": 20 },
      { "date": "2026-03-08", "rank": 18 },
      { "date": "2026-03-15", "rank": 16 },
      { "date": "2026-03-22", "rank": 15 }
    ]
  }
]
```

---

## 4. 사용자 매장 관리 (User Places)

### 4.1 내 매장 목록 조회
**Endpoint:** `GET /users/{userId}/places`

**설명:** 사용자가 등록한 매장 목록을 조회합니다.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (optional): active | inactive | all - 기본값: active
- `page` (optional): 페이지 번호 - 기본값: 1
- `limit` (optional): 페이지당 개수 - 기본값: 10

**Response:**
```json
{
  "places": [
    {
      "id": "string",
      "name": "string",
      "category": "string",
      "address": "string",
      "seoScore": 78,
      "lastAnalyzed": "2026-03-28T10:30:00Z",
      "status": "active"  // active | inactive
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCount": 42,
    "limit": 10
  }
}
```

---

### 4.2 매장 정보 수정
**Endpoint:** `PUT /places/{placeId}`

**설명:** 매장 정보를 수정합니다.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "string",        // optional
  "description": "string", // optional
  "phone": "string",       // optional
  "status": "active"       // optional: active | inactive
}
```

**Response:**
```json
{
  "success": true,
  "message": "매장 정보가 수정되었습니다.",
  "place": {
    "id": "string",
    "name": "string",
    "description": "string",
    "updatedAt": "2026-03-28T10:30:00Z"
  }
}
```

---

### 4.3 매장 삭제
**Endpoint:** `DELETE /places/{placeId}`

**설명:** 매장을 삭제합니다 (소프트 삭제).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "매장이 삭제되었습니다."
}
```

---

## 5. 에러 코드

| 코드 | HTTP Status | 설명 |
|------|-------------|------|
| INVALID_TOKEN | 401 | 유효하지 않은 인증 토큰 |
| TOKEN_EXPIRED | 401 | 만료된 인증 토큰 |
| UNAUTHORIZED | 403 | 권한 없음 |
| INVALID_URL | 400 | 유효하지 않은 플레이스 URL |
| PLACE_NOT_FOUND | 404 | 플레이스를 찾을 수 없음 |
| ANALYSIS_NOT_FOUND | 404 | 분석 결과를 찾을 수 없음 |
| ANALYSIS_FAILED | 500 | 분석 처리 중 오류 발생 |
| RATE_LIMIT_EXCEEDED | 429 | API 호출 한도 초과 |
| SERVER_ERROR | 500 | 서버 내부 오류 |

**에러 응답 형식:**
```json
{
  "error": "ERROR_CODE",
  "message": "사용자 친화적인 에러 메시지",
  "details": {
    "field": "추가 정보"
  },
  "timestamp": "2026-03-28T10:30:00Z"
}
```

---

## 6. 데이터베이스 스키마 (참고)

### users 테이블
```sql
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    naver_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    profile_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### places 테이블
```sql
CREATE TABLE places (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    naver_place_id VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    address VARCHAR(500),
    phone VARCHAR(50),
    rating DECIMAL(2,1),
    review_count INT,
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### analyses 테이블
```sql
CREATE TABLE analyses (
    id VARCHAR(255) PRIMARY KEY,
    place_id VARCHAR(255) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    seo_score INT,
    seo_details JSON,
    keywords JSON,
    competitors JSON,
    recommendations JSON,
    analyzed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE
);
```

### keyword_rankings 테이블
```sql
CREATE TABLE keyword_rankings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    place_id VARCHAR(255) NOT NULL,
    keyword VARCHAR(255) NOT NULL,
    rank INT NOT NULL,
    search_volume INT,
    competition ENUM('low', 'medium', 'high'),
    recorded_at DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
    UNIQUE KEY unique_place_keyword_date (place_id, keyword, recorded_at)
);
```

---

## 7. 구현 참고사항

### 7.1 CORS 설정
프론트엔드(localhost:5173)에서 접근할 수 있도록 CORS 설정 필요:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### 7.2 비동기 분석 처리
플레이스 분석은 시간이 오래 걸리므로 비동기 처리 권장:
- Spring @Async 또는 Message Queue (RabbitMQ, Kafka) 사용
- WebSocket 또는 Server-Sent Events로 실시간 진행 상태 전송 가능

### 7.3 네이버 API 연동
- Naver Place API (비공식)
- 웹 크롤링 (jsoup 등)
- Rate Limiting 고려

### 7.4 JWT 토큰 관리
- Access Token 유효 시간: 1시간
- Refresh Token 유효 시간: 7일
- 토큰 갱신 엔드포인트 필요

---

## 8. 환경 변수 (.env 또는 application.yml)

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/placeup
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}

naver:
  oauth:
    client-id: ${NAVER_CLIENT_ID}
    client-secret: ${NAVER_CLIENT_SECRET}
    redirect-uri: ${NAVER_REDIRECT_URI}

jwt:
  secret: ${JWT_SECRET}
  expiration: 3600000  # 1 hour in milliseconds

server:
  port: 8080
```

---

## 9. 테스트용 Mock 데이터

프론트엔드는 백엔드가 완성되기 전까지 `.env` 파일에서 `VITE_USE_MOCK_DATA=true`로 설정하여 mock 데이터를 사용합니다.

백엔드 개발 완료 후 `.env` 파일 수정:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_USE_MOCK_DATA=false
```
