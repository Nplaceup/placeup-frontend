import { useNavigate } from "react-router";
import { Building2, Search, TrendingUp } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();

  const handleNaverLogin = () => {
    // 실제로는 네이버 OAuth로 리다이렉트
    // 데모 목적으로 바로 대시보드로 이동
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-12 pt-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Search className="size-10 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">PlaceUp</h1>
          </div>
          <p className="text-xl text-gray-600">
            네이버 플레이스 SEO 분석 및 키워드 추천 서비스
          </p>
        </div>

        {/* 메인 로그인 카드 */}
        <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-xl p-6 mb-12">
          <h2 className="text-xl font-bold text-center mb-5">로그인</h2>
          <p className="text-gray-600 text-center mb-6 text-sm">
            네이버 계정으로 간편하게 시작하세요
          </p>

          <button
            onClick={handleNaverLogin}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-5 rounded-lg transition-colors flex items-center justify-center gap-3"
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
            </svg>
            네이버로 로그인
          </button>

          <p className="text-xs text-gray-500 text-center mt-5">
            로그인하시면 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다.
          </p>
        </div>

        {/* 서비스 소개 */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">
            PlaceUp으로 할 수 있는 일
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="bg-blue-100 rounded-full size-12 flex items-center justify-center mb-4">
                <Search className="size-6 text-blue-600" />
              </div>
              <h4 className="font-bold mb-2">키워드 추천</h4>
              <p className="text-gray-600 text-sm">
                리뷰와 플레이스 정보를 분석하여 최적의 검색 키워드를 추천합니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="bg-green-100 rounded-full size-12 flex items-center justify-center mb-4">
                <TrendingUp className="size-6 text-green-600" />
              </div>
              <h4 className="font-bold mb-2">SEO 점수 분석</h4>
              <p className="text-gray-600 text-sm">
                매장의 검색 최적화 점수를 측정하고 개선 방안을 제시합니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="bg-purple-100 rounded-full size-12 flex items-center justify-center mb-4">
                <Building2 className="size-6 text-purple-600" />
              </div>
              <h4 className="font-bold mb-2">경쟁사 분석</h4>
              <p className="text-gray-600 text-sm">
                상위 노출 경쟁 업체와 비교하여 강점과 약점을 파악합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}