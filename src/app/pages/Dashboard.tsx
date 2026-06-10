import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../components/Header';
import {
  Search, Link as LinkIcon, AlertCircle, BarChart2, TrendingUp,
  Star, Zap, Shield, ChevronRight, ArrowRight, Sparkles,
  MapPin, Target, Crown,
} from 'lucide-react';
import { analysisApi } from '../api/analysis';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '../api/type';

const PLACEHOLDER_URLS = [
  'https://place.naver.com/restaurant/12345678',
  'https://place.naver.com/cafe/87654321',
  'https://place.naver.com/hairshop/11223344',
  'https://place.naver.com/beauty/55667788',
];

const FEATURES = [
  {
    icon: <Shield className='size-6' />,
    color: '#35B557',
    bg: '#EFFAF2',
    title: '플레이스 관리 점수',
    desc: '매장 정보 완성도와 리뷰 품질을 종합해 100점 만점의 SEO 건강도를 측정합니다.',
  },
  {
    icon: <Crown className='size-6' />,
    color: '#4F7DF3',
    bg: '#EFF6FF',
    title: '추천 키워드 순위',
    desc: '월간 검색량과 경쟁 강도를 분석해 지금 당장 공략 가능한 키워드를 순위로 제공합니다.',
  },
  {
    icon: <Zap className='size-6' />,
    color: '#F59E0B',
    bg: '#FFFBEB',
    title: '성장 키워드 발견',
    desc: '이미 노출되고 있지만 순위가 낮은 키워드를 찾아 빠른 상위 노출 기회를 알려드립니다.',
  },
  {
    icon: <Target className='size-6' />,
    color: '#7C5CFF',
    bg: '#F5F3FF',
    title: '방문자 키워드 분석',
    desc: '실제 방문자들이 남긴 리뷰에서 핵심 키워드를 카테고리별로 추출합니다.',
  },
  {
    icon: <Sparkles className='size-6' />,
    color: '#EF4444',
    bg: '#FEF2F2',
    title: '플레이스 개선 방안',
    desc: '플레이스 구성, 리뷰 관리, 경쟁사 비교를 바탕으로 구체적인 액션 플랜을 제시합니다.',
  },
  {
    icon: <BarChart2 className='size-6' />,
    color: '#238B3B',
    bg: '#EFFAF2',
    title: '검색량 비교 차트',
    desc: '추천 키워드의 월간 검색량을 시각화해 어떤 키워드에 집중해야 할지 한눈에 파악합니다.',
  },
];

const STEPS = [
  { num: '01', icon: <LinkIcon className='size-5' />, title: 'URL 입력', desc: '분석하고 싶은 매장의\n네이버 플레이스 URL을 입력하세요.', gradient: 'linear-gradient(135deg, #4DC971, #35B557)' },
  { num: '02', icon: <Search className='size-5' />, title: '데이터 분석', desc: '리뷰, 키워드, 매장 정보를\n자동으로 수집하고 분석합니다.', gradient: 'linear-gradient(135deg, #238B3B, #35B557)' },
  { num: '03', icon: <TrendingUp className='size-5' />, title: '결과 확인', desc: '추천 키워드 순위부터 플레이스 개선 방안까지, PlaceUp의 피드백을 확인해보세요!', gradient: 'linear-gradient(135deg, #35B557, #4DC971)' },
];

export function Dashboard() {
  const navigate = useNavigate();
  const [placeUrl, setPlaceUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDER_URLS.length);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!placeUrl.trim()) {
      setError('플레이스 URL을 입력해주세요.');
      return;
    }
    try {
      setIsLoading(true);
      const result = await analysisApi.triggerAnalysis(placeUrl.trim());
      const { naverPlaceId, placeName, analyzing } = result.data;
      if (analyzing) {
        navigate(`/analysis/${naverPlaceId}`, { state: { placeName, placeUrl: placeUrl.trim() } });
      } else {
        navigate(`/result/${naverPlaceId}`);
      }
    } catch (error) {
      const errMsg = '분석 요청 중 오류가 발생했습니다. 다시 시도해주세요.';
      if (axios.isAxiosError(error)) {
        const axiosErr = error as AxiosError<ApiResponse<unknown>>;
        setError(axiosErr.response?.data?.message || errMsg);
      } else {
        setError(errMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen' style={{ background: '#F8FAFC' }}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(53,181,87,0.4); }
          70% { box-shadow: 0 0 0 12px rgba(53,181,87,0); }
          100% { box-shadow: 0 0 0 0 rgba(53,181,87,0); }
        }
        @keyframes glow-idle {
          0%, 100% { box-shadow: 0 0 24px 4px rgba(53,181,87,0.25), 0 20px 60px rgba(0,0,0,0.2); }
          50% { box-shadow: 0 0 40px 8px rgba(77,201,113,0.4), 0 20px 60px rgba(0,0,0,0.2); }
        }
        .search-bar-glow { animation: glow-idle 5s ease-in-out infinite; }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .badge-float { animation: float 3s ease-in-out infinite; }
        .badge-float-slow { animation: float 4s ease-in-out infinite 0.8s; }
        .btn-pulse:not(:disabled) { animation: pulse-ring 2s infinite; }
        .shimmer-text {
          background: linear-gradient(90deg, #238B3B 0%, #35B557 40%, #86EFAC 60%, #35B557 80%, #238B3B 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .feature-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(15,23,42,0.12); }
        .fade-up { animation: fade-up 0.5s ease both; }
      `}</style>

      <Header />

      {/* ── 히어로 섹션 ───────────────────────────────── */}
      <section
        className='relative overflow-hidden'
        style={{
          background: 'linear-gradient(135deg, #0D4F23 0%, #1A7D3A 40%, #35B557 80%, #4DC971 100%)',
          minHeight: 480,
        }}
      >
        {/* 배경 장식 원 */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute rounded-full opacity-10' style={{ width: 600, height: 600, background: 'white', top: -200, right: -100 }} />
          <div className='absolute rounded-full opacity-10' style={{ width: 300, height: 300, background: 'white', bottom: -100, left: -50 }} />
          <div className='absolute rounded-full opacity-5' style={{ width: 200, height: 200, background: 'white', top: 100, left: '30%' }} />
        </div>

        {/* 플로팅 뱃지들 */}
        <div
          className='badge-float absolute hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold'
          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.25)', color: 'white', top: 80, right: '12%' }}
        >
          <Star className='size-4' style={{ color: '#FDE68A' }} />
          플레이스 점수 분석
        </div>
        <div
          className='badge-float-slow absolute hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold'
          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.25)', color: 'white', top: 180, right: '8%' }}
        >
          <MapPin className='size-4' style={{ color: '#86EFAC' }} />
          키워드 순위 파악
        </div>
        <div
          className='badge-float absolute hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold'
          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.25)', color: 'white', bottom: 250, left: '6%', animationDelay: '1.4s' }}
        >
          <TrendingUp className='size-4' style={{ color: '#FDE68A' }} />
          성장 키워드 추천
        </div>

        <div className='container mx-auto px-6 py-20 max-w-4xl relative'>
          {/* 메인 헤드라인 */}
          <h1 className='text-center font-extrabold mb-4 text-white' style={{ fontSize: 'clamp(32px, 5vw, 54px)', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            네이버 플레이스<br />
            <span className='shimmer-text'>검색 노출</span>을 높이세요
          </h1>
          <p className='text-center mb-10' style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, lineHeight: 1.6 }}>
            URL 하나로 네이버 플레이스 검색을 최적화해주는, <span style={{ color: '#86EFAC', fontWeight: 800 }}>PlaceUp</span>
          </p>

          {/* 검색 폼 */}
          <form onSubmit={handleSubmit} className='max-w-2xl mx-auto'>
            <div
              className={`flex gap-0 rounded-2xl overflow-hidden transition-all duration-200 ${isFocused ? '' : 'search-bar-glow'}`}
              style={{
                background: 'white',
                boxShadow: isFocused
                  ? '0 0 0 4px rgba(53,181,87,0.6), 0 0 48px 8px rgba(77,201,113,0.5), 0 20px 60px rgba(0,0,0,0.2)'
                  : undefined,
              }}
            >
              <div className='flex items-center flex-1 px-5'>
                <LinkIcon className='size-5 flex-shrink-0 mr-3' style={{ color: '#9CA3AF' }} />
                <input
                  type='text'
                  value={placeUrl}
                  onChange={(e) => setPlaceUrl(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={PLACEHOLDER_URLS[placeholderIdx]}
                  className='flex-1 py-4 bg-transparent outline-none text-sm'
                  style={{ color: '#111827' }}
                  disabled={isLoading}
                />
              </div>
              <button
                type='submit'
                disabled={isLoading}
                className='btn-pulse flex items-center gap-2 px-7 py-4 font-bold text-white text-sm transition-all flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed'
                style={{ background: '#35B557' }}
              >
                {isLoading ? (
                  <>
                    <div className='size-4 border-2 border-white/40 border-t-white rounded-full animate-spin' />
                    분석 중…
                  </>
                ) : (
                  <>
                    <Search className='size-4' />
                    분석 시작
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className='mt-3 flex items-center gap-2 text-sm px-2' style={{ color: '#FCA5A5' }}>
                <AlertCircle className='size-4 flex-shrink-0' />
                {error}
              </div>
            )}
            <p className='mt-2 text-xs px-6' style={{ color: 'rgba(255,255,255,0.5)' }}>
              예시: https://place.naver.com/restaurant/123456789
            </p>
          </form>
        </div>

        {/* 하단 웨이브 */}
        <div className='absolute bottom-0 left-0 right-0'>
          <svg viewBox='0 0 1440 60' fill='none' xmlns='http://www.w3.org/2000/svg' style={{ display: 'block' }}>
            <path d='M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 28C840 36 960 42 1080 40C1200 38 1320 28 1380 23L1440 18V60H0Z' fill='#F8FAFC' />
          </svg>
        </div>
      </section>

      {/* ── 분석하면 알 수 있는 것들 ──────────────────── */}
      <section className='container mx-auto px-6 py-16 max-w-6xl'>
        <div className='text-center mb-12'>
          <p className='text-xs font-bold uppercase tracking-widest mb-2' style={{ color: '#35B557' }}>What You Get</p>
          <h2 className='font-extrabold mb-3' style={{ fontSize: 32, color: '#111827' }}>
            분석 결과에서 확인할 수 있는 것들
          </h2>
          <p className='text-base' style={{ color: '#8A94A6' }}>
            한 번의 분석으로 매장 SEO의 모든 것을 파악하세요
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className='feature-card rounded-2xl p-6 cursor-default'
              style={{
                background: 'white',
                border: '1px solid #F3F4F6',
                boxShadow: '0 4px 16px rgba(15,23,42,0.06)',
              }}
            >
              <div
                className='size-12 rounded-2xl flex items-center justify-center mb-4'
                style={{ background: f.bg, color: f.color }}
              >
                {f.icon}
              </div>
              <h3 className='font-bold mb-2' style={{ fontSize: 16, color: '#111827' }}>{f.title}</h3>
              <p className='text-sm leading-relaxed' style={{ color: '#8A94A6' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 이용 방법 3단계 ────────────────────────────── */}
      <section style={{ background: 'white' }}>
        <div className='container mx-auto px-6 py-16 max-w-5xl'>
          <div className='text-center mb-12'>
            <p className='text-xs font-bold uppercase tracking-widest mb-2' style={{ color: '#35B557' }}>How It Works</p>
            <h2 className='font-extrabold' style={{ fontSize: 32, color: '#111827' }}>
              딱 3단계면 끝납니다
            </h2>
          </div>

          <div className='grid md:grid-cols-3 gap-8 relative'>
            {/* 연결선 */}
            <div
              className='hidden md:block absolute top-10 left-1/3 right-1/3 h-px'
              style={{ background: 'linear-gradient(90deg, #CFEED6, #35B557, #CFEED6)' }}
            />

            {STEPS.map((s, i) => (
              <div key={i} className='flex flex-col items-center text-center'>
                <div
                  className='size-20 rounded-full flex items-center justify-center mb-5 relative z-10'
                  style={{
                    background: s.gradient,
                    border: 'none',
                    boxShadow: '0 8px 24px rgba(53,181,87,0.35)',
                    color: 'white',
                  }}
                >
                  {s.icon}
                </div>
                <span className='text-xs font-bold mb-2' style={{ color: '#35B557', letterSpacing: '0.1em' }}>{s.num}</span>
                <h3 className='font-bold mb-2' style={{ fontSize: 18, color: '#111827' }}>{s.title}</h3>
                <p className='text-sm leading-relaxed whitespace-pre-line' style={{ color: '#8A94A6' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 하단 CTA ───────────────────────────────────── */}
      <section
        className='relative overflow-hidden'
        style={{ background: 'linear-gradient(135deg, #0D4F23 0%, #35B557 100%)' }}
      >
        <div className='absolute inset-0 pointer-events-none overflow-hidden'>
          <div className='absolute rounded-full opacity-10' style={{ width: 400, height: 400, background: 'white', top: -150, right: -100 }} />
        </div>
        <div className='container mx-auto px-6 py-16 max-w-3xl relative text-center'>
          <h2 className='font-extrabold text-white mb-4' style={{ fontSize: 32 }}>
            지금 바로 내 매장을 분석해보세요
          </h2>
          <p className='mb-8' style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16 }}>
            URL 하나로 시작하는 네이버 플레이스 검색 최적화
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className='inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base transition-all hover:scale-105'
            style={{ background: 'white', color: '#238B3B', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
          >
            분석 시작하기
            <ArrowRight className='size-5' />
          </button>
        </div>
      </section>
    </div>
  );
}