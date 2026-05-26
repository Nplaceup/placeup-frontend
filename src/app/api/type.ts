/**
 * 공통 응답 타입
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T; // 제네릭
}

/**
 * 1. 플레이스 분석 트리거 + 폴링
 */
export interface PlaceAnalysisResponse {
  naverPlaceId: number;
  placeName: string;
  analyzing: boolean;
}

/**
 * 2. 분석 결과 통합 조회
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
  analyzing: boolean;
  keywords: KeywordAnalysis[];
  seo: SeoAnalysis | null;
  feedback: FeedbackAnalysis | null;
}
