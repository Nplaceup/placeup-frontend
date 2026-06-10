import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import {
  AlertCircle, TrendingUp, Search, Lightbulb, Users,
  ChevronDown, ChevronUp, ArrowLeft, Star, BarChart2,
  Sparkles, Zap,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import axios, { AxiosError } from 'axios';
import { analysisApi } from '../api/analysis';
import { AnalysisResponse, ApiResponse } from '../api/type';

function getGradeColor(score: number) {
  if (score >= 80) return { ring: '#16a34a', bg: 'bg-green-50', text: 'text-green-700' };
  if (score >= 60) return { ring: '#2563eb', bg: 'bg-blue-50', text: 'text-blue-700' };
  if (score >= 40) return { ring: '#d97706', bg: 'bg-amber-50', text: 'text-amber-700' };
  return { ring: '#dc2626', bg: 'bg-red-50', text: 'text-red-700' };
}

function getCompetitionBadge(level: string) {
  if (level === '높음') return 'bg-red-50 text-red-600 border border-red-100';
  if (level === '중간') return 'bg-amber-50 text-amber-600 border border-amber-100';
  return 'bg-green-50 text-green-600 border border-green-100';
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className='bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg'>
      <p className='font-semibold mb-0.5'>{label}</p>
      <p className='text-green-300'>{payload[0].value.toLocaleString()}회 / 월</p>
    </div>
  );
};

function ScoreGauge({ score, grade }: { score: number; grade: string }) {
  const gradeColor = getGradeColor(score);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className='flex flex-col items-center'>
      <div className='relative size-36'>
        <svg className='size-36 -rotate-90' viewBox='0 0 120 120'>
          <circle cx='60' cy='60' r={radius} fill='none' stroke='#e5e7eb' strokeWidth='10' />
          <circle
            cx='60' cy='60' r={radius} fill='none'
            stroke={gradeColor.ring} strokeWidth='10'
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap='round'
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className='absolute inset-0 flex flex-col items-center justify-center'>
          <span className='text-3xl font-bold text-gray-900'>{score}</span>
          <span className='text-xs text-gray-500 mt-0.5'>/ 100점</span>
        </div>
      </div>
      <span className={`mt-2 text-sm font-semibold px-3 py-1 rounded-full ${gradeColor.bg} ${gradeColor.text}`}>
        {grade}
      </span>
    </div>
  );
}

export function AnalysisResult() {
  const { placeId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAllKeywords, setShowAllKeywords] = useState(false);

  useEffect(() => {
    if (!placeId) { navigate('/', { replace: true }); return; }
    const load = async () => {
      try {
        setIsLoading(true);
        const result = await analysisApi.getAnalysisStatus(Number(placeId));
        const d = result.data;
        if (d.analyzing || d.status !== 'COMPLETED') {
          navigate(`/analysis/${placeId}`, { replace: true });
          return;
        }
        setData(d);
      } catch (err) {
        const errMsg = '데이터를 불러오는 중 오류가 발생했습니다.';
        if (axios.isAxiosError(err)) {
          const axiosErr = err as AxiosError<ApiResponse<unknown>>;
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

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Header />
        <div className='container mx-auto px-4 py-12 max-w-6xl space-y-4'>
          <div className='h-20 bg-gray-200 animate-pulse rounded-xl' />
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {[0, 1, 2].map((i) => <div key={i} className='h-28 bg-gray-200 animate-pulse rounded-xl' />)}
          </div>
          <div className='h-56 bg-gray-200 animate-pulse rounded-xl' />
          <div className='h-72 bg-gray-200 animate-pulse rounded-xl' />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Header />
        <div className='container mx-auto px-4 py-24 text-center max-w-md'>
          <div className='inline-flex items-center justify-center size-16 bg-red-50 rounded-full mb-4'>
            <AlertCircle className='size-8 text-red-500' />
          </div>
          <h2 className='text-xl font-bold text-gray-900 mb-2'>데이터 로드 실패</h2>
          <p className='text-gray-500 mb-8'>{error || '데이터를 불러올 수 없습니다.'}</p>
          <button
            onClick={() => navigate('/')}
            className='inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors'
          >
            <ArrowLeft className='size-4' />
            처음으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const { placeName, keywords = [], seo, feedback } = data;

  const bestKeyword = keywords
    .filter((kw) => kw.rankNo !== null)
    .sort((a, b) => (a.rankNo ?? 999) - (b.rankNo ?? 999))[0];

  const opportunityKeywords = keywords.filter((kw) => kw.isOpportunity);
  const opportunityCount = opportunityKeywords.length;
  const totalSearchVolume = keywords.reduce((sum, kw) => sum + kw.monthlySearchVolume, 0);

  const allFeedbacks = feedback
    ? [
        ...feedback.seoFeedback.map((msg) => ({ msg, type: 'seo' as const })),
        ...feedback.reviewFeedback.map((msg) => ({ msg, type: 'review' as const })),
        ...feedback.competitorFeedback.map((msg) => ({ msg, type: 'competitor' as const })),
      ]
    : [];

  const feedbackMeta = {
    seo:        { label: '플레이스', bg: 'bg-amber-50 text-amber-700 border border-amber-100' },
    review:     { label: '리뷰',     bg: 'bg-blue-50 text-blue-700 border border-blue-100' },
    competitor: { label: '경쟁사',   bg: 'bg-purple-50 text-purple-700 border border-purple-100' },
  };

  const BASE_COUNT = 20;
  const PAGE_SIZE = 10;
  const visibleCount = BASE_COUNT + (showAllKeywords ? Math.ceil((keywords.length - BASE_COUNT) / PAGE_SIZE) * PAGE_SIZE : 0);
  const visibleKeywords = keywords.slice(0, Math.min(visibleCount, keywords.length));
  const hasMore = visibleKeywords.length < keywords.length;

  const chartData = keywords.slice(0, 8).map((kw) => ({
    keyword: kw.keyword,
    검색량: kw.monthlySearchVolume,
  }));

  const gradeColor = seo ? getGradeColor(seo.score) : null;

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />

      <div className='container mx-auto px-4 py-8 max-w-6xl'>

        {/* ── 페이지 헤더 ───────────────────────────────────── */}
        <div className='mb-6'>
          <p className='text-xs text-gray-400 uppercase tracking-widest mb-1'>분석 결과</p>
          <h1 className='text-3xl font-bold text-gray-900'>{placeName}</h1>
        </div>

        {/* ── SEO 점수 카드 ─────────────────────────────────── */}
        {seo && gradeColor && (
          <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-5'>
            <div className='flex flex-col md:flex-row items-center md:items-stretch gap-8'>
              {/* 게이지 */}
              <div className='flex-shrink-0 flex flex-col items-center justify-center'>
                <h2 className='text-xl font-bold text-gray-900 mb-4 text-center'>플레이스 관리 점수</h2>
                <ScoreGauge score={seo.score} grade={seo.grade} />
              </div>

              {/* 세부 점수 */}
              <div className='flex-1 flex flex-col justify-center gap-5 md:border-l border-gray-100 md:pl-8'>
                <div>
                  <div className='flex items-center gap-2 mb-2'>
                    <div className='size-2 rounded-full bg-green-500' />
                    <span className='text-sm font-semibold text-gray-700'>매장 정보 완성도</span>
                    <span className='ml-auto text-base font-bold text-gray-900'>{seo.placeCompleteness}<span className='text-sm font-normal text-gray-400'> / 40</span></span>
                  </div>
                  <div className='w-full h-2.5 bg-gray-100 rounded-full overflow-hidden'>
                    <div
                      className='h-2.5 rounded-full bg-green-500 transition-all duration-700'
                      style={{ width: `${Math.round((seo.placeCompleteness / 40) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className='flex items-center gap-2 mb-2'>
                    <div className='size-2 rounded-full bg-blue-500' />
                    <span className='text-sm font-semibold text-gray-700'>리뷰 품질</span>
                    <span className='ml-auto text-base font-bold text-gray-900'>{seo.reviewQuality}<span className='text-sm font-normal text-gray-400'> / 60</span></span>
                  </div>
                  <div className='w-full h-2.5 bg-gray-100 rounded-full overflow-hidden'>
                    <div
                      className='h-2.5 rounded-full bg-blue-500 transition-all duration-700'
                      style={{ width: `${Math.round((seo.reviewQuality / 60) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 요약 지표 3개 */}
              <div className='flex-shrink-0 grid grid-cols-3 md:grid-cols-1 gap-3 md:w-48'>
                {[
                  {
                    label: '최고 순위',
                    value: bestKeyword ? `${bestKeyword.rankNo}위` : '—',
                    sub: bestKeyword?.keyword ?? '데이터 없음',
                    icon: <TrendingUp className='size-4' />,
                    color: 'text-green-600',
                  },
                  {
                    label: '추천 키워드',
                    value: `${keywords.length}개`,
                    sub: `성장 키워드 ${opportunityCount}개`,
                    icon: <Search className='size-4' />,
                    color: 'text-blue-600',
                  },
                  {
                    label: '월간 검색량',
                    value: totalSearchVolume >= 1000 ? `${(totalSearchVolume / 1000).toFixed(0)}k` : totalSearchVolume.toLocaleString(),
                    sub: '추천 키워드 합산',
                    icon: <BarChart2 className='size-4' />,
                    color: 'text-purple-600',
                  },
                ].map((item) => (
                  <div key={item.label} className='bg-gray-50 rounded-xl p-3.5'>
                    <div className={`flex items-center gap-1.5 text-xs font-semibold mb-1.5 ${item.color}`}>
                      {item.icon}
                      {item.label}
                    </div>
                    <div className='text-xl font-bold text-gray-900 leading-tight'>{item.value}</div>
                    <div className='text-xs text-gray-400 truncate mt-0.5'>{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 개선 방안 ─────────────────────────────────────── */}
        {feedback && allFeedbacks.length > 0 && (
          <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-5'>
            <div className='flex items-center gap-2 mb-1'>
              <Lightbulb className='size-5 text-amber-500' />
              <h2 className='text-lg font-bold text-gray-900'>플레이스 개선 방안</h2>
            </div>
            <p className='text-sm text-gray-400 mb-5'>{feedback.summary}</p>

            <div className='space-y-2.5'>
              {allFeedbacks.map((item, i) => (
                <div key={i} className='flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100'>
                  <span className={`text-xs px-2 py-0.5 rounded-md font-semibold flex-shrink-0 mt-0.5 ${feedbackMeta[item.type].bg}`}>
                    {feedbackMeta[item.type].label}
                  </span>
                  <p className='text-sm text-gray-700 leading-relaxed'>{item.msg}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 성장 키워드 배너 ─────────────────────────────── */}
        {opportunityCount > 0 && (
          <div className='bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-5 mb-5 text-white'>
            <div className='flex items-start gap-3'>
              <div className='bg-white/20 rounded-xl p-2 flex-shrink-0'>
                <Zap className='size-5 text-white' />
              </div>
              <div>
                <p className='text-xs font-semibold text-green-100 uppercase tracking-wider mb-0.5'>지금 바로 공략하세요</p>
                <p className='text-base font-bold'>
                  <span className='text-yellow-300'>성장 키워드 {opportunityCount}개</span>를 발견했습니다
                </p>
                <p className='text-sm text-green-100 mt-1'>
                  이미 검색 결과에 노출되고 있지만 순위가 아직 낮은 키워드입니다. 소개글과 리뷰 답변에 자연스럽게 녹이면 단기간에 상위 노출 가능성이 높아집니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── 키워드 테이블 + 차트 ──────────────────────────── */}
        <div className='bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-5'>
          <div className='grid grid-cols-1 lg:grid-cols-[3fr_2fr]'>

            {/* 키워드 테이블 */}
            <div className='lg:border-r border-gray-100'>
              {/* 헤더 */}
              <div className='px-5 py-4 border-b border-gray-100 bg-white'>
                <div className='flex items-center gap-2 mb-2'>
                  <Star className='size-4 text-green-500' />
                  <span className='text-lg font-bold text-gray-900'>추천 키워드</span>
                  <span className='text-sm text-gray-500 ml-1'>({keywords.length}개)</span>
                </div>
                <div className='flex items-center gap-3 flex-wrap'>
                  {[
                    { color: 'bg-red-100 text-red-600', label: '높음', desc: '경쟁자가 많아 올리기 어려움' },
                    { color: 'bg-amber-100 text-amber-600', label: '중간', desc: '노력 대비 성과를 기대할 수 있음' },
                    { color: 'bg-green-100 text-green-600', label: '낮음', desc: '지금 당장 공략하면 빠르게 상위 노출 가능' },
                  ].map((item) => (
                    <div key={item.label} className='flex items-center gap-1.5'>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${item.color}`}>{item.label}</span>
                      <span className='text-xs text-gray-400'>{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 컬럼명 */}
              <div className='flex items-center px-5 py-3 border-b border-gray-100 bg-white'>
                <span className='w-8 text-xs font-bold text-gray-800 text-center flex-shrink-0'>순위</span>
                <div className='w-px h-4 bg-green-200 mx-2 flex-shrink-0' />
                <span className='flex-1 text-xs font-bold text-gray-800'>키워드</span>
                <span className='w-20 text-xs font-bold text-gray-800 text-right flex-shrink-0'>월간 검색량</span>
                <div className='w-px h-4 bg-green-200 ml-4 mr-1 flex-shrink-0' />
                <span className='w-16 text-xs font-bold text-gray-800 text-center flex-shrink-0'>경쟁 강도</span>
              </div>

              {/* 행 목록 */}
              <div>
                {visibleKeywords.map((kw, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 px-5 py-3.5 border-b transition-colors ${
                      kw.isOpportunity
                        ? 'bg-green-50 border-green-100 hover:bg-green-100'
                        : 'bg-gray-50/70 border-gray-100 hover:bg-gray-100'
                    }`}
                  >
                    <div className='w-8 flex-shrink-0 flex items-center justify-center'>
                      <span className={`size-6 flex items-center justify-center rounded-full text-xs font-bold ${
                        kw.isOpportunity
                          ? 'bg-green-200 text-green-800'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {index + 1}
                      </span>
                    </div>
                    <span className='flex-1 text-sm font-bold text-gray-900 truncate'>
                      {kw.keyword}
                    </span>
                    <span className='w-20 text-sm font-medium text-gray-400 text-right flex-shrink-0'>
                      {kw.monthlySearchVolume > 0 ? kw.monthlySearchVolume.toLocaleString() : '—'}
                    </span>
                    <div className='w-16 flex justify-center flex-shrink-0'>
                      <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${getCompetitionBadge(kw.competitionLevel)}`}>
                        {kw.competitionLevel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 더보기 버튼 */}
              {(hasMore || showAllKeywords) && (
                <div className='px-5 py-3'>
                  <button
                    onClick={() => setShowAllKeywords((v) => !v)}
                    className='w-full flex items-center justify-center gap-1.5 py-2.5 text-sm rounded-lg text-gray-500 hover:bg-gray-50 border border-gray-100 transition-colors'
                  >
                    {showAllKeywords ? <ChevronUp className='size-4' /> : <ChevronDown className='size-4' />}
                    {showAllKeywords ? '접기' : `키워드 더보기 (${keywords.length - visibleKeywords.length}개 더)`}
                  </button>
                </div>
              )}
            </div>

            {/* 차트 */}
            <div className='p-6 flex flex-col'>
              <div className='flex items-center gap-2 mb-1'>
                <BarChart2 className='size-4 text-gray-400' />
                <h2 className='text-lg font-bold text-gray-900'>키워드 검색량 비교</h2>
              </div>
              <p className='text-xs text-gray-400 mb-5'>
                검색량이 높을수록 잠재 방문자가 많습니다. 경쟁 강도가 <span className='text-green-600 font-semibold'>낮음</span>이면서 검색량이 높은 키워드를 우선 공략하세요.
              </p>
              <div className='flex-1'>
                <ResponsiveContainer width='100%' height={280}>
                  <BarChart data={chartData} layout='vertical' margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray='3 3' horizontal={false} stroke='#f3f4f6' />
                    <XAxis
                      type='number'
                      tick={{ fontSize: 10, fill: '#9ca3af' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
                    />
                    <YAxis
                      type='category'
                      dataKey='keyword'
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                      width={70}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                    <Bar dataKey='검색량' radius={[0, 4, 4, 0]} maxBarSize={16}>
                      {chartData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={i === 0 ? '#16a34a' : i < 3 ? '#4ade80' : '#bbf7d0'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                {/* 범례 — 차트 바로 아래 */}
                <div className='flex items-center gap-4 mt-3'>
                  {[
                    { color: '#16a34a', label: '1위' },
                    { color: '#4ade80', label: '2–3위' },
                    { color: '#bbf7d0', label: '4위 이하' },
                  ].map((item) => (
                    <div key={item.label} className='flex items-center gap-1.5'>
                      <div className='size-2.5 rounded-sm' style={{ background: item.color }} />
                      <span className='text-xs text-gray-400'>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 방문자 키워드 요약 (맨 아래) ─────────────────── */}
        {feedback?.placeSummary && Object.keys(feedback.placeSummary).length > 0 && (
          <div className='bg-white border border-gray-100 rounded-2xl shadow-sm p-6'>
            <div className='flex items-center gap-2 mb-2'>
              <Users className='size-5 text-gray-500' />
              <h2 className='text-lg font-bold text-gray-900'>방문자 키워드 요약</h2>
            </div>
            <div className='flex items-start gap-2 mb-5'>
              <Sparkles className='size-4 text-green-500 flex-shrink-0 mt-0.5' />
              <p className='text-sm font-medium text-green-600'>
                이 키워드들을 플레이스 소개글과 리뷰 답변에 자연스럽게 녹여내면, 고객이 검색하는 바로 그 단어로 매장이 노출됩니다. 콘텐츠를 수정할 때 아래 카테고리별 핵심 단어를 우선적으로 활용하세요.
              </p>
            </div>
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4'>
              {Object.entries(feedback.placeSummary).map(([category, kws]) => {
                const displayCategory = category === '미분류' ? '기타' : category;
                return (
                  <div key={category} className='bg-gray-50 border border-gray-100 rounded-xl p-4'>
                    <div className='text-xs font-bold text-gray-600 mb-3 uppercase tracking-wide'>{displayCategory}</div>
                    <div className='flex flex-wrap gap-1.5'>
                      {(kws as string[]).map((kw) => (
                        <span key={kw} className='text-xs px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-600'>
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}