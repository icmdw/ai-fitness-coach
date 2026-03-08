/**
 * API 路由索引
 * 注册所有 API 路由
 */

import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { authRoutes } from './auth.routes';
import { trainingLogRoutes } from './training-logs.routes';
import { bodyMetricRoutes } from './body-metrics.routes';
import { foodLogRoutes } from './food-logs.routes';
import { exerciseRoutes } from './exercises.routes';
import { statisticsRoutes } from './statistics.routes';

export async function apiRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions
) {
  // 注册认证路由 /api/v1/auth/*
  server.register(authRoutes, { prefix: '/auth' });

  // 注册训练记录路由 /api/v1/training-logs/*
  server.register(trainingLogRoutes, { prefix: '/training-logs' });

  // 注册身体数据路由 /api/v1/body-metrics/*
  server.register(bodyMetricRoutes, { prefix: '/body-metrics' });

  // 注册饮食记录路由 /api/v1/food-logs/*
  server.register(foodLogRoutes, { prefix: '/food-logs' });

  // 注册动作库路由 /api/v1/exercises/*
  server.register(exerciseRoutes, { prefix: '/exercises' });

  // 注册统计路由 /api/v1/statistics/*
  server.register(statisticsRoutes, { prefix: '/statistics' });

  // TODO: 注册 AI 辅助路由
  // server.register(aiAssistantRoutes, { prefix: '/ai' });
}

export default apiRoutes;
