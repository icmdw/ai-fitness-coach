import apiClient from './api';
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types';

export const authService = {
  // 用户注册
  async register(data: RegisterRequest) {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data.data;
  },

  // 用户登录
  async login(data: LoginRequest) {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data.data;
  },

  // 获取当前用户
  async getCurrentUser() {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  // 登出
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  // 保存认证信息
  saveAuth(auth: AuthResponse) {
    localStorage.setItem('accessToken', auth.accessToken);
    localStorage.setItem('refreshToken', auth.refreshToken);
  },
};
