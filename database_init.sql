-- PlaceUp Database 초기화 및 샘플 데이터
-- MySQL 8.0+ 기준

-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS placeup CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE placeup;

-- 기존 테이블 삭제 (개발 환경에서만)
DROP TABLE IF EXISTS keyword_rankings;
DROP TABLE IF EXISTS analyses;
DROP TABLE IF EXISTS places;
DROP TABLE IF EXISTS users;

-- 1. users 테이블
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    naver_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    profile_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_naver_id (naver_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. places 테이블
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
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. analyses 테이블
CREATE TABLE analyses (
    id VARCHAR(255) PRIMARY KEY,
    place_id VARCHAR(255) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    seo_score INT,
    seo_details JSON,
    keywords JSON,
    competitors JSON,
    recommendations JSON,
    analyzed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
    INDEX idx_place_id (place_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. keyword_rankings 테이블
CREATE TABLE keyword_rankings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    place_id VARCHAR(255) NOT NULL,
    keyword VARCHAR(255) NOT NULL,
    rank_position INT NOT NULL,
    search_volume INT,
    competition ENUM('low', 'medium', 'high'),
    recorded_at DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
    UNIQUE KEY unique_place_keyword_date (place_id, keyword, recorded_at),
    INDEX idx_place_id (place_id),
    INDEX idx_recorded_at (recorded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 샘플 데이터 삽입
-- ============================================

-- 샘플 사용자
INSERT INTO users (id, naver_id, name, email, profile_image) VALUES
('user1', 'naver_123456', '김플레이스', 'user@naver.com', ''),
('user2', 'naver_789012', '이마케팅', 'marketing@naver.com', '');

-- 샘플 플레이스
INSERT INTO places (id, user_id, naver_place_id, name, category, address, phone, rating, review_count, description, status) VALUES
('place1', 'user1', 'naver_place_1001', '강남 맛집 카페', '카페', '서울시 강남구 테헤란로 123', '02-1234-5678', 4.5, 342, '강남역 근처 분위기 좋은 카페입니다. 브런치와 디저트가 맛있습니다.', 'active'),
('place2', 'user1', 'naver_place_1002', '이태원 파스타하우스', '이탈리안 레스토랑', '서울시 용산구 이태원로 456', '02-9876-5432', 4.7, 589, '정통 이탈리안 파스타 전문점입니다. 수제 파스타와 피자를 제공합니다.', 'active'),
('place3', 'user2', 'naver_place_1003', '홍대 브런치카페', '카페', '서울시 마포구 양화로 789', '02-5555-6666', 4.3, 234, '홍대입구역 근처 브런치 전문 카페', 'active');

-- 샘플 분석 결과 - place1 (강남 맛집 카페)
INSERT INTO analyses (id, place_id, status, seo_score, seo_details, keywords, competitors, recommendations, analyzed_at) VALUES
('analysis1', 'place1', 'completed', 78, 
JSON_OBJECT(
    'titleScore', 85,
    'descriptionScore', 75,
    'reviewScore', 82,
    'photoScore', 70,
    'responseScore', 65
),
JSON_ARRAY(
    JSON_OBJECT('keyword', '강남 카페', 'score', 92, 'searchVolume', 12500, 'competition', 'high', 'currentRank', 15, 'recommendedRank', 5),
    JSON_OBJECT('keyword', '강남역 브런치', 'score', 85, 'searchVolume', 8900, 'competition', 'medium', 'currentRank', 8, 'recommendedRank', 3),
    JSON_OBJECT('keyword', '테헤란로 디저트', 'score', 78, 'searchVolume', 4200, 'competition', 'low', 'currentRank', 12, 'recommendedRank', 5),
    JSON_OBJECT('keyword', '강남 데이트 카페', 'score', 82, 'searchVolume', 6700, 'competition', 'medium', 'currentRank', 20, 'recommendedRank', 8),
    JSON_OBJECT('keyword', '강남역 카페 추천', 'score', 88, 'searchVolume', 9200, 'competition', 'high', 'currentRank', 18, 'recommendedRank', 6)
),
JSON_ARRAY(
    JSON_OBJECT('id', 'comp1', 'name', '강남 스타벅스', 'rating', 4.3, 'reviewCount', 892, 'distance', '200m', 'rank', 1, 'seoScore', 95),
    JSON_OBJECT('id', 'comp2', 'name', '테헤란 커피숍', 'rating', 4.4, 'reviewCount', 567, 'distance', '350m', 'rank', 2, 'seoScore', 88),
    JSON_OBJECT('id', 'comp3', 'name', '강남역 카페거리', 'rating', 4.2, 'reviewCount', 423, 'distance', '500m', 'rank', 3, 'seoScore', 82)
),
JSON_ARRAY(
    '업체명에 "강남역" 키워드를 추가하세요',
    '메뉴 설명을 더 상세하게 작성하세요',
    '리뷰에 적극적으로 답변하세요',
    '고품질 사진을 10장 이상 등록하세요',
    '영업시간을 정확하게 업데이트하세요',
    '특화 메뉴(시그니처 메뉴)를 강조하세요'
),
NOW());

-- 샘플 분석 결과 - place2 (이태원 파스타하우스)
INSERT INTO analyses (id, place_id, status, seo_score, seo_details, keywords, competitors, recommendations, analyzed_at) VALUES
('analysis2', 'place2', 'completed', 85,
JSON_OBJECT(
    'titleScore', 90,
    'descriptionScore', 85,
    'reviewScore', 88,
    'photoScore', 80,
    'responseScore', 78
),
JSON_ARRAY(
    JSON_OBJECT('keyword', '이태원 파스타', 'score', 95, 'searchVolume', 15200, 'competition', 'medium', 'currentRank', 3, 'recommendedRank', 1),
    JSON_OBJECT('keyword', '용산 이탈리안', 'score', 88, 'searchVolume', 7800, 'competition', 'low', 'currentRank', 5, 'recommendedRank', 2),
    JSON_OBJECT('keyword', '이태원 맛집', 'score', 82, 'searchVolume', 18500, 'competition', 'high', 'currentRank', 25, 'recommendedRank', 10),
    JSON_OBJECT('keyword', '이태원 데이트 레스토랑', 'score', 79, 'searchVolume', 5600, 'competition', 'medium', 'currentRank', 12, 'recommendedRank', 5)
),
JSON_ARRAY(
    JSON_OBJECT('id', 'comp4', 'name', '이태원 파스타킹', 'rating', 4.6, 'reviewCount', 723, 'distance', '300m', 'rank', 1, 'seoScore', 92),
    JSON_OBJECT('id', 'comp5', 'name', '용산 이탈리아노', 'rating', 4.5, 'reviewCount', 612, 'distance', '450m', 'rank', 2, 'seoScore', 87)
),
JSON_ARRAY(
    '시그니처 메뉴 사진을 추가하세요',
    '영업시간을 정확하게 업데이트하세요',
    '주차 정보를 명확하게 기재하세요',
    '웨이팅 시간 안내를 추가하세요'
),
NOW());

-- 키워드 순위 히스토리 - place1
-- 강남 카페
INSERT INTO keyword_rankings (place_id, keyword, rank_position, search_volume, competition, recorded_at) VALUES
('place1', '강남 카페', 20, 12500, 'high', '2026-03-01'),
('place1', '강남 카페', 18, 12500, 'high', '2026-03-08'),
('place1', '강남 카페', 16, 12500, 'high', '2026-03-15'),
('place1', '강남 카페', 15, 12500, 'high', '2026-03-22'),
('place1', '강남 카페', 15, 12500, 'high', '2026-03-28');

-- 강남역 브런치
INSERT INTO keyword_rankings (place_id, keyword, rank_position, search_volume, competition, recorded_at) VALUES
('place1', '강남역 브런치', 15, 8900, 'medium', '2026-03-01'),
('place1', '강남역 브런치', 12, 8900, 'medium', '2026-03-08'),
('place1', '강남역 브런치', 10, 8900, 'medium', '2026-03-15'),
('place1', '강남역 브런치', 8, 8900, 'medium', '2026-03-22'),
('place1', '강남역 브런치', 8, 8900, 'medium', '2026-03-28');

-- 테헤란로 디저트
INSERT INTO keyword_rankings (place_id, keyword, rank_position, search_volume, competition, recorded_at) VALUES
('place1', '테헤란로 디저트', 10, 4200, 'low', '2026-03-01'),
('place1', '테헤란로 디저트', 11, 4200, 'low', '2026-03-08'),
('place1', '테헤란로 디저트', 11, 4200, 'low', '2026-03-15'),
('place1', '테헤란로 디저트', 12, 4200, 'low', '2026-03-22'),
('place1', '테헤란로 디저트', 12, 4200, 'low', '2026-03-28');

-- 강남 데이트 카페
INSERT INTO keyword_rankings (place_id, keyword, rank_position, search_volume, competition, recorded_at) VALUES
('place1', '강남 데이트 카페', 25, 6700, 'medium', '2026-03-01'),
('place1', '강남 데이트 카페', 22, 6700, 'medium', '2026-03-08'),
('place1', '강남 데이트 카페', 21, 6700, 'medium', '2026-03-15'),
('place1', '강남 데이트 카페', 20, 6700, 'medium', '2026-03-22'),
('place1', '강남 데이트 카페', 20, 6700, 'medium', '2026-03-28');

-- 키워드 순위 히스토리 - place2
-- 이태원 파스타
INSERT INTO keyword_rankings (place_id, keyword, rank_position, search_volume, competition, recorded_at) VALUES
('place2', '이태원 파스타', 8, 15200, 'medium', '2026-03-01'),
('place2', '이태원 파스타', 6, 15200, 'medium', '2026-03-08'),
('place2', '이태원 파스타', 4, 15200, 'medium', '2026-03-15'),
('place2', '이태원 파스타', 3, 15200, 'medium', '2026-03-22'),
('place2', '이태원 파스타', 3, 15200, 'medium', '2026-03-28');

-- 용산 이탈리안
INSERT INTO keyword_rankings (place_id, keyword, rank_position, search_volume, competition, recorded_at) VALUES
('place2', '용산 이탈리안', 8, 7800, 'low', '2026-03-01'),
('place2', '용산 이탈리안', 7, 7800, 'low', '2026-03-08'),
('place2', '용산 이탈리안', 6, 7800, 'low', '2026-03-15'),
('place2', '용산 이탈리안', 5, 7800, 'low', '2026-03-22'),
('place2', '용산 이탈리안', 5, 7800, 'low', '2026-03-28');

-- 이태원 맛집
INSERT INTO keyword_rankings (place_id, keyword, rank_position, search_volume, competition, recorded_at) VALUES
('place2', '이태원 맛집', 30, 18500, 'high', '2026-03-01'),
('place2', '이태원 맛집', 28, 18500, 'high', '2026-03-08'),
('place2', '이태원 맛집', 26, 18500, 'high', '2026-03-15'),
('place2', '이태원 맛집', 25, 18500, 'high', '2026-03-22'),
('place2', '이태원 맛집', 25, 18500, 'high', '2026-03-28');

-- ============================================
-- 조회 쿼리 예시
-- ============================================

-- 사용자의 모든 플레이스 조회
-- SELECT * FROM places WHERE user_id = 'user1' AND status = 'active';

-- 특정 플레이스의 최신 분석 결과 조회
-- SELECT * FROM analyses WHERE place_id = 'place1' ORDER BY analyzed_at DESC LIMIT 1;

-- 특정 플레이스의 키워드 순위 추이 조회
-- SELECT * FROM keyword_rankings WHERE place_id = 'place1' AND keyword = '강남 카페' ORDER BY recorded_at DESC;

-- 최근 분석된 플레이스 조회
-- SELECT p.*, a.seo_score, a.analyzed_at 
-- FROM places p 
-- JOIN analyses a ON p.id = a.place_id 
-- WHERE a.status = 'completed' 
-- ORDER BY a.analyzed_at DESC 
-- LIMIT 10;

-- 특정 키워드의 순위 변화 조회
-- SELECT keyword, rank_position, recorded_at 
-- FROM keyword_rankings 
-- WHERE place_id = 'place1' AND keyword = '강남 카페' 
-- ORDER BY recorded_at DESC 
-- LIMIT 30;

COMMIT;
