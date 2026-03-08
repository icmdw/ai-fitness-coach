import { Link, useLocation } from 'react-router-dom';
import { Home, Dumbbell, Activity, TrendingUp, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/training', label: '训练', icon: Dumbbell },
  { path: '/statistics', label: '统计', icon: TrendingUp },
  { path: '/ai-coach', label: 'AI', icon: Activity },
  { path: '/settings', label: '设置', icon: Settings },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white md:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center space-y-1',
                isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
