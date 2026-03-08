/**
 * 饮食记录控制器
 * 处理饮食记录相关的 HTTP 请求
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import FoodLogService from '../services/food-logs.service';

interface CreateFoodLogBody {
  date: string;
  mealType: string;
  foodName: string;
  calories?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  quantity?: number;
  unit?: string;
  notes?: string;
}

interface UpdateFoodLogBody {
  mealType?: string;
  foodName?: string;
  calories?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  quantity?: number;
  unit?: string;
  notes?: string;
}

interface BatchCreateFoodLogBody {
  records: CreateFoodLogBody[];
}

export class FoodLogController {
  private foodLogService: FoodLogService;

  constructor() {
    this.foodLogService = new FoodLogService();
  }

  /**
   * 获取饮食记录列表
   * GET /api/v1/food-logs
   */
  async list(
    request: FastifyRequest<{
      user: { userId: number };
      query: {
        date?: string;
        startDate?: string;
        endDate?: string;
        mealType?: string;
        page?: string;
        pageSize?: string;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user.userId;
      const { date, startDate, endDate, mealType, page, pageSize } = request.query;

      const result = await this.foodLogService.findByUser(userId, {
        date,
        startDate,
        endDate,
        mealType,
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
   * 获取每日营养汇总
   * GET /api/v1/food-logs/daily-summary/:date
   */
  async dailySummary(
    request: FastifyRequest<{
      user: { userId: number };
      params: { date: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user.userId;
      const { date } = request.params;

      const summary = await this.foodLogService.getDailySummary(userId, date);

      return reply.code(200).send({
        success: true,
        data: summary,
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
   * 获取饮食记录详情
   * GET /api/v1/food-logs/:id
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

      const log = await this.foodLogService.findById(id, userId);

      if (!log) {
        return reply.code(404).send({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: '饮食记录不存在',
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
   * 创建饮食记录
   * POST /api/v1/food-logs
   */
  async create(
    request: FastifyRequest<{
      user: { userId: number };
      body: CreateFoodLogBody;
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user.userId;
      const { date, mealType, foodName, ...logData } = request.body;

      if (!date || !mealType || !foodName) {
        return reply.code(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '日期、餐次和食物名称不能为空',
          },
        });
      }

      const log = await this.foodLogService.create({
        userId,
        date,
        mealType,
        foodName,
        ...logData,
      });

      return reply.code(201).send({
        success: true,
        data: {
          id: log.id,
          date: log.date,
          mealType: log.mealType,
          foodName: log.foodName,
          createdAt: log.createdAt,
        },
        message: '饮食记录创建成功',
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
   * 批量创建饮食记录
   * POST /api/v1/food-logs/batch
   */
  async batchCreate(
    request: FastifyRequest<{
      user: { userId: number };
      body: BatchCreateFoodLogBody;
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user.userId;
      const { records } = request.body;

      if (!records || records.length === 0) {
        return reply.code(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '至少需要一条饮食记录',
          },
        });
      }

      const result = await this.foodLogService.createBatch(userId, records);

      return reply.code(201).send({
        success: true,
        data: {
          createdCount: result.count,
        },
        message: '批量创建成功',
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
   * 更新饮食记录
   * PUT /api/v1/food-logs/:id
   */
  async update(
    request: FastifyRequest<{
      user: { userId: number };
      params: { id: string };
      body: UpdateFoodLogBody;
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user.userId;
      const id = parseInt(request.params.id, 10);

      const updated = await this.foodLogService.update(id, userId, request.body);

      return reply.code(200).send({
        success: true,
        message: '饮食记录更新成功',
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return reply.code(404).send({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: '饮食记录不存在',
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
   * 删除饮食记录
   * DELETE /api/v1/food-logs/:id
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

      await this.foodLogService.delete(id, userId);

      return reply.code(200).send({
        success: true,
        message: '饮食记录已删除',
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return reply.code(404).send({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: '饮食记录不存在',
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

export default FoodLogController;
