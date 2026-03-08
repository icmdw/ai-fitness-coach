/**
 * 训练记录路由
 */

import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import TrainingLogController from '../controllers/training-logs.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export async function trainingLogRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions
) {
  const controller = new TrainingLogController();

  // 所有路由都需要认证
  server.addHook('preHandler', authMiddleware);

  // 获取训练记录列表
  server.get('/', controller.list.bind(controller));

  // 获取训练记录详情
  server.get('/:id', controller.getById.bind(controller));

  // 创建训练记录
  server.post('/', controller.create.bind(controller));

  // 更新训练记录
  server.put('/:id', controller.update.bind(controller));

  // 删除训练记录
  server.delete('/:id', controller.delete.bind(controller));
}

export default trainingLogRoutes;
