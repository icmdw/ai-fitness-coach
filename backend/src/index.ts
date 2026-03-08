/**
 * AI Fitness Coach - Backend API Server
 * 
 * @author Bob
 * @version 1.0.0
 */

import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import apiRoutes from './routes';

// 加载环境变量
dotenv.config();

const buildServer = async (): Promise<FastifyInstance> => {
  const server = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    },
  });

  // 注册 CORS 插件
  await server.register(cors, {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-domain.com'] 
      : true,
    credentials: true,
  });

  // 注册 JWT 插件
  await server.register(jwt, {
    secret: process.env.JWT_SECRET || 'default-secret-change-me',
    sign: {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    },
  });

  // 健康检查端点
  server.get('/health', async (request, reply) => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  });

  // API 版本端点
  server.get('/api/v1', async (request, reply) => {
    return {
      name: 'AI Fitness Coach API',
      version: 'v1',
      documentation: '/docs',
      endpoints: {
        auth: '/api/v1/auth',
        exercises: '/api/v1/exercises',
        trainingLogs: '/api/v1/training-logs',
        bodyMetrics: '/api/v1/body-metrics',
        foodLogs: '/api/v1/food-logs',
        statistics: '/api/v1/statistics',
        ai: '/api/v1/ai',
      },
    };
  });

  // 注册 API v1 路由
  server.register(apiRoutes, { prefix: '/api/v1' });

  // 404 处理
  server.setNotFoundHandler((request, reply) => {
    reply.code(404).send({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Route ${request.method}:${request.url} not found`,
      },
    });
  });

  // 全局错误处理
  server.setErrorHandler((error, request, reply) => {
    server.log.error(error);
    
    reply.code(error.statusCode || 500).send({
      success: false,
      error: {
        code: error.name || 'INTERNAL_ERROR',
        message: error.message || 'Internal server error',
      },
    });
  });

  return server;
};

const start = async () => {
  const server = await buildServer();

  const port = parseInt(process.env.PORT || '3000', 10);
  const host = process.env.HOST || '0.0.0.0';

  try {
    await server.listen({ port, host });
    console.log(`🚀 Server is running on http://${host}:${port}`);
    console.log(`📊 Health check: http://${host}:${port}/health`);
    console.log(`📚 API docs: http://${host}:${port}/api/v1`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();

export { buildServer };
