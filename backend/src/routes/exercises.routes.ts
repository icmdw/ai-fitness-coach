/**
 * 动作库路由
 */

import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import ExerciseController from '../controllers/exercises.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export async function exerciseRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions
) {
  const controller = new ExerciseController();

  // 获取动作列表（无需认证）
  server.get('/', controller.list.bind(controller));

  // 获取动作详情（无需认证）
  server.get('/:id', controller.getById.bind(controller));

  // 创建动作（需要认证）
  server.post(
    '/',
    { preHandler: [authMiddleware] },
    controller.create.bind(controller)
  );

  // 更新动作（需要认证）
  server.put(
    '/:id',
    { preHandler: [authMiddleware] },
    controller.update.bind(controller)
  );

  // 删除动作（需要认证）
  server.delete(
    '/:id',
    { preHandler: [authMiddleware] },
    controller.delete.bind(controller)
  );
}

export default exerciseRoutes;
