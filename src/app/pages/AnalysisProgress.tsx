import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { Header } from '../components/Header';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

const POLL_INTERVAL_MS = 2500;

// 백엔드 미연결 시 사용할 fallback 단계 목록
// const FALLBACK_STEPS: CrawlingStep[] = [
//   { key: 'place_info', label: '플레이스 정보 수집', done: false },
//   { key: 'reviews', label: '리뷰 데이터 수집', done: false },
//   { key: 'keywords', label: '키워드 분석', done: false },
//   { key: 'ranking', label: '순위 데이터 수집', done: false },
// ];

export function AnalysisProgress() {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const jobId: number | undefined = location.state?.jobId;
  const isFallback: boolean = location.state?.fallback ?? false;

  // const [steps, setSteps] = useState<CrawlingStep[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'PROCESSING' | 'DONE' | 'FAILED'>('PROCESSING');
  const [error, setError] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // ── fallback 시뮬레이션 ──
  const runFallbackSimulation = () => {
    // setSteps(FALLBACK_STEPS.map((s) => ({ ...s })));
    let current = 0;

    const tick = () => {
      // if (current >= FALLBACK_STEPS.length) {
      //   stopPolling();
      //   setProgress(100);
      //   setStatus('DONE');
      //   setTimeout(() => navigate(`/result/${placeId}`), 500);
      //   return;
      // }

      // setSteps((prev) =>
      //   prev.map((s, i) => ({
      //     ...s,
      //     done: i < current,
      //   })),
      // );
      // setProgress(Math.round((current / FALLBACK_STEPS.length) * 100));
      current++;
    };

    tick(); // 즉시 1회
    intervalRef.current = setInterval(tick, 1500);
  };

  // ── 실제 폴링 ──
  const runPolling = (jobId: number) => {
    const poll = async () => {
      try {
        // const data = await apiClient.getCrawlingJob(jobId);
        // setSteps(data.steps);
        // setProgress(data.progress);
        // setStatus(data.status);
        // if (data.status === 'DONE') {
        //   stopPolling();
        //   setTimeout(() => navigate(`/result/${data.place_id}`), 500);
        // } else if (data.status === 'FAILED') {
        //   stopPolling();
        //   setError('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
        // }
      } catch (err) {
        stopPolling();
        // if (err instanceof ApiError && err.status === 404) {
        //   setError('분석 작업을 찾을 수 없습니다.');
        // } else {
        //   setError('서버와의 연결이 끊어졌습니다. 잠시 후 다시 시도해주세요.');
        // }
        setStatus('FAILED');
      }
    };

    poll();
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);
  };

  useEffect(() => {
    if (isFallback) {
      runFallbackSimulation();
    } else if (jobId) {
      runPolling(jobId);
    } else {
      // jobId도 없고 fallback도 아닌 경우 → 결과 페이지로
      // navigate(`/result/${placeId}`, { replace: true });
    }

    return () => stopPolling();
  }, []);

  const handleRetry = async () => {
    if (!placeId) return;
    setError('');
    setStatus('PROCESSING');

    if (isFallback) {
      runFallbackSimulation();
      return;
    }

    try {
      // const data = await apiClient.retryCrawlingJob({ place_id: Number(placeId) });
      // runPolling(data.job_id);
    } catch {
      setError('재시도 요청에 실패했습니다.');
      setStatus('FAILED');
    }
  };

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
              {status === 'FAILED' ? '분석 중 문제가 발생했습니다.' : '매장 데이터를 수집하고 분석하고 있습니다'}
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
                  className='bg-green-600 h-3 rounded-full transition-all duration-500'
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className='space-y-4'>
              {/* {steps.length === 0
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className='flex items-center gap-4 p-4 rounded-lg animate-pulse'>
                      <div className='size-6 rounded-full bg-gray-200 flex-shrink-0' />
                      <div className='h-4 bg-gray-200 rounded w-48' />
                    </div>
                  ))
                : steps.map((step) => {
                    const firstPendingIdx = steps.findIndex((s) => !s.done);
                    const isCurrentStep = !step.done && steps.indexOf(step) === firstPendingIdx;

                    return (
                      <div
                        key={step.key}
                        className='flex items-center gap-4 p-4 rounded-lg transition-colors'
                        style={{
                          backgroundColor: isCurrentStep ? '#f0fdf4' : step.done ? '#f9fafb' : 'transparent',
                        }}
                      >
                        <div className='flex-shrink-0'>
                          {step.done ? (
                            <CheckCircle2 className='size-6 text-green-600' />
                          ) : isCurrentStep ? (
                            <Loader2 className='size-6 text-green-600 animate-spin' />
                          ) : (
                            <div className='size-6 rounded-full border-2 border-gray-300' />
                          )}
                        </div>

                        <div className='flex-1'>
                          <p
                            className={`font-medium ${
                              step.done ? 'text-gray-600' : isCurrentStep ? 'text-green-600' : 'text-gray-400'
                            }`}
                          >
                            {step.label}
                          </p>
                        </div>

                        <div className='text-sm'>
                          {step.done ? (
                            <span className='text-green-600'>완료</span>
                          ) : isCurrentStep ? (
                            <span className='text-green-600'>진행중...</span>
                          ) : null}
                        </div>
                      </div>
                    );
                  })} */}
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
              <p className='text-sm text-blue-800 text-center'>분석이 완료되면 자동으로 결과 페이지로 이동합니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
