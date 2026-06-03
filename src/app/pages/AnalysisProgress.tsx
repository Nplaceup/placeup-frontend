import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { Header } from '../components/Header';
import { Loader2, XCircle, CheckCircle2 } from 'lucide-react';
import { analysisApi } from '../api/analysis';
import { AnalysisStatus } from '../api/type';
import axios, { AxiosError } from 'axios';

const POLL_INTERVAL_MS = 5000;

// ── status → 단계 인덱스 매핑 ──────────────────────────────────
// 0: 플레이스 정보 수집
// 1: 리뷰 데이터 수집
// 2: 키워드 분석
// 3: 순위 데이터 수집
const STATUS_TO_STEP: Record<AnalysisStatus, number> = {
  REQUESTED:               0,
  PLACE_CRAWLING:          0,
  REVIEW_CRAWLING:         1,
  KEYWORD_EXTRACTING:      2,
  RANKING_CRAWLING:        3,
  SEARCH_VOLUME_CRAWLING:  3,
  SEO_ANALYZING:           3,
  COMPLETED:               4,
  FAILED:                  4,
};

const STEPS = [
  { label: '플레이스 정보 수집' },
  { label: '리뷰 데이터 수집' },
  { label: '키워드 분석' },
  { label: '순위 데이터 수집' },
];

export function AnalysisProgress() {
  const { placeId } = useParams<{ placeId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const placeName: string = location.state?.placeName ?? '매장';

  const [currentStep, setCurrentStep] = useState(0);
  const [pageStatus, setPageStatus] = useState<'PROCESSING' | 'FAILED'>('PROCESSING');
  const [error, setError] = useState('');

  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigatedRef = useRef(false); // 중복 이동 방지

  const stopPolling = () => {
    if (pollTimerRef.current) { clearInterval(pollTimerRef.current); pollTimerRef.current = null; }
  };

  // ── API 폴링 ──────────────────────────────────────────────────
  const startPolling = () => {
    if (!placeId) return;

    const poll = async () => {
      try {
        const response = await analysisApi.getAnalysisStatus(Number(placeId));
        const { analyzing, status } = response.data;

        // status로 현재 단계 업데이트
        const step = STATUS_TO_STEP[status] ?? 0;
        setCurrentStep(step);

        // 분석 완료 → 결과 페이지 이동
        if (!analyzing && !navigatedRef.current) {
          navigatedRef.current = true;
          stopPolling();
          navigate(`/result/${placeId}`);
        }

        // 분석 실패
        if (status === 'FAILED') {
          stopPolling();
          setPageStatus('FAILED');
          setError('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
      } catch (err) {
        stopPolling();
        setPageStatus('FAILED');
        const errMsg = '서버와의 연결이 끊어졌습니다. 잠시 후 다시 시도해주세요.';
        if (axios.isAxiosError(err)) {
          const axiosErr = err as AxiosError<{ code: number; message: string }>;
          setError(axiosErr.response?.data?.message || errMsg);
        } else {
          setError(errMsg);
        }
      }
    };

    poll();
    pollTimerRef.current = setInterval(poll, POLL_INTERVAL_MS);
  };

  useEffect(() => {
    if (!placeId) { navigate('/', { replace: true }); return; }
    startPolling();
    return () => stopPolling();
  }, []);

  const handleRetry = () => {
    setError('');
    setCurrentStep(0);
    setPageStatus('PROCESSING');
    navigatedRef.current = false;
    startPolling();
  };

  // progress: 현재 단계 / 전체 단계 * 100
  const progress = Math.min(Math.round((currentStep / STEPS.length) * 100), 100);

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />

      <div className='container mx-auto px-4 py-12'>
        <div className='max-w-2xl mx-auto'>
          {/* 제목 */}
          <div className='text-center mb-8'>
            <div className='inline-flex items-center justify-center size-16 bg-green-100 rounded-full mb-4'>
              {pageStatus === 'FAILED' ? (
                <XCircle className='size-8 text-red-500' />
              ) : (
                <Loader2 className='size-8 text-green-600 animate-spin' />
              )}
            </div>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              {pageStatus === 'FAILED' ? '분석 실패' : '분석 진행 중'}
            </h1>
            <p className='text-gray-600'>
              {pageStatus === 'FAILED'
                ? '분석 중 문제가 발생했습니다.'
                : `${placeName}의 데이터를 수집하고 분석하고 있습니다`}
            </p>
          </div>

          {/* 진행률 + 단계 */}
          <div className='bg-white rounded-xl shadow-lg p-8 mb-6'>
            <div className='mb-6'>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-sm font-medium text-gray-700'>전체 진행률</span>
                <span className='text-sm font-medium text-green-600'>{progress}%</span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-3'>
                <div
                  className='bg-green-600 h-3 rounded-full transition-all duration-700'
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className='space-y-3'>
              {STEPS.map((step, i) => {
                const isDone = i < currentStep;
                const isActive = i === currentStep && pageStatus !== 'FAILED';

                return (
                  <div
                    key={step.label}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isDone ? 'bg-gray-50' : isActive ? 'bg-green-50' : ''
                    }`}
                  >
                    <div className='flex-shrink-0'>
                      {isDone ? (
                        <CheckCircle2 className='size-5 text-green-500' />
                      ) : isActive ? (
                        <Loader2 className='size-5 text-green-600 animate-spin' />
                      ) : (
                        <div className='size-5 rounded-full border-2 border-gray-300' />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isDone ? 'text-gray-500' : isActive ? 'text-green-700' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                    <div className='ml-auto text-xs'>
                      {isDone && <span className='text-gray-400'>완료</span>}
                      {isActive && <span className='text-green-600'>진행중...</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 에러 */}
          {error && (
            <div className='bg-red-50 rounded-lg p-4 border border-red-200 mb-4'>
              <p className='text-sm text-red-800 text-center mb-3'>{error}</p>
              <div className='flex justify-center'>
                <button
                  onClick={handleRetry}
                  className='px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors'
                >
                  다시 시도
                </button>
              </div>
            </div>
          )}

          {/* 안내 */}
          {!error && (
            <div className='bg-blue-50 rounded-lg p-4 border border-blue-200'>
              <p className='text-sm text-blue-800 text-center'>
                분석이 완료되면 자동으로 결과 페이지로 이동합니다
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}