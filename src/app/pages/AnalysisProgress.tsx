import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { Header } from '../components/Header';
import { Loader2, XCircle, CheckCircle2 } from 'lucide-react';
import { analysisApi } from '../api/analysis';
import axios, { AxiosError } from 'axios';

const POLL_INTERVAL_MS = 5000;
const STEP_INTERVAL_MS = 2000; // 단계 하나 진행하는 데 걸리는 시간

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
  const placeUrl: string = location.state?.placeUrl ?? '';

  // currentStep: 0~3 진행 중인 단계 인덱스, 4 = 전부 완료(100%)
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnalysisDone, setIsAnalysisDone] = useState(false);
  const [status, setStatus] = useState<'PROCESSING' | 'FAILED'>('PROCESSING');
  const [error, setError] = useState('');

  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const canNavigateRef = useRef(false); // 100% 완료 여부
  const analysisDoneRef = useRef(false); // API 응답 완료 여부

  const stopAll = () => {
    if (stepTimerRef.current) { clearInterval(stepTimerRef.current); stepTimerRef.current = null; }
    if (pollTimerRef.current) { clearInterval(pollTimerRef.current); pollTimerRef.current = null; }
  };

  const tryNavigate = () => {
    if (canNavigateRef.current && analysisDoneRef.current) {
      stopAll();
      navigate(`/result/${placeId}`);
    }
  };

  // ── 단계 애니메이션 ──
  const startStepAnimation = () => {
    stepTimerRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= STEPS.length) {
          // 마지막 단계 완료 → 100%
          if (stepTimerRef.current) { clearInterval(stepTimerRef.current); stepTimerRef.current = null; }
          canNavigateRef.current = true;
          tryNavigate();
          return next;
        }
        return next;
      });
    }, STEP_INTERVAL_MS);
  };

  // ── API 폴링 ──
  const startPolling = () => {
    const poll = async () => {
      try {
        const response = await analysisApi.getPlaceAnalysis(placeUrl);
        if (!response.data.analyzing) {
          analysisDoneRef.current = true;
          setIsAnalysisDone(true);
          if (pollTimerRef.current) { clearInterval(pollTimerRef.current); pollTimerRef.current = null; }
          tryNavigate();
        }
      } catch (err) {
        stopAll();
        setStatus('FAILED');
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
    startStepAnimation();
    startPolling();
    return () => stopAll();
  }, []);

  const handleRetry = () => {
    setError('');
    setCurrentStep(0);
    setIsAnalysisDone(false);
    setStatus('PROCESSING');
    canNavigateRef.current = false;
    analysisDoneRef.current = false;
    startStepAnimation();
    startPolling();
  };

  const progress = Math.min(currentStep * 25, 100);
  const isAllStepsDone = currentStep >= STEPS.length;

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />

      <div className='container mx-auto px-4 py-12'>
        <div className='max-w-2xl mx-auto'>
          {/* 제목 */}
          <div className='text-center mb-8'>
            <div className='inline-flex items-center justify-center size-16 bg-green-100 rounded-full mb-4'>
              {status === 'FAILED' ? (
                <XCircle className='size-8 text-red-500' />
              ) : (
                <Loader2 className='size-8 text-green-600 animate-spin' />
              )}
            </div>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              {status === 'FAILED' ? '분석 실패' : '분석 진행 중'}
            </h1>
            <p className='text-gray-600'>
              {status === 'FAILED'
                ? '분석 중 문제가 발생했습니다.'
                : isAllStepsDone && !isAnalysisDone
                  ? '분석 마무리 중입니다. 잠시만 기다려주세요...'
                  : `${placeName}의 데이터를 수집하고 분석하고 있습니다`}
            </p>
          </div>

          {/* 진행률 + 단계 */}
          <div className='bg-white rounded-xl shadow-lg p-8 mb-6'>
            {/* Progress bar */}
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

            {/* 단계 목록 */}
            <div className='space-y-3'>
              {STEPS.map((step, i) => {
                const isDone = i < currentStep;
                const isActive = i === currentStep;

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