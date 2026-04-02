/**
 * 백엔드 미연결 시 사용하는 예시 데이터 (fallback)
 * 백엔드 연결 후 이 파일은 삭제하고 API 호출만 사용하면 됩니다.
 */

import type {
  DashboardResponse,
  RecommendedKeywordsResponse,
  PlaceRankingsResponse,
  SeoScoreResponse,
  ReviewAnalysisResponse,
} from "../services/api";

export const FALLBACK_PLACE_ID = 201;

export const fallbackDashboard: DashboardResponse = {
  place_id: FALLBACK_PLACE_ID,
  place_name: "강남 맛집 카페",
  category: "카페,디저트",
  address: "서울 강남구 역삼동 123-45",
  analysis_base_date: "2026-03-30",
  best_rank: { keyword: "강남 카페", rank_no: 4 },
  recommended_keyword_count: 5,
  total_monthly_search: 342000,
  seo_score: null,
  seo_grade: null,
  top_keywords: [
    { keyword: "강남 디저트 카페", my_rank: 4,  seo_score: 87.2, monthly_search: 12400 },
    { keyword: "역삼 브런치 카페", my_rank: 15, seo_score: 82.5, monthly_search: 4200 },
    { keyword: "강남 소분 카페",   my_rank: 48, seo_score: 76.0, monthly_search: 2800 },
  ],
  review_highlights: [
    { label: "맛",    count: 631 },
    { label: "만족도", count: 523 },
  ],
  top_voted_keyword: "음식이 맛있어요",
  data_range: {
    reviews_collected: 56,
    crawl_start: "2026-03-20",
    crawl_end: "2026-03-30",
  },
};

export const fallbackKeywords: RecommendedKeywordsResponse = {
  place_id: FALLBACK_PLACE_ID,
  analyzed_at: "2026-03-30T09:00:00.000Z",
  recommended_keywords: {
    location_industry: [
      { keyword: "강남 카페",       seo_score: 87.2, my_rank: 4,  monthly_search: 124000 },
      { keyword: "강남 디저트 카페", seo_score: 83.0, my_rank: 15, monthly_search: 42000 },
    ],
    review_based: [
      { keyword: "역삼 브런치 카페", seo_score: 78.5, my_rank: 5,    monthly_search: 8200, source_labels: ["맛", "음식이 맛있어요"] },
      { keyword: "강남 조용한 카페", seo_score: 74.0, my_rank: null, monthly_search: 5600, source_labels: ["분위기"] },
    ],
    place_info_based: [
      { keyword: "강남 카페 예약", seo_score: 72.0, my_rank: null, monthly_search: 3400, source_labels: ["reservation_available"] },
    ],
  },
};

export const fallbackRankings: PlaceRankingsResponse = {
  place_id: FALLBACK_PLACE_ID,
  place_name: "강남 맛집 카페",
  crawl_date: "2026-03-30",
  keyword_rankings: [
    { keyword_id: 1, keyword_name: "강남 카페",       rank_no: 4,  rank_no_change: 2,    total_score: 97.5 },
    { keyword_id: 2, keyword_name: "역삼 브런치 카페", rank_no: 7,  rank_no_change: null, total_score: 94.6 },
    { keyword_id: 3, keyword_name: "강남 소분 카페",   rank_no: 12, rank_no_change: -1,   total_score: 89.2 },
    { keyword_id: 4, keyword_name: "역삼 데이트 카페", rank_no: 18, rank_no_change: null, total_score: 84.7 },
  ],
};

export const fallbackSeo: SeoScoreResponse = {
  place_id: FALLBACK_PLACE_ID,
  total_score: 72,
  grade: "B",
  analyzed_at: "2026-03-30T09:00:00.000Z",
  breakdown: [
    { category: "키워드 최적화",   score: 18, max_score: 25, grade: "warning", feedback: "추천 키워드를 매장 소개글에 자연스럽게 포함시키세요." },
    { category: "매장 정보 완성도", score: 22, max_score: 25, grade: "good",    feedback: "매장 정보가 잘 채워져 있습니다." },
    { category: "리뷰 품질",       score: 15, max_score: 20, grade: "warning", feedback: "리뷰에 적극적으로 답변하고 고객과의 소통을 강화하세요." },
    { category: "사진 및 메뉴",    score: 12, max_score: 15, grade: "good",    feedback: "사진과 메뉴 정보가 충분합니다." },
    { category: "업데이트 빈도",   score: 5,  max_score: 15, grade: "poor",    feedback: "정기적인 포스트 작성과 메뉴 업데이트로 신선한 정보를 유지하세요." },
  ],
};

export const fallbackReviews: ReviewAnalysisResponse = {
  place_id: FALLBACK_PLACE_ID,
  crawl_date: "2026-03-30",
  themes: [
    { label: "맛",    count: 631 },
    { label: "만족도", count: 523 },
    { label: "서비스", count: 202 },
  ],
  menus: [
    { label: "아메리카노", count: 84 },
    { label: "케이크",     count: 62 },
  ],
  voted_keywords: [
    { code: "food_good",  display_name: "음식이 맛있어요",    count: 579 },
    { code: "together",   display_name: "단체모임 하기 좋아요", count: 287 },
  ],
};