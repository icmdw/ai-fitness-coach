import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { config } from 'dotenv';

config();

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

// 注册插件
fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
});

fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
});

// 健康检查
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// API 路由
fastify.register(async (app) => {
  // 认证路由
  app.post('/api/v1/auth/register', async (request, reply) => {
    // TODO: 实现注册逻辑
    reply.send({ message: 'Register endpoint' });
  });

  app.post('/api/v1/auth/login', async (request, reply) => {
    // TODO: 实现登录逻辑
    reply.send({ message: 'Login endpoint' });
  });

  app.get('/api/v1/auth/me', {
    preHandler: [async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.code(401).send({ error: 'Unauthorized' });
      }
    }]
  }, async (request, reply) => {
    const user = request.user;
    reply.send({ user });
  });

  // 训练记录路由
  app.get('/api/v1/training-logs', {
    preHandler: [async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.code(401).send({ error: 'Unauthorized' });
      }
    }]
  }, async (request, reply) => {
    reply.send({ message: 'Get training logs' });
  });

  app.post('/api/v1/training-logs', {
    preHandler: [async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.code(401).send({ error: 'Unauthorized' });
      }
    }]
  }, async (request, reply) => {
    reply.send({ message: 'Create training log' });
  });

  // 身体数据路由
  app.get('/api/v1/body-metrics', {
    preHandler: [async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.code(401).send({ error: 'Unauthorized' });
      }
    }]
  }, async (request, reply) => {
    reply.send({ message: 'Get body metrics' });
  });

  // 饮食记录路由
  app.get('/api/v1/food-logs', {
    preHandler: [async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.code(401).send({ error: 'Unauthorized' });
      }
    }]
  }, async (request, reply) => {
    reply.send({ message: 'Get food logs' });
  });

  // 动作库路由
  app.get('/api/v1/exercises', async (request, reply) => {
    reply.send({ message: 'Get exercises' });
  });

  // 统计路由
  app.get('/api/v1/statistics/training', {
    preHandler: [async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.code(401).send({ error: 'Unauthorized' });
      }
    }]
  }, async (request, reply) => {
    reply.send({ message: 'Get training statistics' });
  });
}, { prefix: '/' });

// 启动服务器
const start = async () => {
  try {
    await fastify.listen({
      port: parseInt(process.env.PORT || '3000'),
      host: '0.0.0.0',
    });
    console.log(`🚀 Server running at http://localhost:${process.env.PORT || '3000'}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
