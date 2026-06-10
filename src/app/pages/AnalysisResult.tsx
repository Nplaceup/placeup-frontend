import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { Award, AlertCircle, BarChart2, Search, Lightbulb, Users, ChevronDown } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import axios, { AxiosError } from 'axios';
import { analysisApi } from '../api/analysis';
import { AnalysisResponse } from '../api/type';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className='bg-foreground text-background text-xs px-3 py-2 rounded-lg'>
      <p className='font-bold mb-0.5'>{label}</p>
      <p className='text-[color:var(--chart-2)]'>{payload[0].value.toLocaleString()}회 / 월</p>
    </div>
  );
};

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
        const response = await analysisApi.getAnalysisStatus(Number(placeId));
        const result = response.data;
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

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background'>
        <Header />
        <div className='container mx-auto px-4 py-12 max-w-6xl'>
          <div className='animate-pulse space-y-4'>
            <div className='h-16 bg-muted rounded-lg' />
            <div className='grid grid-cols-3 gap-4'>
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className='h-24 bg-muted rounded-lg' />)}
            </div>
            <div className='h-64 bg-muted rounded-lg' />
            <div className='h-64 bg-muted rounded-lg' />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className='min-h-screen bg-background'>
        <Header />
        <div className='container mx-auto px-4 py-12 text-center'>
          <AlertCircle className='size-12 text-destructive mx-auto mb-4' />
          <p className='text-muted-foreground mb-6'>{error || '데이터를 불러올 수 없습니다.'}</p>
          <button
            onClick={() => navigate('/')}
            className='px-6 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity'
          >
            처음으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const { placeName, keywords = [], seo, feedback } = data;

  // ── 1. 플레이스 점수 ──────────────────────────────────────────
  const radarData = seo
    ? [
        { category: '매장 정보 완성도', score: seo.placeCompleteness, max: 40 },
        { category: '리뷰 품질', score: seo.reviewQuality, max: 60 },
      ]
    : [];

  // ── 2. 요약 카드 ──────────────────────────────────────────────
  const bestKeyword = keywords
    .filter((kw) => kw.rankNo !== null)
    .sort((a, b) => (a.rankNo ?? 999) - (b.rankNo ?? 999))[0];

  const opportunityCount = keywords.filter((kw) => kw.isOpportunity).length;
  const totalSearchVolume = keywords.reduce((sum, kw) => sum + kw.monthlySearchVolume, 0);

  // ── 3. 개선 방안 + 방문자 키워드 ─────────────────────────────
  const allFeedbacks = feedback
    ? [
        ...feedback.seoFeedback.map((msg) => ({ msg, type: 'seo' as const })),
        ...feedback.reviewFeedback.map((msg) => ({ msg, type: 'review' as const })),
        ...feedback.competitorFeedback.map((msg) => ({ msg, type: 'competitor' as const })),
      ]
    : [];

  const feedbackStyle: Record<string, { badge: string; label: string }> = {
    seo:        { badge: 'bg-[#FFF8E1] text-[#F57F17]',  label: '플레이스' },
    review:     { badge: 'bg-[#E3F2FD] text-[#1565C0]',  label: '리뷰' },
    competitor: { badge: 'bg-[#F3E5F5] text-[#6A1B9A]',  label: '경쟁사' },
  };

  // ── 4. 키워드 테이블 ──────────────────────────────────────────
  const BASE_COUNT = 20;
  const PAGE_SIZE = 10;
  const visibleCount = BASE_COUNT + (showAllKeywords ? Math.ceil((keywords.length - BASE_COUNT) / PAGE_SIZE) * PAGE_SIZE : 0);
  const visibleKeywords = keywords.slice(0, Math.min(visibleCount, keywords.length));
  const hasMore = visibleKeywords.length < keywords.length;

  const chartData = keywords.slice(0, 8).map((kw) => ({
    keyword: kw.keyword,
    검색량: kw.monthlySearchVolume,
  }));

  const competitionStyle: Record<string, string> = {
    '높음': 'bg-[#FDECEA] text-[#C62828]',
    '중간': 'bg-[#FFF8E1] text-[#F57F17]',
    '낮음': 'bg-accent text-accent-foreground',
  };

  return (
    <div className='min-h-screen bg-background'>
      <Header />

      <div className='container mx-auto px-4 py-8 max-w-6xl'>

        {/* 매장명 — 흰 배경 */}
        <div className='bg-background border border-border rounded-lg p-5 mb-4'>
          <h1 className='text-xl font-bold text-foreground'>{placeName}</h1>
        </div>

        {/* 플레이스 점수 — 매장명 바로 아래 */}
        {seo && (
          <div className='bg-primary border border-primary rounded-lg p-5 mb-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Award className='size-5 text-primary-foreground' />
                <span className='text-sm font-bold text-primary-foreground'>플레이스 점수</span>
                <span className='text-sm font-medium text-primary-foreground/70'>{seo.grade}</span>
              </div>
              <span className='text-3xl font-bold text-primary-foreground'>{seo.score}점</span>
            </div>
            <div className='w-full rounded-full h-1.5 mt-4 mb-4' style={{ background: 'rgba(255,255,255,0.25)' }}>
              <div className='h-1.5 rounded-full bg-primary-foreground transition-all' style={{ width: `${seo.score}%` }} />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              {radarData.map((item) => (
                <div key={item.category}>
                  <div className='flex justify-between text-xs mb-1'>
                    <span className='text-primary-foreground/70 font-medium'>{item.category}</span>
                    <span className='font-bold text-primary-foreground'>{item.score} <span className='font-normal text-primary-foreground/60'>/ {item.max}</span></span>
                  </div>
                  <div className='w-full rounded-full h-1' style={{ background: 'rgba(255,255,255,0.25)' }}>
                    <div
                      className='h-1 rounded-full bg-primary-foreground transition-all'
                      style={{ width: `${Math.round((item.score / item.max) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 요약 카드 3개 */}
        <div className='grid grid-cols-3 gap-4 mb-6'>
          {[
            {
              label: '최고 키워드 순위',
              value: bestKeyword ? `${bestKeyword.rankNo}위` : '—',
              sub: bestKeyword ? bestKeyword.keyword : '순위 데이터 없음',
              icon: <Search className='size-4 text-primary' />,
            },
            {
              label: '추천 키워드',
              value: `${keywords.length}개`,
              sub: `기회 키워드 ${opportunityCount}개 포함`,
              icon: <BarChart2 className='size-4 text-primary' />,
            },
            {
              label: '월간 총 검색량',
              value: totalSearchVolume.toLocaleString(),
              sub: '추천 키워드 합산',
              icon: <BarChart2 className='size-4 text-primary' />,
            },
          ].map((card) => (
            <div key={card.label} className='bg-card border border-border rounded-lg p-5'>
              <div className='flex items-center justify-between mb-3'>
                <span className='text-sm font-medium text-muted-foreground'>{card.label}</span>
                <div className='size-8 bg-accent rounded-lg flex items-center justify-center'>
                  {card.icon}
                </div>
              </div>
              <div className='text-2xl font-bold text-foreground mb-0.5'>{card.value}</div>
              <div className='text-xs text-muted-foreground truncate'>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* 개선 방안 */}
        {feedback && allFeedbacks.length > 0 && (
          <div className='bg-card border border-border rounded-lg p-6 mb-6'>
            <div className='flex items-center gap-2 mb-1'>
              <Lightbulb className='size-4' style={{ color: 'var(--chart-4)' }} />
              <h2 className='text-sm font-bold text-foreground'>개선 방안</h2>
            </div>
            <p className='text-xs text-muted-foreground mb-4'>{feedback.summary}</p>
            <div className='space-y-2.5'>
              {allFeedbacks.map((item, i) => (
                <div key={i} className='flex items-start gap-3 p-3.5 rounded-lg bg-background border border-border'>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 mt-0.5 ${feedbackStyle[item.type].badge}`}>
                    {feedbackStyle[item.type].label}
                  </span>
                  <p className='text-sm text-foreground leading-relaxed'>{item.msg}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 방문자 키워드 요약 */}
        {feedback?.placeSummary && Object.keys(feedback.placeSummary).length > 0 && (
          <div className='bg-card border border-border rounded-lg p-6 mb-6'>
            <div className='flex items-center gap-2 mb-4'>
              <Users className='size-4 text-muted-foreground' />
              <h2 className='text-sm font-bold text-foreground'>방문자 키워드 요약</h2>
            </div>
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
              {Object.entries(feedback.placeSummary).map(([category, kws]) => (
                <div key={category} className='bg-background border border-border rounded-lg p-4'>
                  <div className='text-xs font-medium text-muted-foreground mb-2.5'>{category}</div>
                  <div className='flex flex-wrap gap-1.5'>
                    {(kws as string[]).map((kw) => (
                      <span key={kw} className='text-xs px-2 py-1 rounded-full bg-card border border-border text-foreground'>
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 추천 키워드 + 검색량 차트 */}
        <div className='bg-card border border-border rounded-lg overflow-hidden mb-6'>
          <div className='grid grid-cols-[2fr_1fr]'>

            <div className='border-r border-border'>
              {/* 컬럼 헤더 */}
              <div className='flex items-center gap-3 px-6 py-3 border-b border-border bg-muted/50'>
                <span className='w-5 text-xs font-medium text-muted-foreground text-center flex-shrink-0'>순위</span>
                <span className='flex-1 text-xs font-medium text-muted-foreground'>키워드</span>
                <span className='w-20 text-xs font-medium text-muted-foreground text-right flex-shrink-0'>월간 검색량</span>
                <span className='w-20 text-xs font-medium text-muted-foreground text-center flex-shrink-0'>경쟁 강도</span>
                <span className='w-14 text-xs font-medium text-muted-foreground text-center flex-shrink-0'>유효성</span>
              </div>

              <div className='space-y-0 px-3 py-2'>
                {visibleKeywords.map((kw, index) => {
                  const isTop = index < 10;
                  return (
                    <div
                      key={index}
                      className='flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors'
                    >
                      <span className={`w-5 text-xs text-center flex-shrink-0 ${isTop ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'}`}>
                        {index + 1}
                      </span>
                      <span className={`flex-1 text-sm truncate ${isTop ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'}`}>
                        {kw.keyword}
                      </span>
                      <span className={`w-20 text-xs text-right flex-shrink-0 ${isTop ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                        {kw.monthlySearchVolume > 0 ? kw.monthlySearchVolume.toLocaleString() : '—'}
                      </span>
                      <div className='w-20 flex justify-center flex-shrink-0'>
                        <span className={`text-xs px-2 py-0.5 rounded-md font-medium text-center ${competitionStyle[kw.competitionLevel] ?? ''}`}>
                          {kw.competitionLevel}
                        </span>
                      </div>
                      <div className='w-14 flex justify-center flex-shrink-0'>
                        {kw.isOpportunity
                          ? <span className='text-xs px-1.5 py-0.5 rounded-md font-medium bg-accent text-accent-foreground'>유효</span>
                          : <span className='text-xs text-muted-foreground'>—</span>
                        }
                      </div>
                    </div>
                  );
                })}
              </div>

              {hasMore && (
                <div className='px-6 pb-4'>
                  <button
                    onClick={() => setShowAllKeywords((v) => !v)}
                    className='w-full flex items-center justify-center gap-1.5 py-2 text-xs rounded-lg text-muted-foreground hover:bg-muted transition-colors'
                  >
                    <ChevronDown className='size-3.5' />
                    10개 더 보기
                  </button>
                </div>
              )}
            </div>

            <div className='p-6'>
              <h2 className='text-sm font-bold text-foreground mb-4'>검색량 비교</h2>
              <ResponsiveContainer width='100%' height={280}>
                <BarChart data={chartData} layout='vertical' margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray='3 3' horizontal={false} stroke='var(--border)' />
                  <XAxis
                    type='number'
                    tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
                  />
                  <YAxis
                    type='category'
                    dataKey='keyword'
                    tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                    width={64}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)' }} />
                  <Bar dataKey='검색량' radius={[0, 4, 4, 0]} maxBarSize={18}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? 'var(--chart-1)' : i < 3 ? 'var(--chart-2)' : 'var(--chart-3)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}