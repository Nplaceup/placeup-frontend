import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { mockPlaces, mockUser, mockSEOScores } from "../data/mockData";
import { Building2, Calendar, Star, TrendingUp, ExternalLink } from "lucide-react";

export function MyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* 사용자 정보 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="size-16 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-700 font-bold text-2xl">
                {mockUser.name.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {mockUser.name}
              </h1>
              <p className="text-gray-600">{mockUser.email}</p>
            </div>
          </div>
        </div>

        {/* 통계 요약 */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">등록된 매장</span>
              <Building2 className="size-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {mockPlaces.length}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">평균 SEO 점수</span>
              <TrendingUp className="size-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {Math.round(
                mockPlaces.reduce(
                  (sum, p) => sum + mockSEOScores[p.id].total,
                  0
                ) / mockPlaces.length
              )}
              점
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">평균 평점</span>
              <Star className="size-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {(
                mockPlaces.reduce((sum, p) => sum + p.rating, 0) /
                mockPlaces.length
              ).toFixed(1)}
            </div>
          </div>
        </div>

        {/* 등록된 매장 목록 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">등록된 매장</h2>

          <div className="space-y-4">
            {mockPlaces.map((place) => {
              const seoScore = mockSEOScores[place.id];
              return (
                <div
                  key={place.id}
                  className="border border-gray-200 rounded-lg p-5 hover:border-green-500 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {place.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {place.category} • {place.address}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="size-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium">
                            {place.rating}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          리뷰 {place.reviewCount}개
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">
                          SEO 점수
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {seoScore.total}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SEO 상태 바 */}
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {seoScore.details.map((detail, idx) => (
                      <div key={idx}>
                        <div className="text-xs text-gray-600 mb-1 truncate">
                          {detail.category}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              detail.status === "good"
                                ? "bg-green-600"
                                : detail.status === "warning"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${
                                (detail.score / detail.maxScore) * 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/result/${place.id}`)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                    >
                      분석 결과 보기
                    </button>
                    <button
                      onClick={() => navigate(`/analysis/${place.id}`)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                    >
                      재분석
                    </button>
                    <a
                      href={place.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <ExternalLink className="size-4 text-gray-600" />
                    </a>
                  </div>

                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                    <Calendar className="size-3" />
                    <span>등록일: {place.registeredDate}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 매장 추가 버튼 */}
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-colors"
          >
            + 새 매장 추가
          </button>
        </div>

        {/* 계정 관리 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">계정 관리</h2>

          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="font-medium text-gray-900">프로필 수정</div>
              <div className="text-sm text-gray-600">
                이름, 이메일 등 기본 정보 변경
              </div>
            </button>

            <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="font-medium text-gray-900">알림 설정</div>
              <div className="text-sm text-gray-600">
                분석 완료, 순위 변동 알림 설정
              </div>
            </button>

            <button className="w-full text-left px-4 py-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-red-600">
              <div className="font-medium">회원 탈퇴</div>
              <div className="text-sm">계정 및 모든 데이터 삭제</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
