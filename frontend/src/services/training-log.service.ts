import apiClient from './api';
import type { TrainingLog, TrainingType } from '@/types';

export const trainingLogService = {
  // 获取训练记录列表
  async getAll(params?: { page?: number; limit?: number; type?: TrainingType }) {
    const response = await apiClient.get('/training-logs', { params });
    return response.data;
  },

  // 获取单个训练记录
  async getById(id: string) {
    const response = await apiClient.get(`/training-logs/${id}`);
    return response.data;
  },

  // 创建训练记录
  async create(data: Omit<TrainingLog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    const response = await apiClient.post('/training-logs', data);
    return response.data;
  },

  // 更新训练记录
  async update(id: string, data: Partial<TrainingLog>) {
    const response = await apiClient.put(`/training-logs/${id}`, data);
    return response.data;
  },

  // 删除训练记录
  async delete(id: string) {
    const response = await apiClient.delete(`/training-logs/${id}`);
    return response.data;
  },
};
