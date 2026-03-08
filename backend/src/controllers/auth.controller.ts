/**
 * 认证控制器
 * 处理认证相关的 HTTP 请求
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import AuthService from '../services/auth.service';

interface RegisterBody {
  username: string;
  email?: string;
  password: string;
}

interface LoginBody {
  username: string;
  password: string;
}

export class AuthController {
  private authService: AuthService;

  constructor(server: FastifyInstance) {
    this.authService = new AuthService(server);
  }

  /**
   * 用户注册
   * POST /api/v1/auth/register
   */
  async register(
    request: FastifyRequest<{ Body: RegisterBody }>,
    reply: FastifyReply
  ) {
    try {
      const { username, email, password } = request.body;

      // 验证输入
      if (!username || username.length < 3 || username.length > 20) {
        return reply.code(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '用户名长度为 3-20 个字符',
          },
        });
      }

      if (!password || password.length < 8) {
        return reply.code(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '密码长度至少 8 个字符',
          },
        });
      }

      const user = await this.authService.register({ username, email, password });

      return reply.code(201).send({
        success: true,
        data: user,
        message: '注册成功',
      });
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: {
          code: 'REGISTRATION_ERROR',
          message: error.message,
        },
      });
    }
  }

  /**
   * 用户登录
   * POST /api/v1/auth/login
   */
  async login(
    request: FastifyRequest<{ Body: LoginBody }>,
    reply: FastifyReply
  ) {
    try {
      const { username, password } = request.body;

      if (!username || !password) {
        return reply.code(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '用户名和密码不能为空',
          },
        });
      }

      const result = await this.authService.login({ username, password });

      return reply.code(200).send({
        success: true,
        data: {
          userId: result.user.id,
          username: result.user.username,
          token: result.token,
          expiresIn: 86400, // 24 小时
        },
        message: '登录成功',
      });
    } catch (error: any) {
      return reply.code(401).send({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: error.message,
        },
      });
    }
  }

  /**
   * 获取当前用户信息
   * GET /api/v1/auth/me
   */
  async getMe(
    request: FastifyRequest<{ user: { userId: number } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user.userId;

      const user = await this.authService.getMe(userId);

      return reply.code(200).send({
        success: true,
        data: user,
      });
    } catch (error: any) {
      return reply.code(404).send({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: error.message,
        },
      });
    }
  }
}

export default AuthController;
