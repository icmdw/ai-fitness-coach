import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { MainLayout } from '@/components/layout/MainLayout';
import { TrainingLogList } from '@/pages/TrainingLogList';
import { TrainingLogForm } from '@/pages/TrainingLogForm';
import { BodyMetricsList } from '@/pages/BodyMetricsList';
import { BodyMetricsForm } from '@/pages/BodyMetricsForm';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Plus } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function HomePage() {
  const { user } = useAuthStore();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">欢迎回来，{user?.name}！</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          开始训练
        </Button>
      </div>
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
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">最近训练</h2>
        <p className="text-gray-500 text-sm">暂无数据</p>
      </div>
    </div>
  );
}

function TrainingPage() {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">新增训练记录</h1>
          <Button variant="secondary" onClick={() => setShowForm(false)}>
            返回列表
          </Button>
        </div>
        <TrainingLogForm
          onSubmit={(data) => {
            console.log('Submit:', data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">训练记录</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          新增记录
        </Button>
      </div>
      <TrainingLogList />
    </div>
  );
}

function BodyMetricsPage() {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">新增身体数据</h1>
          <Button variant="secondary" onClick={() => setShowForm(false)}>
            返回列表
          </Button>
        </div>
        <BodyMetricsForm
          onSubmit={(data) => {
            console.log('Submit:', data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">身体数据</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          新增记录
        </Button>
      </div>
      <BodyMetricsList />
    </div>
  );
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
