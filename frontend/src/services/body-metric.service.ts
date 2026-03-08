import apiClient from './api';
import type { BodyMetric } from '@/types';

export const bodyMetricService = {
  // 获取身体数据列表
  async getAll(params?: { page?: number; limit?: number }) {
    const response = await apiClient.get('/body-metrics', { params });
    return response.data;
  },

  // 获取单个身体数据
  async getById(id: string) {
    const response = await apiClient.get(`/body-metrics/${id}`);
    return response.data;
  },

  // 创建身体数据
  async create(data: Omit<BodyMetric, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    const response = await apiClient.post('/body-metrics', data);
    return response.data;
  },

  // 更新身体数据
  async update(id: string, data: Partial<BodyMetric>) {
    const response = await apiClient.put(`/body-metrics/${id}`, data);
    return response.data;
  },

  // 删除身体数据
  async delete(id: string) {
    const response = await apiClient.delete(`/body-metrics/${id}`);
    return response.data;
  },

  // 获取趋势数据
  async getTrend(params?: { days?: number }) {
    const response = await apiClient.get('/body-metrics/trend', { params });
    return response.data;
  },
};
