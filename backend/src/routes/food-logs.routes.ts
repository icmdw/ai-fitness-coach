/**
 * 饮食记录路由
 */

import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import FoodLogController from '../controllers/food-logs.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export async function foodLogRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions
) {
  const controller = new FoodLogController();

  // 所有路由都需要认证
  server.addHook('preHandler', authMiddleware);

  // 获取饮食记录列表
  server.get('/', controller.list.bind(controller));

  // 获取每日营养汇总
  server.get('/daily-summary/:date', controller.dailySummary.bind(controller));

  // 获取饮食记录详情
  server.get('/:id', controller.getById.bind(controller));

  // 创建饮食记录
  server.post('/', controller.create.bind(controller));

  // 批量创建饮食记录
  server.post('/batch', controller.batchCreate.bind(controller));

  // 更新饮食记录
  server.put('/:id', controller.update.bind(controller));

  // 删除饮食记录
  server.delete('/:id', controller.delete.bind(controller));
}

export default foodLogRoutes;
