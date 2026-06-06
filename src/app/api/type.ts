/**
 * 공통 응답 타입
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 분석 상태값 — 변경 없음
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
 * 2. GET /v1/place-analysis/status — 분석 상태 폴링 + 결과 조회 응답
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
  score: number;               // 총점 0~100
  grade: string;               // 예: "🟠 미흡"
  placeCompleteness: number;   // 매장 정보 완성도 점수 (0~40) — 신규
  reviewQuality: number;       // 리뷰 품질 점수 (0~60) — 범위 변경
}

export interface FeedbackAnalysis {
  summary: string;
  seoFeedback: string[];           // 최대 3개
  reviewFeedback: string[];        // 최대 3개
  competitorFeedback: string[];    // 신규 — 경쟁업체 분석 기반 피드백 (최대 3개)
  placeSummary: Record<string, string[]>; // 신규 — 카테고리별 대표 키워드
}

export interface AnalysisResponse {
  naverPlaceId: number;
  placeName: string;
  status: AnalysisStatus;
  analyzing: boolean;
  keywords: KeywordAnalysis[];
  seo: SeoAnalysis | null;
  feedback: FeedbackAnalysis | null;
}