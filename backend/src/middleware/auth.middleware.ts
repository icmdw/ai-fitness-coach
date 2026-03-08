/**
 * JWT 认证中间件
 * 验证请求中的 JWT 令牌
 */

import { FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      userId: number;
      username: string;
    };
  }
}

/**
 * 认证中间件
 * 验证 JWT 令牌并附加用户信息到请求对象
 */
export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
  } catch (error) {
    reply.code(401).send({
      success: false,
      error: {
        code: 'TOKEN_INVALID',
        message: '认证令牌无效或已过期',
      },
    });
  }
}

/**
 * 可选认证中间件
 * 如果提供令牌则验证，不提供也允许访问
 */
export async function optionalAuthMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
  } catch (error) {
    // 忽略错误，继续执行
  }
}

export default authMiddleware;
