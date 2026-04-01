import { useParams } from "react-router";
import { Header } from "../components/Header";
import {
  mockPlaces,
  mockKeywordRecommendations,
  mockSEOScores,
  mockCompetitors,
  mockKeywordRanks,
  mockReviews,
} from "../data/mockData";
import {
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Minus,
  Award,
  AlertCircle,
  CheckCircle2,
  Search,
  MessageSquare,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
} from "recharts";

export function AnalysisResult() {
  const { placeId } = useParams();
  const place = mockPlaces.find((p) => p.id === placeId);
  const keywords = mockKeywordRecommendations[placeId || ""] || [];
  const seoScore = mockSEOScores[placeId || ""];
  const competitors = mockCompetitors[placeId || ""] || [];
  const keywordRanks = mockKeywordRanks[placeId || ""] || [];
  const reviews = mockReviews[placeId || ""] || [];

  if (!place) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">매장을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  // SEO 레이더 차트 데이터
  const radarData = seoScore.details.map((detail) => ({
    category: detail.category,
    score: detail.score,
    maxScore: detail.maxScore,
  }));

  // 키워드 검색량 차트 데이터
  const keywordChartData = keywords.slice(0, 5).map((kw) => ({
    keyword: kw.keyword.split(" ").slice(-1)[0], // 마지막 단어만 표시
    검색량: kw.searchVolume,
    빈도: kw.frequency * 100,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* 헤더 - 매장 정보 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {place.name}
              </h1>
              <p className="text-gray-600 mb-1">{place.category}</p>
              <p className="text-sm text-gray-500">{place.address}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="font-medium">{place.rating}</span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-sm text-gray-600">
                  리뷰 {place.reviewCount}개
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">분석 완료</div>
              <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString("ko-KR")}
              </div>
            </div>
          </div>
        </div>

        {/* SEO 점수 요약 */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-100">전체 SEO 점수</span>
              <Award className="size-6 text-green-100" />
            </div>
            <div className="text-4xl font-bold mb-1">{seoScore.total}점</div>
            <div className="text-green-100 text-sm">100점 만점</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">추천 키워드</span>
              <Search className="size-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {keywords.length}개
            </div>
            <div className="text-sm text-gray-500">우선순위 분류됨</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">분석된 리뷰</span>
              <MessageSquare className="size-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {place.reviewCount}개
            </div>
            <div className="text-sm text-gray-500">최근 6개월</div>
          </div>
        </div>

        {/* 2열 레이아웃 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* 왼쪽 열 */}
          <div className="space-y-6">
            {/* 키워드 추천 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                추천 키워드
              </h2>
              <div className="space-y-3">
                {keywords.map((kw, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0 size-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-700 font-semibold text-sm">
                        {kw.priority}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 mb-1">
                        {kw.keyword}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>검색량: {kw.searchVolume.toLocaleString()}</span>
                        <span>•</span>
                        <span>빈도: {kw.frequency}회</span>
                        <span>•</span>
                        <span className="text-green-600">
                          차별화: {kw.differentiationScore}점
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          kw.source === "review"
                            ? "bg-blue-100 text-blue-700"
                            : kw.source === "description"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {kw.source === "review"
                          ? "리뷰"
                          : kw.source === "description"
                          ? "설명"
                          : "카테고리"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO 상세 점수 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                SEO 점수 상세
              </h2>
              <div className="space-y-4">
                {seoScore.details.map((detail, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {detail.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {detail.score} / {detail.maxScore}
                        </span>
                        {detail.status === "good" ? (
                          <CheckCircle2 className="size-4 text-green-600" />
                        ) : detail.status === "warning" ? (
                          <AlertCircle className="size-4 text-yellow-600" />
                        ) : (
                          <AlertCircle className="size-4 text-red-600" />
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          detail.status === "good"
                            ? "bg-green-600"
                            : detail.status === "warning"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{
                          width: `${(detail.score / detail.maxScore) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽 열 */}
          <div className="space-y-6">
            {/* 키워드 순위 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                키워드 검색 순위
              </h2>
              <div className="space-y-3">
                {keywordRanks.map((kr, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">
                        {kr.keyword}
                      </div>
                      <div className="text-xs text-gray-500">
                        검색량: {kr.searchVolume.toLocaleString()}/월
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {kr.rank}위
                        </div>
                        {kr.change !== 0 && (
                          <div
                            className={`flex items-center justify-end gap-1 text-xs ${
                              kr.change > 0
                                ? "text-green-600"
                                : kr.change < 0
                                ? "text-red-600"
                                : "text-gray-500"
                            }`}
                          >
                            {kr.change > 0 ? (
                              <ArrowUp className="size-3" />
                            ) : kr.change < 0 ? (
                              <ArrowDown className="size-3" />
                            ) : (
                              <Minus className="size-3" />
                            )}
                            <span>
                              {Math.abs(kr.change) > 0
                                ? Math.abs(kr.change)
                                : "-"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 레이더 차트 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                SEO 점수 시각화
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis
                    dataKey="category"
                    tick={{ fontSize: 11 }}
                  />
                  <PolarRadiusAxis angle={90} domain={[0, 25]} />
                  <Radar
                    name="점수"
                    dataKey="score"
                    stroke="#16a34a"
                    fill="#16a34a"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* 개선 방안 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                개선 방안
              </h2>
              <div className="space-y-3">
                {seoScore.details
                  .filter((d) => d.status !== "good")
                  .map((detail, index) => (
                    <div
                      key={index}
                      className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {detail.category}
                          </h4>
                          <p className="text-sm text-gray-700">
                            {detail.category === "업데이트 빈도"
                              ? "정기적인 포스트 작성과 메뉴 업데이트로 신선한 정보를 유지하세요."
                              : detail.category === "키워드 최적화"
                              ? "추천 키워드를 매장 소개글에 자연스럽게 포함시키세요."
                              : "리뷰에 적극적으로 답변하고 고객과의 소통을 강화하세요."}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* 경쟁사 비교 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">경쟁사 분석</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {competitors.map((comp, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="size-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-semibold text-sm">
                        {comp.rank}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{comp.name}</h3>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">SEO 점수</span>
                    <span className="text-sm font-medium">{comp.seoScore}점</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-green-600 h-1.5 rounded-full"
                      style={{ width: `${comp.seoScore}%` }}
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  리뷰 {comp.reviewCount}개
                </div>
                <div className="flex flex-wrap gap-1">
                  {comp.keywords.slice(0, 3).map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 키워드 검색량 차트 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            추천 키워드 검색량 비교
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={keywordChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="keyword" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="검색량" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 리뷰 샘플 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            주요 리뷰 샘플
          </h2>
          <div className="space-y-3">
            {reviews.slice(0, 5).map((review, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-start gap-3">
                  <MessageSquare className="size-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{review}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}