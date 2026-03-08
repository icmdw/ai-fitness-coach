import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { MainLayout } from '@/components/layout/MainLayout';
import { TrainingLogList } from '@/pages/TrainingLogList';
import { TrainingLogForm } from '@/pages/TrainingLogForm';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Dumbbell, Activity, TrendingUp, Settings, Home, User, LogOut, Plus } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// 首页/仪表盘
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

// 训练记录页面
function TrainingPage() {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

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
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">身体数据</h1>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <p className="text-gray-500">身体数据页面开发中...</p>
      </div>
    </div>
  );
}

function StatisticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">数据统计</h1>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <p className="text-gray-500">数据可视化页面开发中...</p>
      </div>
    </div>
  );
}

function AICoachPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">AI 助手</h1>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <p className="text-gray-500">AI 助手页面开发中...</p>
      </div>
    </div>
  );
}

function LoginPage() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>登录</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="邮箱"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="密码"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">登录</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function RegisterPage() {
  const { register: registerUser } = useAuthStore();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser({ name, email, password });
      navigate('/');
    } catch (error) {
      console.error('Register failed:', error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>注册</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="邮箱"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="密码"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">注册</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
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
    <QueryClientProvider client={queryClient}>
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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
