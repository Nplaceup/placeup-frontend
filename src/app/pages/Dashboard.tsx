import { useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Search, Link as LinkIcon, AlertCircle, FlaskConical } from "lucide-react";
import { apiClient, ApiError } from "../services/api";
import { FALLBACK_PLACE_ID } from "../data/MockFallBack";

export function Dashboard() {
  const navigate = useNavigate();
  const [placeUrl, setPlaceUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!placeUrl.trim()) {
      setError("플레이스 URL을 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await apiClient.registerPlace({
        naver_url: placeUrl.trim(),
      });

      if (response.status === "existing") {
        navigate(`/result/${response.place_id}`);
      } else {
        navigate(`/analysis/${response.place_id}`, {
          state: { jobId: response.crawling_job_id },
        });
      }
    } catch {
      // 백엔드 미연결 시 → 예시 데이터로 분석 진행 시뮬레이션
      navigate(`/analysis/${FALLBACK_PLACE_ID}`, {
        state: { fallback: true },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFallbackDemo = () => {
    navigate(`/analysis/${FALLBACK_PLACE_ID}`, {
      state: { fallback: true },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              네이버 플레이스 분석 시작하기
            </h1>
            <p className="text-gray-600">
              분석할 매장의 네이버 플레이스 URL을 입력하세요
            </p>
          </div>

          {/* URL 입력 폼 */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
            <label htmlFor="placeUrl" className="block text-sm font-medium text-gray-700 mb-2">
              플레이스 URL
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="text"
                  id="placeUrl"
                  value={placeUrl}
                  onChange={(e) => setPlaceUrl(e.target.value)}
                  placeholder="https://place.naver.com/restaurant/12345678"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search className="size-5" />
                {isLoading ? "분석 중..." : "분석 시작"}
              </button>
            </div>

            {error && (
              <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="size-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <p className="mt-3 text-xs text-gray-500">
              예시: https://place.naver.com/restaurant/123456789
            </p>
          </form>

          {/* 예시 데이터 테스트 버튼 */}
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-yellow-800">
              <FlaskConical className="size-4 flex-shrink-0" />
              백엔드 미연결 상태입니다. 예시 데이터로 UI를 테스트할 수 있어요.
            </div>
            <button
              onClick={handleFallbackDemo}
              className="flex-shrink-0 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              예시 데이터로 보기
            </button>
          </div>
        </div>

        {/* 사용 가이드 */}
        <div className="max-w-5xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            PlaceUp 사용 가이드
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="size-10 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600 font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">URL 입력</h3>
              <p className="text-sm text-gray-600">
                분석하고 싶은 매장의 네이버 플레이스 URL을 입력하세요.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="size-10 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600 font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">데이터 분석</h3>
              <p className="text-sm text-gray-600">
                리뷰, 키워드, 매장 정보를 자동으로 수집하고 분석합니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="size-10 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600 font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">결과 확인</h3>
              <p className="text-sm text-gray-600">
                키워드 추천, 순위, SEO 점수, 개선 방안을 확인하세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}