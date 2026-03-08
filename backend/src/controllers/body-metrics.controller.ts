/**
 * 身体数据控制器
 * 处理身体数据相关的 HTTP 请求
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import BodyMetricService from '../services/body-metrics.service';

interface CreateBodyMetricBody {
  date: string;
  weightKg?: number;
  bodyFatPercent?: number;
  muscleMassKg?: number;
  chestCm?: number;
  waistCm?: number;
  hipCm?: number;
  armCm?: number;
  thighCm?: number;
  notes?: string;
}

interface UpdateBodyMetricBody {
  weightKg?: number;
  bodyFatPercent?: number;
  muscleMassKg?: number;
  chestCm?: number;
  waistCm?: number;
  hipCm?: number;
  armCm?: number;
  thighCm?: number;
  notes?: string;
}

export class BodyMetricController {
  private bodyMetricService: BodyMetricService;

  constructor() {
    this.bodyMetricService = new BodyMetricService();
  }

  /**
   * 获取身体数据列表
   * GET /api/v1/body-metrics
   */
  async list(
    request: FastifyRequest<{
      user: { userId: number };
      query: {
        startDate?: string;
        endDate?: string;
        page?: string;
        pageSize?: string;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user.userId;
      const { startDate, endDate, page, pageSize } = request.query;

      const result = await this.bodyMetricService.findByUser(userId, {
        startDate,
        endDate,
        page: page ? parseInt(page, 10) : 1,
        pageSize: pageSize ? parseInt(pageSize, 10) : 20,
      });

      return reply.code(200).send({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  }

  /**
   * 获取身体数据详情
   * GET /api/v1/body-metrics/:id
   */
  async getById(
    request: FastifyRequest<{
      user: { userId: number };
      params: { id: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user.userId;
      const id = parseInt(request.params.id, 10);

      const metric = await this.bodyMetricService.findById(id, userId);

      if (!metric) {
        return reply.code(404).send({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: '身体数据记录不存在',
          },
        });
      }

      return reply.code(200).send({
        success: true,
        data: metric,
      });
    } catch (error: any) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  }

  /**
   * 创建身体数据记录
   * POST /api/v1/body-metrics
   */
  async create(
    request: FastifyRequest<{
      user: { userId: number };
      body: CreateBodyMetricBody;
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user.userId;
      const { date, ...metricData } = request.body;

      if (!date) {
        return reply.code(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '测量日期不能为空',
          },
        });
      }

      const metric = await this.bodyMetricService.create({
        userId,
        date,
        ...metricData,
      });

      return reply.code(201).send({
        success: true,
        data: {
          id: metric.id,
          date: metric.date,
          weightKg: metric.weightKg,
          createdAt: metric.createdAt,
        },
        message: '身体数据记录成功',
      });
    } catch (error: any) {
      return reply.code(500).send({
        success: false,
        error: {
          code: 'CREATION_ERROR',
          message: error.message,
        },
      });
    }
  }

  /**
   * 更新身体数据记录
   * PUT /api/v1/body-metrics/:id
   */
  async update(
    request: FastifyRequest<{
      user: { userId: number };
      params: { id: string };
      body: UpdateBodyMetricBody;
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user.userId;
      const id = parseInt(request.params.id, 10);

      const updated = await this.bodyMetricService.update(id, userId, request.body);

      return reply.code(200).send({
        success: true,
        message: '身体数据更新成功',
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return reply.code(404).send({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: '身体数据记录不存在',
          },
        });
      }

      return reply.code(500).send({
        success: false,
        error: {
          code: 'UPDATE_ERROR',
          message: error.message,
        },
      });
    }
  }

  /**
   * 删除身体数据记录
   * DELETE /api/v1/body-metrics/:id
   */
  async delete(
    request: FastifyRequest<{
      user: { userId: number };
      params: { id: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user.userId;
      const id = parseInt(request.params.id, 10);

      await this.bodyMetricService.delete(id, userId);

      return reply.code(200).send({
        success: true,
        message: '身体数据记录已删除',
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return reply.code(404).send({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: '身体数据记录不存在',
          },
        });
      }

      return reply.code(500).send({
        success: false,
        error: {
          code: 'DELETE_ERROR',
          message: error.message,
        },
      });
    }
  }
}

export default BodyMetricController;
