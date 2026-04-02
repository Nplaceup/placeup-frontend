import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Header } from "../components/Header";
import {
  Search, TrendingUp, ArrowUp, ArrowDown, Minus, Filter, AlertCircle,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line,
} from "recharts";
import { apiClient, PlaceRankingsResponse, RecommendedKeywordsResponse } from "../services/api";
import {
  fallbackRankings, fallbackKeywords,
} from "../data/MockFallBack";

type FilterType = "all" | "rising" | "falling";

export function KeywordRanking() {
  const { placeId } = useParams();
  const navigate = useNavigate();

  const [rankings, setRankings] = useState<PlaceRankingsResponse | null>(null);
  const [keywords, setKeywords] = useState<RecommendedKeywordsResponse | null>(null);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    if (!placeId) return;
    const id = Number(placeId);

    const load = async () => {
      try {
        setIsLoading(true);
        const [r, k] = await Promise.all([
          apiClient.getPlaceRankings(id),
          apiClient.getRecommendedKeywords(id),
        ]);
        setRankings(r);
        setKeywords(k);
        setUsingFallback(false);
      } catch {
        // 백엔드 미연결 시 예시 데이터로 fallback
        setRankings(fallbackRankings);
        setKeywords(fallbackKeywords);
        setUsingFallback(true);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [placeId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4 max-w-4xl mx-auto">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="grid md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl" />
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!rankings || !keywords) return null;

  const allKeywords = [
    ...keywords.recommended_keywords.location_industry,
    ...keywords.recommended_keywords.review_based,
    ...keywords.recommended_keywords.place_info_based,
  ];

  const filteredRankings = rankings.keyword_rankings.filter((kr) => {
    if (filterType === "rising")  return kr.rank_no_change !== null && kr.rank_no_change > 0;
    if (filterType === "falling") return kr.rank_no_change !== null && kr.rank_no_change < 0;
    return true;
  });

  // 검색량 바 차트
  const searchVolumeData = filteredRankings.map((kr) => {
    const matched = allKeywords.find((k) => k.keyword === kr.keyword_name);
    return {
      keyword: kr.keyword_name.split(" ").slice(-2).join(" "),
      검색량: matched?.monthly_search ?? 0,
      순위: kr.rank_no,
    };
  });

  // 순위 추이 — 실제 API 연결 전 예시 데이터
  const trendData = [
    { month: "10월", 검색량: 8200 },
    { month: "11월", 검색량: 9500 },
    { month: "12월", 검색량: 11200 },
    { month: "1월",  검색량: 10800 },
    { month: "2월",  검색량: 12500 },
    { month: "3월",  검색량: 13800 },
  ];

  const bestRank = Math.min(...rankings.keyword_rankings.map((kr) => kr.rank_no));
  const risingCount  = rankings.keyword_rankings.filter((kr) => kr.rank_no_change !== null && kr.rank_no_change > 0).length;
  const fallingCount = rankings.keyword_rankings.filter((kr) => kr.rank_no_change !== null && kr.rank_no_change < 0).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">

        {/* 헤더 */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">키워드 순위</h1>
            <p className="text-gray-600">
              {rankings.place_name} · 기준일 {rankings.crawl_date}
            </p>
          </div>
          <button
            onClick={() => navigate(`/result/${placeId}`)}
            className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            분석 결과로 돌아가기
          </button>
        </div>

        {/* fallback 안내 배너 */}
        {usingFallback && (
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 text-sm text-yellow-800">
            <AlertCircle className="size-4 flex-shrink-0" />
            현재 백엔드가 연결되지 않아 예시 데이터를 표시하고 있습니다.
          </div>
        )}

        {/* 통계 요약 */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">추적 키워드</span>
              <Search className="size-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {rankings.keyword_rankings.length}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">최고 순위</span>
              <TrendingUp className="size-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{bestRank}위</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">상승 키워드</span>
              <ArrowUp className="size-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600">{risingCount}</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">하락 키워드</span>
              <ArrowDown className="size-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-red-600">{fallingCount}</div>
          </div>
        </div>

        {/* 2열 레이아웃 */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* 키워드 순위 목록 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">순위 현황</h2>
              <div className="flex items-center gap-2">
                <Filter className="size-4 text-gray-500" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as FilterType)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">전체</option>
                  <option value="rising">상승만</option>
                  <option value="falling">하락만</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredRankings.map((kr, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 mb-1">{kr.keyword_name}</div>
                    <div className="text-xs text-gray-500">
                      점수: {kr.total_score}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {kr.rank_no_change !== null && kr.rank_no_change !== 0 && (
                      <div className={`flex items-center gap-1 ${
                        kr.rank_no_change > 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {kr.rank_no_change > 0
                          ? <ArrowUp className="size-4" />
                          : <ArrowDown className="size-4" />}
                        <span className="text-sm font-medium">{Math.abs(kr.rank_no_change)}</span>
                      </div>
                    )}
                    {(kr.rank_no_change === 0 || kr.rank_no_change === null) && (
                      <Minus className="size-4 text-gray-400" />
                    )}

                    <div className="text-right min-w-[60px]">
                      <div className="text-2xl font-bold text-gray-900">{kr.rank_no}</div>
                      <div className="text-xs text-gray-500">위</div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredRankings.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  해당하는 키워드가 없습니다
                </div>
              )}
            </div>
          </div>

          {/* 우측 차트 */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">총 검색량 추이</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="검색량" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">키워드별 검색량</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={searchVolumeData} layout="vertical" margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="keyword" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="검색량" fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 추가 추천 키워드 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">추가 추천 키워드</h2>
          <p className="text-sm text-gray-600 mb-4">
            순위를 아직 추적하지 않는 추천 키워드입니다. 매장 소개에 활용하면 노출을 높일 수 있어요.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {allKeywords
              .filter((kw) => !rankings.keyword_rankings.some((kr) => kr.keyword_name === kw.keyword))
              .map((kw, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-green-500 transition-colors">
                  <div className="font-medium text-gray-900 mb-2">{kw.keyword}</div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{kw.monthly_search.toLocaleString()}/월</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">추천</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* 순위 개선 팁 */}
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl shadow-lg p-6 mt-6 border border-blue-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">순위 개선 팁</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "키워드 최적화", desc: "상위 순위 키워드를 매장 소개글과 메뉴 설명에 자연스럽게 포함시키세요." },
              { title: "리뷰 관리",     desc: "고객 리뷰에 적극적으로 답변하고, 좋은 리뷰를 유도하세요." },
              { title: "정기 업데이트", desc: "매장 정보와 사진을 정기적으로 업데이트하여 신선함을 유지하세요." },
              { title: "프로모션",      desc: "이벤트와 프로모션 정보를 적극적으로 홍보하여 검색 노출을 높이세요." },
            ].map((tip, i) => (
              <div key={i} className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-sm text-gray-700">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}