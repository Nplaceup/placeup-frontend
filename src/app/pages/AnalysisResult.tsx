import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { Award, AlertCircle, TrendingUp, Search, MessageSquare, Lightbulb, Users } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import axios, { AxiosError } from 'axios';
import { analysisApi } from '../api/analysis';
import { AnalysisResponse } from '../api/type';

// ── 컴포넌트 ──────────────────────────────────────────────────────

export function AnalysisResult() {
  const { placeId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!placeId) {
      navigate('/', { replace: true });
      return;
    }

    const load = async () => {
      try {
        setIsLoading(true);
        // GET /v1/place-analysis?naverPlaceId={placeId}
        const response = await analysisApi.getAnalysisStatus(Number(placeId));
        const result = response.data;

        // 아직 분석 중이면 진행 페이지로 되돌아감
        if (result.analyzing || result.status !== 'COMPLETED') {
          navigate(`/analysis/${placeId}`, { replace: true });
          return;
        }

        setData(result);
      } catch (err) {
        const errMsg = '데이터를 불러오는 중 오류가 발생했습니다.';
        if (axios.isAxiosError(err)) {
          const axiosErr = err as AxiosError<{ code: number; message: string }>;
          setError(axiosErr.response?.data?.message || errMsg);
        } else {
          setError(errMsg);
        }
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [placeId]);

  // ── 로딩 중 ────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Header />
        <div className='container mx-auto px-4 py-12'>
          <div className='animate-pulse space-y-4 max-w-5xl mx-auto'>
            <div className='h-16 bg-gray-200 rounded-xl' />
            <div className='grid grid-cols-3 gap-4'>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className='h-24 bg-gray-200 rounded-xl' />
              ))}
            </div>
            <div className='h-64 bg-gray-200 rounded-xl' />
            <div className='h-64 bg-gray-200 rounded-xl' />
          </div>
        </div>
      </div>
    );
  }

  // ── 에러 ───────────────────────────────────────────────────────

  if (error || !data) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Header />
        <div className='container mx-auto px-4 py-12 text-center'>
          <AlertCircle className='size-12 text-red-400 mx-auto mb-4' />
          <p className='text-gray-600 mb-6'>{error || '데이터를 불러올 수 없습니다.'}</p>
          <button
            onClick={() => navigate('/')}
            className='px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors'
          >
            처음으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // ── 데이터 가공 ────────────────────────────────────────────────

  const { placeName, keywords = [] , seo, feedback } = data;

  // 최고 순위 키워드
  const bestKeyword = keywords
    .filter((kw) => kw.rankNo !== null)
    .sort((a, b) => (a.rankNo ?? 999) - (b.rankNo ?? 999))[0];

  // 기회 키워드 수
  const opportunityCount = keywords.filter((kw) => kw.isOpportunity).length;

  // 월간 총 검색량 합산
  const totalSearchVolume = keywords.reduce((sum, kw) => sum + kw.monthlySearchVolume, 0);

  // 가로 막대 차트 데이터
  const chartData = keywords.map((kw) => ({
    keyword: kw.keyword,
    검색량: kw.monthlySearchVolume,
  }));

  // 레이더 차트 데이터 — placeCompleteness(0~40), reviewQuality(0~60)
  const radarData = seo
    ? [
        { category: '매장 정보 완성도', score: seo.placeCompleteness, max: 40 },
        { category: '리뷰 품질',        score: seo.reviewQuality,      max: 60 },
      ]
    : [];

  // 피드백 합치기 — seo / review / competitor 세 종류
  const allFeedbacks = feedback
    ? [
        ...feedback.seoFeedback.map((msg) => ({ msg, type: 'seo' as const })),
        ...feedback.reviewFeedback.map((msg) => ({ msg, type: 'review' as const })),
        ...feedback.competitorFeedback.map((msg) => ({ msg, type: 'competitor' as const })),
      ]
    : [];

  // 경쟁도 배지 색상
  const competitionStyle = {
    '높음': 'bg-red-100 text-red-800',
    '중간': 'bg-yellow-100 text-yellow-800',
    '낮음': 'bg-green-100 text-green-800',
  };

  // 피드백 타입별 스타일
  const feedbackStyle = {
    seo:        { bg: 'bg-yellow-50 border-yellow-200', icon: 'text-yellow-600' },
    review:     { bg: 'bg-blue-50 border-blue-200',     icon: 'text-blue-500' },
    competitor: { bg: 'bg-purple-50 border-purple-200', icon: 'text-purple-500' },
  };

  // ── 렌더 ───────────────────────────────────────────────────────

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />

      <div className='container mx-auto px-4 py-8 max-w-6xl'>

        {/* 매장명 헤더 */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8'>
          <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-bold text-gray-900'>{placeName}</h1>
            <button
              onClick={() => navigate(`/keyword-ranking/${placeId}`)}
              className='flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors'
            >
              <TrendingUp className='size-4' />
              키워드 검색 순위
            </button>
          </div>
        </div>

        {/* 요약 카드 3개 */}
        <div className='grid grid-cols-3 gap-4 mb-8'>
          <div className='bg-green-700 rounded-xl p-5 text-white'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-green-200 text-sm'>최고 키워드 순위</span>
              <TrendingUp className='size-4 text-green-300' />
            </div>
            <div className='text-3xl font-bold mb-1'>
              {bestKeyword ? `${bestKeyword.rankNo}위` : '-'}
            </div>
            <div className='text-green-300 text-sm truncate'>
              {bestKeyword ? bestKeyword.keyword : '순위 데이터 없음'}
            </div>
          </div>

          <div className='bg-white rounded-xl border border-gray-200 p-5'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-gray-500 text-sm'>추천 키워드</span>
              <Search className='size-4 text-gray-400' />
            </div>
            <div className='text-3xl font-bold text-gray-900 mb-1'>{keywords.length}개</div>
            <div className='text-sm text-gray-400'>기회 키워드 {opportunityCount}개 포함</div>
          </div>

          <div className='bg-white rounded-xl border border-gray-200 p-5'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-gray-500 text-sm'>월간 총 검색량</span>
              <MessageSquare className='size-4 text-gray-400' />
            </div>
            <div className='text-3xl font-bold text-gray-900 mb-1'>
              {totalSearchVolume.toLocaleString()}
            </div>
            <div className='text-sm text-gray-400'>추천 키워드 합산</div>
          </div>
        </div>

        {/* 추천 키워드(2) + 검색량 차트(1) — 하나의 블럭 */}
        <div className='bg-white rounded-xl border border-gray-200 overflow-hidden mb-8'>
          <div className='grid grid-cols-[2fr_1fr]'>

            {/* 왼쪽: 추천 키워드 */}
            <div className='p-6'>
              <h2 className='text-base font-medium text-gray-900 mb-4'>추천 키워드</h2>
              <div className='space-y-2'>
                {keywords.map((kw, index) => (
                  <div
                    key={index}
                    className='grid items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-lg'
                    style={{ gridTemplateColumns: '28px 1fr auto auto auto auto' }}
                  >
                    <div className='size-7 bg-green-100 rounded-full flex items-center justify-center text-xs font-medium text-green-800'>
                      {index + 1}
                    </div>
                    <span className='text-sm font-medium text-gray-900 truncate'>{kw.keyword}</span>
                    <span className='text-xs text-gray-400 whitespace-nowrap'>
                      {kw.monthlySearchVolume > 0 ? kw.monthlySearchVolume.toLocaleString() : '0'}
                    </span>
                    <span className='text-xs text-gray-400 whitespace-nowrap'>
                      {kw.rankNo !== null ? `${kw.rankNo}위` : '—'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${competitionStyle[kw.competitionLevel]}`}>
                      경쟁 {kw.competitionLevel}
                    </span>
                    {kw.isOpportunity
                      ? <span className='text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-medium whitespace-nowrap'>기회</span>
                      : <span />
                    }
                  </div>
                ))}
              </div>
            </div>

            {/* 오른쪽: 검색량 비교 */}
            <div className='p-6 border-l border-gray-200'>
              <h2 className='text-base font-medium text-gray-900 mb-4'>검색량 비교</h2>
              <ResponsiveContainer width='100%' height={240}>
                <BarChart data={chartData} layout='vertical' margin={{ left: 0, right: 12 }}>
                  <CartesianGrid strokeDasharray='3 3' horizontal={false} />
                  <XAxis
                    type='number'
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
                  />
                  <YAxis type='category' dataKey='keyword' tick={{ fontSize: 11, fill: '#6b7280' }} width={60} />
                  <Tooltip formatter={(v: number) => v.toLocaleString()} />
                  <Bar dataKey='검색량' fill='#16a34a' radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* SEO 점수(1) + 레이더 차트(1) — 하나의 블럭 */}
        {seo && (
          <div className='bg-white rounded-xl border border-gray-200 overflow-hidden mb-8'>
            <div className='grid grid-cols-2'>

              {/* 왼쪽: 세부 점수 */}
              <div className='p-6'>
                <div className='flex items-center justify-between mb-2'>
                  <h2 className='text-base font-medium text-gray-900'>플레이스 관리 점수</h2>
                  <div className='flex items-center gap-2'>
                    <Award className='size-4 text-green-600' />
                    <span className='text-xl font-bold text-green-600'>{seo.score}점</span>
                    <span className='text-sm text-gray-400'>{seo.grade}</span>
                  </div>
                </div>
                <div className='w-full bg-gray-100 rounded-full h-2.5 mb-6'>
                  <div
                    className='h-2.5 rounded-full bg-yellow-400 transition-all'
                    style={{ width: `${seo.score}%` }}
                  />
                </div>
                <div className='space-y-4'>
                  {radarData.map((item) => (
                    <div key={item.category}>
                      <div className='flex justify-between text-sm mb-1'>
                        <span className='text-gray-600'>{item.category}</span>
                        <span className='font-medium text-gray-900'>{item.score} / {item.max}</span>
                      </div>
                      <div className='w-full bg-gray-100 rounded-full h-1.5'>
                        <div
                          className='h-1.5 rounded-full bg-green-500 transition-all'
                          style={{ width: `${Math.round((item.score / item.max) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 오른쪽: 레이더 차트 */}
              <div className='p-6 border-l border-gray-200 flex items-center'>
                <ResponsiveContainer width='100%' height={240}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey='category' tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 60]} tick={false} />
                    <Radar name='점수' dataKey='score' stroke='#16a34a' fill='#16a34a' fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* 개선 방안 */}
        {feedback && (
          <div className='bg-white rounded-xl border border-gray-200 p-6 mb-8'>
            <div className='flex items-center gap-2 mb-1'>
              <Lightbulb className='size-4 text-yellow-500' />
              <h2 className='text-base font-medium text-gray-900'>개선 방안</h2>
            </div>
            <p className='text-sm text-gray-400 mb-4'>{feedback.summary}</p>
            <div className='space-y-3'>
              {allFeedbacks.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-4 rounded-lg border ${feedbackStyle[item.type].bg}`}
                >
                  <AlertCircle className={`size-4 flex-shrink-0 mt-0.5 ${feedbackStyle[item.type].icon}`} />
                  <p className='text-sm text-gray-700'>{item.msg}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 매장 키워드 요약 (placeSummary) */}
        {feedback?.placeSummary && Object.keys(feedback.placeSummary).length > 0 && (
          <div className='bg-white rounded-xl border border-gray-200 p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <Users className='size-4 text-gray-500' />
              <h2 className='text-base font-medium text-gray-900'>방문자 키워드 요약</h2>
            </div>
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
              {Object.entries(feedback.placeSummary).map(([category, keywords]) => (
                <div key={category} className='bg-gray-50 rounded-lg p-4'>
                  <div className='text-xs font-medium text-gray-500 mb-2'>{category}</div>
                  <div className='flex flex-wrap gap-1.5'>
                    {keywords.map((kw) => (
                      <span key={kw} className='text-xs px-2 py-1 bg-white border border-gray-200 rounded-full text-gray-700'>
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
