/**
 * 认证服务
 * 处理用户注册、登录、JWT 令牌管理
 */

import bcrypt from 'bcryptjs';
import { FastifyInstance } from 'fastify';
import prisma from '../utils/prisma';

interface RegisterInput {
  username: string;
  email?: string;
  password: string;
}

interface LoginInput {
  username: string;
  password: string;
}

export class AuthService {
  private server: FastifyInstance;

  constructor(server: FastifyInstance) {
    this.server = server;
  }

  /**
   * 用户注册
   */
  async register(data: RegisterInput) {
    const { username, email, password } = data;

    // 检查用户名是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new Error('用户名已存在');
    }

    // 检查邮箱是否已存在
    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingEmail) {
        throw new Error('邮箱已被使用');
      }
    }

    // 密码哈希
    const passwordHash = await bcrypt.hash(password, 12);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  }

  /**
   * 用户登录
   */
  async login(data: LoginInput) {
    const { username, password } = data;

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new Error('用户名或密码错误');
    }

    // 验证密码
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      throw new Error('用户名或密码错误');
    }

    // 生成 JWT 令牌
    const token = this.server.jwt.sign({
      userId: user.id,
      username: user.username,
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    };
  }

  /**
   * 获取当前用户信息
   */
  async getMe(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    return user;
  }
}

export default AuthService;
