import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Header } from "../components/Header";
import { Loader2, CheckCircle2 } from "lucide-react";
import { apiClient } from "../services/api";

interface AnalysisStep {
  id: string;
  label: string;
  status: "pending" | "processing" | "completed";
}

export function AnalysisProgress() {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const [steps, setSteps] = useState<AnalysisStep[]>([
    { id: "1", label: "플레이스 정보 수집", status: "pending" },
    { id: "2", label: "리뷰 데이터 수집", status: "pending" },
    { id: "3", label: "키워드 추출 및 분석", status: "pending" },
    { id: "4", label: "SEO 점수 계산", status: "pending" },
    { id: "5", label: "경쟁사 데이터 수집", status: "pending" },
    { id: "6", label: "분석 리포트 생성", status: "pending" },
  ]);

  useEffect(() => {
    // 각 단계를 순차적으로 진행
    const processSteps = async () => {
      try {
        // 실제 환경에서는 analysisId를 받아서 상태를 폴링
        // Mock에서는 UI 시뮬레이션만 수행
        for (let i = 0; i < steps.length; i++) {
          // 현재 단계를 processing으로 변경
          setSteps((prev) =>
            prev.map((step, idx) =>
              idx === i ? { ...step, status: "processing" } : step
            )
          );

          // 1-2초 대기 (실제로는 백엔드 폴링)
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 + Math.random() * 1000)
          );

          // 완료로 변경
          setSteps((prev) =>
            prev.map((step, idx) =>
              idx === i ? { ...step, status: "completed" } : step
            )
          );
        }

        // 모든 단계 완료 후 결과 페이지로 이동
        await new Promise((resolve) => setTimeout(resolve, 500));
        navigate(`/result/${placeId}`);
      } catch (error) {
        console.error('분석 진행 중 오류:', error);
        // 에러 처리 로직 추가 가능
      }
    };

    processSteps();
  }, [placeId, navigate, steps.length]);

  const completedCount = steps.filter((s) => s.status === "completed").length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* 제목 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center size-16 bg-green-100 rounded-full mb-4">
              <Loader2 className="size-8 text-green-600 animate-spin" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              분석 진행 중
            </h1>
            <p className="text-gray-600">
              매장 데이터를 수집하고 분석하고 있습니다
            </p>
          </div>

          {/* 진행률 */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  전체 진행률
                </span>
                <span className="text-sm font-medium text-green-600">
                  {completedCount} / {steps.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* 분석 단계 */}
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex items-center gap-4 p-4 rounded-lg transition-colors"
                  style={{
                    backgroundColor:
                      step.status === "processing"
                        ? "#f0fdf4"
                        : step.status === "completed"
                        ? "#f9fafb"
                        : "transparent",
                  }}
                >
                  {/* 아이콘 */}
                  <div className="flex-shrink-0">
                    {step.status === "completed" ? (
                      <CheckCircle2 className="size-6 text-green-600" />
                    ) : step.status === "processing" ? (
                      <Loader2 className="size-6 text-green-600 animate-spin" />
                    ) : (
                      <div className="size-6 rounded-full border-2 border-gray-300" />
                    )}
                  </div>

                  {/* 라벨 */}
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        step.status === "completed"
                          ? "text-gray-600"
                          : step.status === "processing"
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>

                  {/* 상태 텍스트 */}
                  <div className="text-sm">
                    {step.status === "completed" ? (
                      <span className="text-green-600">완료</span>
                    ) : step.status === "processing" ? (
                      <span className="text-green-600">진행중...</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-800 text-center">
              💡 분석이 완료되면 자동으로 결과 페이지로 이동합니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}