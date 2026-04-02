const BASE_URL = "/api/v1";

// ─────────────────────────────────────────
// 공통 fetch 유틸
// ─────────────────────────────────────────

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err?.error?.code, err?.error?.message);
  }

  return res.json();
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code?: string,
    message?: string
  ) {
    super(message ?? `API Error ${status}`);
  }
}

// ─────────────────────────────────────────
// 응답 타입 정의
// ─────────────────────────────────────────

export interface HealthResponse {
  status: "ok";
  version: string;
}

// ② Frame 2 — 플레이스 등록
export interface RegisterPlaceRequest {
  naver_url?: string;
  naver_place_id?: string;
  force?: boolean;
}

export interface RegisterPlaceResponse {
  status: "created" | "existing";
  place_id: number;
  place_name: string;
  crawling_status: "PROCESSING" | "DONE" | "FAILED";
  // status === "created" 일 때
  crawling_job_id?: number;
  // status === "existing" 일 때
  last_crawled_at?: string;
}

// ③ Analyzing — 크롤링 진행 상태
export interface CrawlingStep {
  key: string;
  label: string;
  done: boolean;
}

export interface CrawlingJobResponse {
  job_id: number;
  place_id: number;
  place_name: string;
  crawl_date: string;
  status: "PROCESSING" | "DONE" | "FAILED";
  progress: number; // 0~100
  steps: CrawlingStep[];
  started_at: string;
  finished_at: string | null;
}

export interface RetryJobRequest {
  place_id: number;
  force?: boolean;
}

export interface RetryJobResponse {
  job_id: number;
  place_id: number;
  status: "PROCESSING";
  started_at: string;
}

// ④ Result — 대시보드
export interface TopKeywordSummary {
  keyword: string;
  my_rank: number | null;
  seo_score: number;
  monthly_search: number;
}

export interface ReviewHighlight {
  label: string;
  count: number;
}

export interface DashboardResponse {
  place_id: number;
  place_name: string;
  category: string;
  address: string;
  analysis_base_date: string;
  best_rank: { keyword: string; rank_no: number } | null;
  recommended_keyword_count: number;
  total_monthly_search: number;
  seo_score: number | null;
  seo_grade: string | null;
  top_keywords: TopKeywordSummary[];
  review_highlights: ReviewHighlight[];
  top_voted_keyword: string | null;
  data_range: {
    reviews_collected: number;
    crawl_start: string;
    crawl_end: string;
  };
}

// ④ Result — 추천 키워드
export interface RecommendedKeyword {
  keyword: string;
  seo_score: number;
  my_rank: number | null;
  monthly_search: number;
  source_labels?: string[];
}

export interface RecommendedKeywordsResponse {
  place_id: number;
  analyzed_at: string;
  recommended_keywords: {
    location_industry: RecommendedKeyword[];
    review_based: RecommendedKeyword[];
    place_info_based: RecommendedKeyword[];
  };
}

// ④ Result — 키워드 순위
export interface KeywordRanking {
  keyword_id: number;
  keyword_name: string;
  rank_no: number;
  rank_no_change: number | null;
  total_score: number;
}

export interface PlaceRankingsResponse {
  place_id: number;
  place_name: string;
  crawl_date: string;
  keyword_rankings: KeywordRanking[];
}

export interface KeywordRankingEntry {
  rank_no: number;
  rank_no_change: number | null;
  place_id: number;
  place_name: string;
  is_my_place: boolean;
  total_score: number;
  visitor_review_count: number;
  blog_review_count: number;
}

export interface KeywordFullRankingResponse {
  keyword_id: number;
  keyword_name: string;
  crawl_date: string;
  my_rank: number | null;
  rankings: KeywordRankingEntry[];
}

export interface RankingHistoryEntry {
  crawl_date: string;
  rank_no: number | null;
}

export interface RankingHistoryResponse {
  keyword_id: number;
  place_id: number;
  history: RankingHistoryEntry[];
}

// ④ Result — SEO 점수
export interface SeoFeedbackItem {
  category: string;
  score: number;
  max_score: number;
  grade: "good" | "warning" | "poor";
  feedback: string;
}

export interface SeoScoreResponse {
  place_id: number;
  total_score: number;
  grade: string;
  analyzed_at: string;
  breakdown: SeoFeedbackItem[];
}

// ④ Result — 리뷰 분석
export interface ReviewAnalysisResponse {
  place_id: number;
  crawl_date: string;
  themes: { label: string; count: number }[];
  menus: { label: string; count: number }[];
  voted_keywords: { code: string; display_name: string; count: number }[];
}

export interface ReviewsResponse {
  total: number;
  page: number;
  size: number;
  data: { id: number; body: string; visited: string; created_at: string }[];
}

// ④ Result — 검색량
export interface SearchVolumeEntry {
  keyword_id: number;
  keyword_name: string;
  monthly_avg: number;
  volumes: { month: string; pc: number; mobile: number; total: number }[];
}

export interface SearchVolumesResponse {
  data: SearchVolumeEntry[];
}

export interface RelatedKeywordsResponse {
  keyword_id: number;
  keyword_name: string;
  related: { keyword: string; monthly_search: number }[];
}

// ─────────────────────────────────────────
// API 클라이언트
// ─────────────────────────────────────────

export const apiClient = {

  // 서버 상태 확인 (선택적)
  health(): Promise<HealthResponse> {
    return request("/health");
  },

  // ② Frame 2 — 분석 시작
  registerPlace(body: RegisterPlaceRequest): Promise<RegisterPlaceResponse> {
    return request("/places/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  // ③ Analyzing — 진행 상태 폴링
  getCrawlingJob(jobId: number): Promise<CrawlingJobResponse> {
    return request(`/crawling/jobs/${jobId}`);
  },

  retryCrawlingJob(body: RetryJobRequest): Promise<RetryJobResponse> {
    return request("/crawling/jobs", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  // ④ Result — 대시보드 (최초 1회 통합 호출)
  getDashboard(placeId: number): Promise<DashboardResponse> {
    return request(`/places/${placeId}/dashboard`);
  },

  // ④ Result — 추천 키워드
  getRecommendedKeywords(
    placeId: number,
    params?: { limit?: number; min_seo_score?: number }
  ): Promise<RecommendedKeywordsResponse> {
    const qs = new URLSearchParams(
      Object.entries(params ?? {})
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString();
    return request(`/places/${placeId}/recommended-keywords${qs ? `?${qs}` : ""}`);
  },

  // ④ Result — 내 플레이스의 키워드별 순위
  getPlaceRankings(
    placeId: number,
    crawlDate?: string
  ): Promise<PlaceRankingsResponse> {
    const qs = new URLSearchParams({ place_id: String(placeId), ...(crawlDate ? { crawl_date: crawlDate } : {}) }).toString();
    return request(`/rankings/place?${qs}`);
  },

  // ④ Result — 키워드 클릭 시 전체 순위
  getKeywordFullRanking(params: {
    keyword_id: number;
    highlight_place_id?: number;
    top?: number;
    crawl_date?: string;
  }): Promise<KeywordFullRankingResponse> {
    const qs = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString();
    return request(`/rankings/keyword?${qs}`);
  },

  // ④ Result — 순위 변동 이력 (차트용)
  getRankingHistory(params: {
    keyword_id: number;
    place_id: number;
    days?: number;
  }): Promise<RankingHistoryResponse> {
    const qs = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString();
    return request(`/rankings/history?${qs}`);
  },

  // ④ Result — SEO 점수 상세
  getSeoScore(placeId: number): Promise<SeoScoreResponse> {
    return request(`/places/${placeId}/seo-score`);
  },

  // ④ Result — 리뷰 분석 통계
  getReviewAnalysis(placeId: number, crawlDate?: string): Promise<ReviewAnalysisResponse> {
    const qs = crawlDate ? `?crawl_date=${crawlDate}` : "";
    return request(`/places/${placeId}/review-analysis${qs}`);
  },

  // ④ Result — 원본 리뷰 목록
  getReviews(
    placeId: number,
    params?: { page?: number; size?: number; sort?: "latest" | "oldest" }
  ): Promise<ReviewsResponse> {
    const qs = new URLSearchParams(
      Object.entries(params ?? {})
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString();
    return request(`/places/${placeId}/reviews${qs ? `?${qs}` : ""}`);
  },

  // ④ Result — 키워드 월간 검색량
  getSearchVolumes(
    keywordIds: number[],
    period?: "3m" | "6m" | "12m"
  ): Promise<SearchVolumesResponse> {
    const qs = new URLSearchParams({
      keyword_ids: keywordIds.join(","),
      ...(period ? { period } : {}),
    }).toString();
    return request(`/search-volumes?${qs}`);
  },

  // ④ Result — 연관 검색어
  getRelatedKeywords(
    keywordId: number,
    limit?: number
  ): Promise<RelatedKeywordsResponse> {
    const qs = new URLSearchParams({
      keyword_id: String(keywordId),
      ...(limit ? { limit: String(limit) } : {}),
    }).toString();
    return request(`/search-volumes/related?${qs}`);
  },
};