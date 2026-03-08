import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from './ui/Button';
import { Dumbbell, LogOut, User } from 'lucide-react';

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Dumbbell className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-gray-900">AI Fitness Coach</span>
        </Link>

        {/* Navigation */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/training" className="text-sm font-medium text-gray-700 hover:text-primary">
              训练记录
            </Link>
            <Link to="/body-metrics" className="text-sm font-medium text-gray-700 hover:text-primary">
              身体数据
            </Link>
            <Link to="/statistics" className="text-sm font-medium text-gray-700 hover:text-primary">
              数据统计
            </Link>
            <Link to="/ai-coach" className="text-sm font-medium text-gray-700 hover:text-primary">
              AI 助手
            </Link>
          </nav>
        )}

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="flex items-center space-x-2 text-sm text-gray-700 hover:text-primary">
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">{user?.name}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                退出
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">登录</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">注册</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
