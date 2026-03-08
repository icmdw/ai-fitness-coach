/**
 * 数据统计路由
 */

import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import StatisticsController from '../controllers/statistics.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export async function statisticsRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions
) {
  const controller = new StatisticsController();

  // 所有路由都需要认证
  server.addHook('preHandler', authMiddleware);

  // 获取训练统计
  server.get('/training', controller.trainingStats.bind(controller));

  // 获取力量进步数据
  server.get(
    '/strength/:exerciseId',
    controller.strengthProgression.bind(controller)
  );

  // 获取身体数据趋势
  server.get('/body-metrics', controller.bodyMetricsTrend.bind(controller));

  // 获取营养统计
  server.get('/nutrition', controller.nutritionStats.bind(controller));
}

export default statisticsRoutes;
