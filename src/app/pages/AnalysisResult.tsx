import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import {
  Award,
  AlertCircle,
  CheckCircle2,
  Search,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  Minus,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

export function AnalysisResult() {
  const { placeId } = useParams();
  const navigate = useNavigate();
  // const [data, setData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!placeId) return;
    const id = Number(placeId);

    const load = async () => {
      try {
        setIsLoading(true);
        // 병렬 호출 — seo는 미구현일 수 있으므로 별도 처리
        // const [dashboard, keywords, rankings, reviews] = await Promise.all([
        // apiClient.getDashboard(id),
        // apiClient.getRecommendedKeywords(id),
        // apiClient.getPlaceRankings(id),
        // apiClient.getReviewAnalysis(id),
        // ]);
        // const seo = await apiClient.getSeoScore(id).catch(() => null);

        // setData({ dashboard, keywords, rankings, seo, reviews });
      } catch {
        // 백엔드 미연결 시 fallback 데이터 사용
        // setData({
        //   dashboard: fallbackDashboard,
        //   keywords: fallbackKeywords,
        //   rankings: fallbackRankings,
        //   seo: fallbackSeo,
        //   reviews: fallbackReviews,
        // });
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
        <div className='container mx-auto px-4 py-12 text-center'>
          <div className='animate-pulse space-y-4 max-w-2xl mx-auto'>
            <div className='h-8 bg-gray-200 rounded w-1/2 mx-auto' />
            <div className='h-4 bg-gray-200 rounded w-1/3 mx-auto' />
            <div className='grid md:grid-cols-3 gap-4 mt-8'>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className='h-28 bg-gray-200 rounded-xl' />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // if (error || !data) {
  //   return (
  //     <div className='min-h-screen bg-gray-50'>
  //       <Header />
  //       <div className='container mx-auto px-4 py-12 text-center'>
  //         <AlertCircle className='size-12 text-red-400 mx-auto mb-4' />
  //         <p className='text-gray-600'>{error || '데이터를 불러올 수 없습니다.'}</p>
  //       </div>
  //     </div>
  //   );
  // }

  // const { dashboard, keywords, rankings, seo, reviews } = data;

  // 추천 키워드 — 3가지 소스 합치기
  // const allKeywords = [
  //   ...keywords.recommended_keywords.location_industry,
  //   ...keywords.recommended_keywords.review_based,
  //   ...keywords.recommended_keywords.place_info_based,
  // ];

  // 레이더 차트 데이터
  // const radarData =
  //   seo?.breakdown.map((d) => ({
  //     category: d.category,
  //     score: d.score,
  //     maxScore: d.max_score,
  //   })) ?? [];

  // 키워드 검색량 바 차트
  // const keywordChartData = allKeywords.slice(0, 5).map((kw) => ({
  //   keyword: kw.keyword.split(' ').slice(-1)[0],
  //   검색량: kw.monthly_search,
  // }));

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />

      <div className='container mx-auto px-4 py-8'>
        {/* 매장 정보 헤더 */}
        <div className='bg-white rounded-xl shadow-lg p-6 mb-6'>
          <div className='flex items-start justify-between'>
            <div>
              {/* <h1 className='text-3xl font-bold text-gray-900 mb-2'>{dashboard.place_name}</h1>
              <p className='text-gray-600 mb-1'>{dashboard.category}</p>
              <p className='text-sm text-gray-500'>{dashboard.address}</p> */}
            </div>
            <div className='text-right flex flex-col items-end gap-3'>
              <div>
                <div className='text-sm text-gray-500 mb-1'>분석 기준일</div>
                {/* <div className='text-sm text-gray-600'>{dashboard.analysis_base_date}</div> */}
              </div>
              <button
                onClick={() => navigate(`/keyword-ranking/${placeId}`)}
                className='flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors'
              >
                <TrendingUp className='size-4' />
                키워드 검색 순위
              </button>
            </div>
          </div>
        </div>

        {/* 상단 숫자 카드 3개 */}
        <div className='grid md:grid-cols-3 gap-6 mb-6'>
          <div className='bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-green-100'>최고 키워드 순위</span>
              <TrendingUp className='size-6 text-green-100' />
            </div>
            <div className='text-4xl font-bold mb-1'>
              {/* {dashboard.best_rank ? `${dashboard.best_rank.rank_no}위` : '-'} */}
            </div>
            {/* <div className='text-green-100 text-sm truncate'>{dashboard.best_rank?.keyword ?? '순위 데이터 없음'}</div> */}
          </div>

          <div className='bg-white rounded-xl shadow-lg p-6'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-gray-600'>추천 키워드</span>
              <Search className='size-5 text-gray-400' />
            </div>
            {/* <div className='text-3xl font-bold text-gray-900 mb-1'>{dashboard.recommended_keyword_count}개</div> */}
            <div className='text-sm text-gray-500'>우선순위 분류됨</div>
          </div>

          <div className='bg-white rounded-xl shadow-lg p-6'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-gray-600'>월간 총 검색량</span>
              <MessageSquare className='size-5 text-gray-400' />
            </div>
            <div className='text-3xl font-bold text-gray-900 mb-1'>
              {/* {dashboard.total_monthly_search.toLocaleString()} */}
            </div>
            <div className='text-sm text-gray-500'>추천 키워드 합산</div>
          </div>
        </div>

        {/* 2열 레이아웃 */}
        <div className='grid lg:grid-cols-2 gap-6'>
          {/* 왼쪽 — 추천 키워드 */}
          <div className='space-y-6'>
            <div className='bg-white rounded-xl shadow-lg p-6'>
              <h2 className='text-xl font-bold text-gray-900 mb-4'>추천 키워드</h2>
              <div className='space-y-3'>
                {/* {allKeywords.map((kw, index) => (
                  <div
                    key={index}
                    className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
                  >
                    <div className='flex-shrink-0 size-8 bg-green-100 rounded-full flex items-center justify-center'>
                      <span className='text-green-700 font-semibold text-sm'>{index + 1}</span>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='font-medium text-gray-900 mb-1'>{kw.keyword}</div>
                      <div className='flex items-center gap-3 text-xs text-gray-500'>
                        <span>검색량: {kw.monthly_search.toLocaleString()}</span>
                        <span>•</span>
                        <span className='text-green-600'>SEO: {kw.seo_score}점</span>
                        {kw.my_rank && (
                          <>
                            <span>•</span>
                            <span>현재 {kw.my_rank}위</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))} */}
              </div>
            </div>

            {/* SEO 점수 상세 */}
            {/* {seo && (
              <div className='bg-white rounded-xl shadow-lg p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-xl font-bold text-gray-900'>SEO 점수 상세</h2>
                  <div className='flex items-center gap-2'>
                    <Award className='size-5 text-green-600' />
                    <span className='text-2xl font-bold text-green-600'>{seo.total_score}점</span>
                  </div>
                </div>
                <div className='space-y-4'>
                  {seo.breakdown.map((detail, index) => (
                    <div key={index}>
                      <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm font-medium text-gray-700'>{detail.category}</span>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm font-medium'>
                            {detail.score} / {detail.max_score}
                          </span>
                          {detail.grade === 'good' ? (
                            <CheckCircle2 className='size-4 text-green-600' />
                          ) : (
                            <AlertCircle
                              className={`size-4 ${detail.grade === 'warning' ? 'text-yellow-600' : 'text-red-600'}`}
                            />
                          )}
                        </div>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-2'>
                        <div
                          className={`h-2 rounded-full transition-all ${
                            detail.grade === 'good'
                              ? 'bg-green-600'
                              : detail.grade === 'warning'
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${(detail.score / detail.max_score) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </div>

          {/* 오른쪽 — 키워드 순위 + 차트 + 개선 방안 */}
          <div className='space-y-6'>
            {/* 키워드 검색 순위 */}
            <div className='bg-white rounded-xl shadow-lg p-6'>
              <h2 className='text-xl font-bold text-gray-900 mb-4'>키워드 검색 순위</h2>
              <div className='space-y-3'>
                {/* {rankings.keyword_rankings.map((kr, index) => (
                  <div key={index} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                    <div className='flex-1'>
                      <div className='font-medium text-gray-900 mb-1'>{kr.keyword_name}</div>
                      <div className='text-xs text-gray-500'>점수: {kr.total_score}</div>
                    </div>
                    <div className='flex items-center gap-3'>
                      {kr.rank_no_change !== null && kr.rank_no_change !== 0 && (
                        <div
                          className={`flex items-center gap-1 text-xs ${
                            kr.rank_no_change > 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {kr.rank_no_change > 0 ? <ArrowUp className='size-3' /> : <ArrowDown className='size-3' />}
                          <span>{Math.abs(kr.rank_no_change)}</span>
                        </div>
                      )}
                      {kr.rank_no_change === 0 && <Minus className='size-3 text-gray-400' />}
                      <div className='text-right'>
                        <div className='text-2xl font-bold text-gray-900'>{kr.rank_no}위</div>
                      </div>
                    </div>
                  </div>
                ))} */}
              </div>
            </div>

            {/* SEO 레이더 차트 */}
            {/* {radarData.length > 0 && (
              <div className='bg-white rounded-xl shadow-lg p-6'>
                <h2 className='text-xl font-bold text-gray-900 mb-4'>SEO 점수 시각화</h2>
                <ResponsiveContainer width='100%' height={250}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey='category' tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 25]} />
                    <Radar name='점수' dataKey='score' stroke='#16a34a' fill='#16a34a' fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )} */}

            {/* 개선 방안 */}
            {/* {seo && (
              <div className='bg-white rounded-xl shadow-lg p-6'>
                <h2 className='text-xl font-bold text-gray-900 mb-4'>개선 방안</h2>
                <div className='space-y-3'>
                  {seo.breakdown
                    .filter((d) => d.grade !== 'good')
                    .map((detail, index) => (
                      <div key={index} className='p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
                        <div className='flex items-start gap-3'>
                          <AlertCircle className='size-5 text-yellow-600 flex-shrink-0 mt-0.5' />
                          <div>
                            <h4 className='font-semibold text-gray-900 mb-1'>{detail.category}</h4>
                            <p className='text-sm text-gray-700'>{detail.feedback}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )} */}
          </div>
        </div>

        {/* 키워드 검색량 차트 */}
        <div className='bg-white rounded-xl shadow-lg p-6 mt-6'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>추천 키워드 검색량 비교</h2>
          {/* <ResponsiveContainer width='100%' height={300}> */}
          {/* <BarChart data={keywordChartData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='keyword' />
              <YAxis />
              <Tooltip />
              <Bar dataKey='검색량' fill='#16a34a' />
            </BarChart> */}
          {/* </ResponsiveContainer> */}
        </div>

        {/* 리뷰 분석 */}
        <div className='bg-white rounded-xl shadow-lg p-6 mt-6'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>리뷰 분석</h2>
          <div className='grid md:grid-cols-3 gap-6'>
            {/* 테마 */}
            <div>
              <h3 className='text-sm font-semibold text-gray-700 mb-3'>주요 테마</h3>
              <div className='space-y-2'>
                {/* {reviews.themes.map((t, i) => (
                  <div key={i} className='flex items-center justify-between p-2 bg-gray-50 rounded'>
                    <span className='text-sm text-gray-700'>{t.label}</span>
                    <span className='text-sm font-medium text-green-600'>{t.count.toLocaleString()}</span>
                  </div>
                ))} */}
              </div>
            </div>
            {/* 메뉴 언급 */}
            <div>
              <h3 className='text-sm font-semibold text-gray-700 mb-3'>메뉴 언급</h3>
              <div className='space-y-2'>
                {/* {reviews.menus.map((m, i) => (
                  <div key={i} className='flex items-center justify-between p-2 bg-gray-50 rounded'>
                    <span className='text-sm text-gray-700'>{m.label}</span>
                    <span className='text-sm font-medium text-green-600'>{m.count}</span>
                  </div>
                ))} */}
              </div>
            </div>
            {/* 투표 키워드 */}
            <div>
              <h3 className='text-sm font-semibold text-gray-700 mb-3'>방문자 투표</h3>
              <div className='space-y-2'>
                {/* {reviews.voted_keywords.map((v, i) => (
                  <div key={i} className='flex items-center justify-between p-2 bg-gray-50 rounded'>
                    <span className='text-sm text-gray-700'>{v.display_name}</span>
                    <span className='text-sm font-medium text-green-600'>{v.count.toLocaleString()}</span>
                  </div>
                ))} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
