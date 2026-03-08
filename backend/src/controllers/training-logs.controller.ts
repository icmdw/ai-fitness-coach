/**
 * 训练记录控制器
 * 处理训练记录相关的 HTTP 请求
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import TrainingLogService from '../services/training-logs.service';

interface CreateTrainingLogBody {
  date: string;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  notes?: string;
  rating?: number;
  sets: {
    exerciseId: number;
    setNumber: number;
    weightKg: number;
    reps: number;
    rpe?: number;
    restSeconds?: number;
    completed?: boolean;
    notes?: string;
  }[];
}

interface UpdateTrainingLogBody {
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  notes?: string;
  rating?: number;
  sets?: {
    exerciseId: number;
    setNumber: number;
    weightKg: number;
    reps: number;
    rpe?: number;
    restSeconds?: number;
    completed?: boolean;
    notes?: string;
  }[];
}

export class TrainingLogController {
  private trainingLogService: TrainingLogService;

  constructor() {
    this.trainingLogService = new TrainingLogService();
  }

  /**
   * 获取训练记录列表
   * GET /api/v1/training-logs
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

      const result = await this.trainingLogService.findByUser(userId, {
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
   * 获取训练记录详情
   * GET /api/v1/training-logs/:id
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

      const log = await this.trainingLogService.findById(id, userId);

      if (!log) {
        return reply.code(404).send({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: '训练记录不存在',
          },
        });
      }

      return reply.code(200).send({
        success: true,
        data: log,
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
   * 创建训练记录
   * POST /api/v1/training-logs
   */
  async create(
    request: FastifyRequest<{
      user: { userId: number };
      body: CreateTrainingLogBody;
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user.userId;
      const { date, startTime, endTime, durationMinutes, notes, rating, sets } = request.body;

      // 验证输入
      if (!date) {
        return reply.code(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '训练日期不能为空',
          },
        });
      }

      if (!sets || sets.length === 0) {
        return reply.code(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '至少需要一组训练数据',
          },
        });
      }

      const log = await this.trainingLogService.create({
        userId,
        date,
        startTime,
        endTime,
        durationMinutes,
        notes,
        rating,
        sets,
      });

      return reply.code(201).send({
        success: true,
        data: {
          id: log.id,
          date: log.date,
          setsCount: log.trainingSets.length,
          createdAt: log.createdAt,
        },
        message: '训练记录创建成功',
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
   * 更新训练记录
   * PUT /api/v1/training-logs/:id
   */
  async update(
    request: FastifyRequest<{
      user: { userId: number };
      params: { id: string };
      body: UpdateTrainingLogBody;
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user.userId;
      const id = parseInt(request.params.id, 10);

      const updated = await this.trainingLogService.update(id, userId, request.body);

      return reply.code(200).send({
        success: true,
        message: '训练记录更新成功',
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return reply.code(404).send({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: '训练记录不存在',
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
   * 删除训练记录
   * DELETE /api/v1/training-logs/:id
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

      await this.trainingLogService.delete(id, userId);

      return reply.code(200).send({
        success: true,
        message: '训练记录已删除',
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return reply.code(404).send({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: '训练记录不存在',
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

export default TrainingLogController;
