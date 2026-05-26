import { useNavigate, useLocation } from 'react-router';
import { Search, Home, TrendingUp } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: '분석 시작', icon: Home },
  // { path: "/keyword-ranking",   label: "키워드 순위", icon: TrendingUp },
];

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className='bg-white border-b border-gray-200'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* 로고 */}
          <div className='flex items-center gap-2 cursor-pointer' onClick={() => navigate('/')}>
            <Search className='size-6 text-green-600' />
            <span className='text-xl font-bold text-gray-900'>PlaceUp</span>
          </div>

          {/* 네비게이션 */}
          <nav className='flex items-center gap-2'>
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                    isActive
                      ? 'bg-green-50 text-green-600 font-medium'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className='size-4' />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
