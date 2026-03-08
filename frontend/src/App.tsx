import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { MainLayout } from '@/components/layout/MainLayout';

// 页面组件（占位，后续实现）
function HomePage() {
  const { user } = useAuthStore();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">欢迎回来，{user?.name}！</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">本周训练</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">3 次</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">当前体重</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">75.5 kg</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">连续天数</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">12 天</p>
        </div>
      </div>
    </div>
  );
}

function TrainingPage() {
  return <div className="text-2xl font-bold">训练记录页面（开发中）</div>;
}

function BodyMetricsPage() {
  return <div className="text-2xl font-bold">身体数据页面（开发中）</div>;
}

function StatisticsPage() {
  return <div className="text-2xl font-bold">数据统计页面（开发中）</div>;
}

function AICoachPage() {
  return <div className="text-2xl font-bold">AI 助手页面（开发中）</div>;
}

function LoginPage() {
  return <div className="text-2xl font-bold">登录页面（开发中）</div>;
}

function RegisterPage() {
  return <div className="text-2xl font-bold">注册页面（开发中）</div>;
}

// 认证守卫
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/training"
            element={
              <ProtectedRoute>
                <TrainingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/body-metrics"
            element={
              <ProtectedRoute>
                <BodyMetricsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/statistics"
            element={
              <ProtectedRoute>
                <StatisticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-coach"
            element={
              <ProtectedRoute>
                <AICoachPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
