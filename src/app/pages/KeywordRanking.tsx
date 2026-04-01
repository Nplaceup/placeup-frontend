import { useState } from "react";
import { Header } from "../components/Header";
import {
  mockPlaces,
  mockKeywordRanks,
  mockKeywordRecommendations,
} from "../data/mockData";
import {
  Search,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Minus,
  Filter,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export function KeywordRanking() {
  const [selectedPlace, setSelectedPlace] = useState(mockPlaces[0].id);
  const [filterType, setFilterType] = useState<"all" | "rising" | "falling">(
    "all"
  );

  const place = mockPlaces.find((p) => p.id === selectedPlace);
  const keywordRanks = mockKeywordRanks[selectedPlace] || [];
  const allKeywords = mockKeywordRecommendations[selectedPlace] || [];

  // 필터링된 키워드
  const filteredKeywords = keywordRanks.filter((kr) => {
    if (filterType === "rising") return kr.change > 0;
    if (filterType === "falling") return kr.change < 0;
    return true;
  });

  // 검색량 추이 데이터 (가상 데이터)
  const trendData = [
    { month: "10월", 검색량: 8200 },
    { month: "11월", 검색량: 9500 },
    { month: "12월", 검색량: 11200 },
    { month: "1월", 검색량: 10800 },
    { month: "2월", 검색량: 12500 },
    { month: "3월", 검색량: 13800 },
  ];

  // 키워드별 검색량 차트 데이터
  const searchVolumeData = filteredKeywords.map((kr) => ({
    keyword: kr.keyword.split(" ").slice(-2).join(" "),
    검색량: kr.searchVolume,
    순위: kr.rank,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">키워드 순위</h1>
          <p className="text-gray-600">
            검색 키워드별 순위와 검색량을 확인하세요
          </p>
        </div>

        {/* 매장 선택 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            매장 선택
          </label>
          <div className="grid md:grid-cols-2 gap-3">
            {mockPlaces.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlace(p.id)}
                className={`text-left p-4 rounded-lg border-2 transition-all ${
                  selectedPlace === p.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-semibold text-gray-900 mb-1">{p.name}</div>
                <div className="text-sm text-gray-600">{p.category}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 통계 요약 */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">추적 키워드</span>
              <Search className="size-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {keywordRanks.length}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">최고 순위</span>
              <TrendingUp className="size-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {Math.min(...keywordRanks.map((kr) => kr.rank))}위
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">상승 키워드</span>
              <ArrowUp className="size-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600">
              {keywordRanks.filter((kr) => kr.change > 0).length}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">하락 키워드</span>
              <ArrowDown className="size-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-red-600">
              {keywordRanks.filter((kr) => kr.change < 0).length}
            </div>
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
                  onChange={(e) =>
                    setFilterType(e.target.value as typeof filterType)
                  }
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">전체</option>
                  <option value="rising">상승만</option>
                  <option value="falling">하락만</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredKeywords.map((kr, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 mb-1">
                      {kr.keyword}
                    </div>
                    <div className="text-xs text-gray-500">
                      월간 검색량: {kr.searchVolume.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* 순위 변동 */}
                    {kr.change !== 0 && (
                      <div
                        className={`flex items-center gap-1 ${
                          kr.change > 0
                            ? "text-green-600"
                            : kr.change < 0
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        {kr.change > 0 ? (
                          <ArrowUp className="size-4" />
                        ) : kr.change < 0 ? (
                          <ArrowDown className="size-4" />
                        ) : (
                          <Minus className="size-4" />
                        )}
                        <span className="text-sm font-medium">
                          {Math.abs(kr.change)}
                        </span>
                      </div>
                    )}

                    {/* 현재 순위 */}
                    <div className="text-right min-w-[60px]">
                      <div className="text-2xl font-bold text-gray-900">
                        {kr.rank}
                      </div>
                      <div className="text-xs text-gray-500">위</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredKeywords.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                해당하는 키워드가 없습니다
              </div>
            )}
          </div>

          {/* 우측 차트 및 정보 */}
          <div className="space-y-6">
            {/* 검색량 추이 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                총 검색량 추이
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="검색량"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 키워드별 검색량 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                키워드별 검색량
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={searchVolumeData}
                  layout="vertical"
                  margin={{ left: 80 }}
                >
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

        {/* 추천 키워드 (순위 미등록) */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            추가 추천 키워드 (순위 미등록)
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            아직 순위를 추적하지 않는 추천 키워드입니다. 이 키워드들을 매장
            소개에 활용하면 검색 노출을 높일 수 있습니다.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {allKeywords
              .filter(
                (kw) => !keywordRanks.some((kr) => kr.keyword === kw.keyword)
              )
              .map((kw, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:border-green-500 transition-colors"
                >
                  <div className="font-medium text-gray-900 mb-2">
                    {kw.keyword}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {kw.searchVolume.toLocaleString()}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      추천
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* 순위 개선 팁 */}
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl shadow-lg p-6 mt-6 border border-blue-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            💡 순위 개선 팁
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                키워드 최적화
              </h3>
              <p className="text-sm text-gray-700">
                상위 순위 키워드를 매장 소개글과 메뉴 설명에 자연스럽게
                포함시키세요.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">리뷰 관리</h3>
              <p className="text-sm text-gray-700">
                고객 리뷰에 적극적으로 답변하고, 좋은 리뷰를 유도하세요.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                정기 업데이트
              </h3>
              <p className="text-sm text-gray-700">
                매장 정보와 사진을 정기적으로 업데이트하여 신선함을 유지하세요.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">프로모션</h3>
              <p className="text-sm text-gray-700">
                이벤트와 프로모션 정보를 적극적으로 홍보하여 검색 노출을
                높이세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
