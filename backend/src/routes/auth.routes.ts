/**
 * 认证路由
 */

import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import AuthController from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export async function authRoutes(
  server: FastifyInstance,
  options: FastifyPluginOptions
) {
  const authController = new AuthController(server);

  // 用户注册
  server.post(
    '/register',
    {
      schema: {
        body: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string', minLength: 3, maxLength: 20 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
          },
        },
      },
    },
    authController.register.bind(authController)
  );

  // 用户登录
  server.post(
    '/login',
    {
      schema: {
        body: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
          },
        },
      },
    },
    authController.login.bind(authController)
  );

  // 获取当前用户信息（需要认证）
  server.get(
    '/me',
    {
      preHandler: [authMiddleware],
    },
    authController.getMe.bind(authController)
  );
}

export default authRoutes;
