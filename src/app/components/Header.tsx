import { useNavigate, useLocation } from "react-router";
import { Search, Home, User, TrendingUp, LogOut } from "lucide-react";
import { mockUser } from "../data/mockData";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/");
  };

  const navItems = [
    { path: "/dashboard", label: "대시보드", icon: Home },
    { path: "/keyword-ranking", label: "키워드 순위", icon: TrendingUp },
    { path: "/mypage", label: "마이페이지", icon: User },
  ];

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <Search className="size-6 text-green-600" />
            <span className="text-xl font-bold text-gray-900">PlaceRank</span>
          </div>

          {/* 네비게이션 */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-green-50 text-green-600 font-medium"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* 사용자 정보 */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <div className="size-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-700 font-medium">
                  {mockUser.name.charAt(0)}
                </span>
              </div>
              <span className="text-sm font-medium">{mockUser.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <LogOut className="size-4" />
              <span className="hidden md:inline">로그아웃</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
