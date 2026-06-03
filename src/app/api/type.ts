/**
 * 공통 응답 타입
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 분석 상태값
 * REQUESTED            → 분석 요청 등록
 * PLACE_CRAWLING       → 플레이스 정보 수집 중
 * REVIEW_CRAWLING      → 리뷰 데이터 수집 중
 * KEYWORD_EXTRACTING   → 키워드 추출 중
 * RANKING_CRAWLING     → 키워드별 순위 수집 중
 * SEARCH_VOLUME_CRAWLING → 키워드 검색량 수집 중
 * SEO_ANALYZING        → SEO 점수 계산 중
 * COMPLETED            → 분석 완료
 * FAILED               → 분석 실패
 */
export type AnalysisStatus =
  | 'REQUESTED'
  | 'PLACE_CRAWLING'
  | 'REVIEW_CRAWLING'
  | 'KEYWORD_EXTRACTING'
  | 'RANKING_CRAWLING'
  | 'SEARCH_VOLUME_CRAWLING'
  | 'SEO_ANALYZING'
  | 'COMPLETED'
  | 'FAILED';

/**
 * 1. POST /v1/place-analysis — 분석 트리거 응답
 */
export interface PlaceAnalysisResponse {
  naverPlaceId: number;
  placeName: string;
  analyzing: boolean;
}

/**
 * 2. GET /v1/place-analysis — 분석 상태 폴링 + 결과 조회 응답
 */
export interface KeywordAnalysis {
  keyword: string;
  score: number;
  monthlySearchVolume: number;
  rankNo: number | null;
  competitionLevel: '높음' | '중간' | '낮음';
  isOpportunity: boolean;
}

export interface SeoAnalysis {
  score: number;
  grade: string;
  keywordOptimization: number;
  reviewQuality: number;
  searchExposure: number;
  competition: number;
}

export interface FeedbackAnalysis {
  summary: string;
  seoFeedback: string[];
  reviewFeedback: string[];
}

export interface AnalysisResponse {
  naverPlaceId: number;
  placeName: string;
  status: AnalysisStatus;  // 추가 — 실제 진행 단계
  analyzing: boolean;
  keywords: KeywordAnalysis[];
  seo: SeoAnalysis | null;
  feedback: FeedbackAnalysis | null;
}