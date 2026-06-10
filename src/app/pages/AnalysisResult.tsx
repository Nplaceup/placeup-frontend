import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import {
  AlertCircle, TrendingUp, Search, Lightbulb, Users,
  ChevronDown, ChevronUp, ArrowLeft, BarChart2,
  Sparkles, Crown, Medal, Trophy,
  MapPin, Star, Target,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import axios, { AxiosError } from 'axios';
import { analysisApi } from '../api/analysis';
import { AnalysisResponse, ApiResponse } from '../api/type';

/* ─────────────── 색상 토큰 ─────────────── */
const C = {
  primary:   '#35B557',
  dark:      '#238B3B',
  lightBg:   '#EFFAF2',
  border:    '#CFEED6',
  textMain:  '#111827',
  textSub:   '#8A94A6',
  warning:   '#F59E0B',
  danger:    '#EF4444',
  blue:      '#4F7DF3',
  purple:    '#7C5CFF',
};

function getGradeColor(score: number) {
  if (score >= 80) return { ring: C.primary, bg: C.lightBg, text: C.dark, label: 'bg-green-100 text-green-700' };
  if (score >= 60) return { ring: C.blue,    bg: '#EFF6FF', text: C.blue,  label: 'bg-blue-100 text-blue-700' };
  if (score >= 40) return { ring: C.warning, bg: '#FFFBEB', text: '#92400E', label: 'bg-amber-100 text-amber-700' };
  return              { ring: C.danger,  bg: '#FEF2F2', text: '#991B1B', label: 'bg-red-100 text-red-700' };
}

function CompetitionBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    '높음': 'bg-red-100 text-red-600',
    '중간': 'bg-amber-100 text-amber-700',
    '낮음': 'bg-green-100 text-green-700',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${styles[level] ?? styles['낮음']}`}>
      {level}
    </span>
  );
}

function RankBadge({ rank, isOpportunity }: { rank: number; isOpportunity: boolean }) {
  if (rank === 1) return (
    <div className='size-7 flex items-center justify-center rounded-full' style={{ background: '#FEF3C7' }}>
      <Crown className='size-3.5' style={{ color: '#D97706' }} />
    </div>
  );
  if (rank === 2) return (
    <div className='size-7 flex items-center justify-center rounded-full bg-gray-100'>
      <Medal className='size-3.5 text-gray-500' />
    </div>
  );
  if (rank === 3) return (
    <div className='size-7 flex items-center justify-center rounded-full' style={{ background: '#FEE8D6' }}>
      <Trophy className='size-3.5' style={{ color: '#C2410C' }} />
    </div>
  );
  return (
    <div
      className='size-7 flex items-center justify-center rounded-full text-xs font-bold'
      style={isOpportunity
        ? { background: '#BBF7D0', color: '#14532D' }
        : { background: '#F3F4F6', color: '#6B7280' }}
    >
      {rank}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className='bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg'>
      <p className='font-semibold mb-0.5'>{label}</p>
      <p style={{ color: '#86EFAC' }}>{payload[0].value.toLocaleString()}회 / 월</p>
    </div>
  );
};

function ScoreGauge({ score, grade }: { score: number; grade: string }) {
  const gradeColor = getGradeColor(score);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className='flex flex-col items-center'>
      <div className='relative' style={{ width: 148, height: 148 }}>
        <svg width='148' height='148' style={{ transform: 'rotate(-90deg)' }}>
          <circle cx='74' cy='74' r={radius} fill='none' stroke='#E5E7EB' strokeWidth='10' />
          <circle
            cx='74' cy='74' r={radius} fill='none'
            stroke={gradeColor.ring} strokeWidth='10'
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap='round'
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className='absolute inset-0 flex flex-col items-center justify-center'>
          <span className='font-extrabold' style={{ fontSize: 38, color: C.textMain, lineHeight: 1 }}>{score}</span>
          <span className='text-xs mt-1' style={{ color: C.textSub }}>/ 100점</span>
        </div>
      </div>
      <span className={`mt-3 text-sm font-bold px-4 py-1 rounded-full ${gradeColor.label}`}>
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
      <div className='min-h-screen' style={{ background: '#F8FAFC' }}>
        <Header />
        <div className='container mx-auto px-6 py-10 max-w-6xl space-y-5'>
          <div className='h-12 w-48 bg-gray-200 animate-pulse rounded-xl' />
          <div className='h-56 bg-gray-200 animate-pulse rounded-2xl' />
          <div className='grid grid-cols-2 gap-5'>
            <div className='h-80 bg-gray-200 animate-pulse rounded-2xl' />
            <div className='h-80 bg-gray-200 animate-pulse rounded-2xl' />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className='min-h-screen' style={{ background: '#F8FAFC' }}>
        <Header />
        <div className='container mx-auto px-6 py-24 text-center max-w-md'>
          <div className='inline-flex items-center justify-center size-16 bg-red-50 rounded-full mb-4'>
            <AlertCircle className='size-8 text-red-500' />
          </div>
          <h2 className='text-xl font-bold mb-2' style={{ color: C.textMain }}>데이터 로드 실패</h2>
          <p className='mb-8' style={{ color: C.textSub }}>{error || '데이터를 불러올 수 없습니다.'}</p>
          <button
            onClick={() => navigate('/')}
            className='inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-medium rounded-xl transition-colors'
            style={{ background: C.primary }}
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

  const opportunityCount = keywords.filter((kw) => kw.isOpportunity).length;
  const totalSearchVolume = keywords.reduce((sum, kw) => sum + kw.monthlySearchVolume, 0);

  const allFeedbacks = feedback
    ? [
        ...feedback.seoFeedback.map((msg) => ({ msg, type: 'seo' as const })),
        ...feedback.reviewFeedback.map((msg) => ({ msg, type: 'review' as const })),
        ...feedback.competitorFeedback.map((msg) => ({ msg, type: 'competitor' as const })),
      ]
    : [];

  const feedbackMeta = {
    seo:        { label: '플레이스', cls: 'bg-amber-100 text-amber-700',  icon: <MapPin className='size-4' />,  iconColor: '#D97706' },
    review:     { label: '리뷰',     cls: 'bg-blue-100 text-blue-700',    icon: <Star className='size-4' />,    iconColor: C.blue },
    competitor: { label: '경쟁사',   cls: 'bg-purple-100 text-purple-700', icon: <Target className='size-4' />, iconColor: C.purple },
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

  /* TIP 메시지 — SEO 피드백에서 첫 번째 항목 사용 */
  const tipText = feedback?.seoFeedback?.[0]
    ?? '소개글에 추천 키워드를 추가하고 방문자 리뷰 비율을 높이면 점수를 빠르게 올릴 수 있습니다.';

  /* 카테고리 색상 배정 */
  const categoryGradients = [
    'linear-gradient(135deg, #F0FDF4, #FFFFFF)',
    'linear-gradient(135deg, #F5F3FF, #FFFFFF)',
    'linear-gradient(135deg, #EFF6FF, #FFFFFF)',
    'linear-gradient(135deg, #FFF7ED, #FFFFFF)',
    'linear-gradient(135deg, #FDF4FF, #FFFFFF)',
    'linear-gradient(135deg, #F0FDFA, #FFFFFF)',
  ];

  return (
    <div className='min-h-screen' style={{ background: '#F8FAFC' }}>
      <Header storeName={placeName} />

      <div className='container mx-auto px-6 py-8 max-w-6xl'>

        {/* ── 페이지 헤더 ───────────────────────── */}
        <div className='flex items-end justify-between mb-6'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-widest mb-1' style={{ color: C.primary }}>분석 결과</p>
            <h1 style={{ fontSize: 34, fontWeight: 800, color: C.textMain, lineHeight: 1.2 }}>{placeName}</h1>
          </div>
          <button
            className='flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-medium transition-colors hover:bg-white'
            style={{ borderColor: C.border, color: C.textSub, background: 'white' }}
          >
            지난 30일
            <ChevronDown className='size-4' />
          </button>
        </div>

        {/* ── 히어로 점수 카드 ──────────────────── */}
        {seo && gradeColor && (
          <div
            className='rounded-3xl p-7 mb-5'
            style={{
              background: 'linear-gradient(135deg, #F2FBF4 0%, #FFFFFF 55%, #EAF8EE 100%)',
              border: `1px solid ${C.border}`,
              boxShadow: '0 12px 32px rgba(15,23,42,0.08)',
            }}
          >
            <div className='flex flex-col lg:flex-row items-start lg:items-stretch gap-8'>

              {/* 게이지 */}
              <div className='flex-shrink-0 flex flex-col items-center justify-center'>
                <p className='text-base font-bold mb-4' style={{ color: C.textMain }}>플레이스 관리 점수</p>
                <ScoreGauge score={seo.score} grade={seo.grade} />
              </div>

              {/* 진행 바 + TIP */}
              <div className='flex-1 flex flex-col justify-center gap-5 lg:border-l lg:pl-8' style={{ borderColor: C.border }}>
                <div>
                  <div className='flex items-center gap-2 mb-2'>
                    <div className='size-2 rounded-full' style={{ background: C.primary }} />
                    <span className='text-sm font-semibold' style={{ color: C.textMain }}>매장 정보 완성도</span>
                    <span className='ml-auto text-base font-bold' style={{ color: C.textMain }}>
                      {seo.placeCompleteness}
                      <span className='text-sm font-normal' style={{ color: C.textSub }}> / 40</span>
                    </span>
                  </div>
                  <div className='w-full h-2.5 rounded-full overflow-hidden' style={{ background: '#E5E7EB' }}>
                    <div
                      className='h-2.5 rounded-full transition-all duration-700'
                      style={{ width: `${Math.round((seo.placeCompleteness / 40) * 100)}%`, background: C.primary }}
                    />
                  </div>
                </div>

                <div>
                  <div className='flex items-center gap-2 mb-2'>
                    <div className='size-2 rounded-full' style={{ background: C.blue }} />
                    <span className='text-sm font-semibold' style={{ color: C.textMain }}>리뷰 품질</span>
                    <span className='ml-auto text-base font-bold' style={{ color: C.textMain }}>
                      {seo.reviewQuality}
                      <span className='text-sm font-normal' style={{ color: C.textSub }}> / 60</span>
                    </span>
                  </div>
                  <div className='w-full h-2.5 rounded-full overflow-hidden' style={{ background: '#E5E7EB' }}>
                    <div
                      className='h-2.5 rounded-full transition-all duration-700'
                      style={{ width: `${Math.round((seo.reviewQuality / 60) * 100)}%`, background: C.blue }}
                    />
                  </div>
                </div>

                {/* TIP 박스 */}
                <div
                  className='flex items-start gap-2.5 rounded-xl p-3.5 mt-1'
                  style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}
                >
                  <span className='text-sm font-bold flex-shrink-0' style={{ color: C.warning }}>TIP</span>
                  <p className='text-sm leading-relaxed' style={{ color: '#92400E' }}>{tipText}</p>
                </div>
              </div>

              {/* KPI 카드 3개 */}
              <div className='flex-shrink-0 grid grid-cols-3 lg:grid-cols-1 gap-3 lg:w-44'>
                {[
                  {
                    label: '최고 순위',
                    value: bestKeyword ? `${bestKeyword.rankNo}위` : '—',
                    sub: bestKeyword?.keyword ?? '데이터 없음',
                    icon: <TrendingUp className='size-4' />,
                    color: C.primary,
                    bg: C.lightBg,
                  },
                  {
                    label: '추천 키워드',
                    value: `${keywords.length}개`,
                    sub: `성장 키워드 ${opportunityCount}개`,
                    icon: <Search className='size-4' />,
                    color: C.blue,
                    bg: '#EFF6FF',
                  },
                  {
                    label: '월간 검색량',
                    value: totalSearchVolume >= 1000
                      ? `${(totalSearchVolume / 1000).toFixed(0)}k`
                      : totalSearchVolume.toLocaleString(),
                    sub: '추천 키워드 합산',
                    icon: <BarChart2 className='size-4' />,
                    color: C.purple,
                    bg: '#F5F3FF',
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className='rounded-2xl p-4'
                    style={{ background: '#FFFFFF', boxShadow: '0 8px 20px rgba(15,23,42,0.06)' }}
                  >
                    <div className='flex items-center gap-1.5 text-xs font-semibold mb-2' style={{ color: item.color }}>
                      {item.icon}
                      {item.label}
                    </div>
                    <div className='font-extrabold' style={{ fontSize: 28, color: C.textMain, lineHeight: 1.1 }}>
                      {item.value}
                    </div>
                    <div className='text-xs mt-1 truncate' style={{ color: C.textSub }}>{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 키워드 + 차트 ──────────────────────── */}
        <div
          className='rounded-3xl overflow-hidden mb-5'
          style={{ background: '#FFFFFF', border: '1px solid #F3F4F6', boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}
        >
          <div className='grid grid-cols-1 lg:grid-cols-[3fr_2fr]'>

            {/* 키워드 테이블 */}
            <div className='lg:border-r' style={{ borderColor: '#F3F4F6' }}>
              {/* 헤더 영역 */}
              <div className='px-6 py-5 border-b' style={{ borderColor: '#F3F4F6' }}>
                <div className='flex items-center gap-2 mb-3'>
                  <Sparkles className='size-5' style={{ color: C.primary }} />
                  <span style={{ fontSize: 20, fontWeight: 800, color: C.textMain }}>추천 키워드</span>
                  <span className='text-sm ml-1' style={{ color: C.textSub }}>({keywords.length}개)</span>
                </div>
                <div className='flex items-center gap-3 flex-wrap'>
                  {[
                    { cls: 'bg-red-100 text-red-600',    label: '높음', desc: '경쟁이 많아 올리기 어려움' },
                    { cls: 'bg-amber-100 text-amber-700', label: '중간', desc: '노력 대비 성과 기대 가능' },
                    { cls: 'bg-green-100 text-green-700', label: '낮음', desc: '빠른 상위 노출 가능' },
                  ].map((item) => (
                    <div key={item.label} className='flex items-center gap-1.5'>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.cls}`}>{item.label}</span>
                      <span className='text-xs' style={{ color: C.textSub }}>{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 컬럼명 */}
              <div className='flex items-center px-6 py-3 border-b' style={{ borderColor: '#F3F4F6', background: '#FAFAFA' }}>
                <span className='w-8 text-xs font-bold text-center flex-shrink-0' style={{ color: C.textMain }}>순위</span>
                <div className='w-px h-4 mx-3 flex-shrink-0' style={{ background: '#BBF7D0' }} />
                <span className='flex-1 text-xs font-bold' style={{ color: C.textMain }}>키워드</span>
                <span className='w-24 text-xs font-bold text-right flex-shrink-0' style={{ color: C.textMain }}>월간 검색량</span>
                <div className='w-px h-4 ml-3 mr-3 flex-shrink-0' style={{ background: '#BBF7D0' }} />
                <span className='w-16 text-xs font-bold text-center flex-shrink-0' style={{ color: C.textMain }}>검색 순위</span>
                <div className='w-px h-4 ml-3 mr-2 flex-shrink-0' style={{ background: '#BBF7D0' }} />
                <span className='w-16 text-xs font-bold text-center flex-shrink-0' style={{ color: C.textMain }}>경쟁 강도</span>
              </div>

              {/* 행 목록 */}
              <div>
                {visibleKeywords.map((kw, index) => {
                  const rank = index + 1;
                  return (
                    <div
                      key={index}
                      className='flex items-center gap-2 px-6 border-b transition-colors'
                      style={{
                        borderColor: '#D1FAE5',
                        background: '#F0FDF4',
                        paddingTop: 14,
                        paddingBottom: 14,
                        cursor: 'default',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.background = '#DCFCE7';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.background = '#F0FDF4';
                      }}
                    >
                      <div className='w-8 flex-shrink-0 flex items-center justify-center'>
                        <RankBadge rank={rank} isOpportunity={kw.isOpportunity} />
                      </div>
                      <span
                        className='flex-1 truncate'
                        style={{ fontSize: 17, fontWeight: 700, color: C.textMain }}
                      >
                        {kw.keyword}
                      </span>
                      <span className='w-24 text-sm font-medium text-right flex-shrink-0' style={{ color: C.textSub }}>
                        {kw.monthlySearchVolume > 0 ? kw.monthlySearchVolume.toLocaleString() : '—'}
                      </span>
                      <span className='w-16 text-sm font-semibold text-center flex-shrink-0' style={{ color: kw.rankNo !== null && kw.rankNo <= 3 ? C.primary : C.textSub }}>
                        {kw.rankNo !== null ? `${kw.rankNo}위` : '—'}
                      </span>
                      <div className='w-16 flex justify-center flex-shrink-0'>
                        <CompetitionBadge level={kw.competitionLevel} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 더보기 */}
              {(hasMore || showAllKeywords) && (
                <div className='px-6 py-4'>
                  <button
                    onClick={() => setShowAllKeywords((v) => !v)}
                    className='w-full flex items-center justify-center gap-1.5 py-3 text-sm rounded-xl border transition-colors hover:bg-gray-50'
                    style={{ borderColor: '#E5E7EB', color: C.textSub }}
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
                <BarChart2 className='size-4' style={{ color: C.textSub }} />
                <span style={{ fontSize: 20, fontWeight: 800, color: C.textMain }}>키워드 검색량 비교</span>
              </div>
              <p className='text-xs mb-5' style={{ color: C.textSub }}>
                경쟁 강도가 <span style={{ color: C.primary, fontWeight: 600 }}>낮음</span>이면서 검색량이 높은 키워드를 우선 공략하세요.
              </p>
              <div className='flex-1'>
                <ResponsiveContainer width='100%' height={300}>
                  <BarChart data={chartData} layout='vertical' margin={{ left: 0, right: 48, top: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray='3 3' horizontal={false} stroke='#F3F4F6' />
                    <XAxis
                      type='number'
                      tick={{ fontSize: 10, fill: '#9CA3AF' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
                    />
                    <YAxis
                      type='category'
                      dataKey='keyword'
                      tick={{ fontSize: 11, fill: '#6B7280' }}
                      axisLine={false}
                      tickLine={false}
                      width={72}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F9FAFB' }} />
                    <Bar dataKey='검색량' radius={[0, 6, 6, 0]} maxBarSize={16}>
                      <LabelList
                        dataKey='검색량'
                        position='right'
                        style={{ fontSize: 10, fill: '#9CA3AF' }}
                        formatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
                      />
                      {chartData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={i === 0 ? C.dark : i < 3 ? C.primary : '#86EFAC'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                <div className='flex items-center gap-4 mt-3'>
                  {[
                    { color: C.dark,    label: '1위' },
                    { color: C.primary, label: '2–3위' },
                    { color: '#86EFAC', label: '4위 이하' },
                  ].map((item) => (
                    <div key={item.label} className='flex items-center gap-1.5'>
                      <div className='size-2.5 rounded-sm' style={{ background: item.color }} />
                      <span className='text-xs' style={{ color: C.textSub }}>{item.label}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ── 방문자 키워드 + 개선 방안 (2열) ──── */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5'>

          {/* 방문자 키워드 요약 */}
          {feedback?.placeSummary && Object.keys(feedback.placeSummary).length > 0 && (
            <div
              className='rounded-3xl p-6'
              style={{ background: '#FFFFFF', border: '1px solid #F3F4F6', boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}
            >
              <div className='flex items-center gap-2 mb-2'>
                <Users className='size-5' style={{ color: C.textSub }} />
                <span style={{ fontSize: 20, fontWeight: 800, color: C.textMain }}>방문자 키워드 요약</span>
              </div>
              <div className='flex items-start gap-2 mb-5'>
                <Sparkles className='size-4 flex-shrink-0 mt-0.5' style={{ color: C.primary }} />
                <p className='text-sm leading-relaxed' style={{ color: C.textSub }}>
                  아래 카테고리별 키워드를 소개글과 리뷰 답변에 자연스럽게 활용하세요.
                </p>
              </div>
              <div className='grid grid-cols-2 gap-3'>
                {Object.entries(feedback.placeSummary).map(([category, kws], idx) => {
                  const displayCategory = category === '미분류' ? '기타' : category;
                  return (
                    <div
                      key={category}
                      className='rounded-2xl p-4'
                      style={{ background: categoryGradients[idx % categoryGradients.length], border: '1px solid #F3F4F6' }}
                    >
                      <div className='text-xs font-bold mb-3 uppercase tracking-wide' style={{ color: C.textMain }}>
                        {displayCategory} 키워드
                      </div>
                      <div className='flex flex-wrap gap-1.5'>
                        {(kws as string[]).map((kw) => (
                          <span
                            key={kw}
                            className='text-xs px-2.5 py-1 rounded-full'
                            style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#374151' }}
                          >
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

          {/* 개선 방안 */}
          {feedback && allFeedbacks.length > 0 && (
            <div
              className='rounded-3xl p-6'
              style={{ background: '#FFFFFF', border: '1px solid #F3F4F6', boxShadow: '0 8px 24px rgba(15,23,42,0.06)' }}
            >
              <div className='flex items-center gap-2 mb-1.5'>
                <Lightbulb className='size-5' style={{ color: C.warning }} />
                <span style={{ fontSize: 20, fontWeight: 800, color: C.textMain }}>플레이스 개선 방안</span>
              </div>
              <p className='text-sm mb-3' style={{ color: C.textSub }}>{feedback.summary}</p>
              <div className='space-y-2'>
                {allFeedbacks.map((item, i) => (
                  <div
                    key={i}
                    className='flex items-start gap-2.5 px-3 py-2.5 rounded-xl'
                    style={{ background: '#FAFAFA', border: '1px solid #F3F4F6' }}
                  >
                    <div
                      className='size-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5'
                      style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', color: feedbackMeta[item.type].iconColor }}
                    >
                      {feedbackMeta[item.type].icon}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${feedbackMeta[item.type].cls}`}>
                        {feedbackMeta[item.type].label}
                      </span>
                      <p className='text-sm leading-snug mt-1' style={{ color: '#374151' }}>{item.msg}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── 성장 키워드 배너 (맨 아래) ────────── */}
        {opportunityCount > 0 && (
          <div
            className='rounded-3xl p-6 text-white'
            style={{ background: `linear-gradient(135deg, ${C.dark} 0%, ${C.primary} 100%)` }}
          >
            <div className='flex items-center gap-4'>
              <div
                className='size-12 rounded-full flex items-center justify-center flex-shrink-0 font-extrabold'
                style={{ background: '#BBF7D0', color: '#14532D', fontSize: 16 }}
              >
                N위
              </div>
              <div className='flex-1'>
                <p className='text-xs font-bold uppercase tracking-wider mb-0.5' style={{ color: 'rgba(255,255,255,0.7)' }}>
                  지금 바로 공략하세요
                </p>
                <p className='text-lg font-bold'>
                  <span style={{ color: '#FDE68A' }}>성장 키워드 {opportunityCount}개</span>를 발견했습니다
                </p>
                <p className='text-sm mt-1' style={{ color: 'rgba(255,255,255,0.8)' }}>
                  이미 노출되고 있지만 순위가 낮은 키워드입니다. 소개글과 리뷰 답변에 자연스럽게 녹이면 단기간에 상위 노출 가능성이 높아집니다.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
