/**
 * 身体数据路由
 */

import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import BodyMetricController from '../controllers/body-metrics.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export async function bodyMetricRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions
) {
  const controller = new BodyMetricController();

  // 所有路由都需要认证
  server.addHook('preHandler', authMiddleware);

  // 获取身体数据列表
  server.get('/', controller.list.bind(controller));

  // 获取身体数据详情
  server.get('/:id', controller.getById.bind(controller));

  // 创建身体数据记录
  server.post('/', controller.create.bind(controller));

  // 更新身体数据记录
  server.put('/:id', controller.update.bind(controller));

  // 删除身体数据记录
  server.delete('/:id', controller.delete.bind(controller));
}

export default bodyMetricRoutes;
