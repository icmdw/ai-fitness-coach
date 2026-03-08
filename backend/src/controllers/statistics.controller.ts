/**
 * 数据统计控制器
 * 处理统计相关的 HTTP 请求
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import StatisticsService from '../services/statistics.service';

export class StatisticsController {
  private statisticsService: StatisticsService;

  constructor() {
    this.statisticsService = new StatisticsService();
  }

  /**
   * 获取训练统计
   * GET /api/v1/statistics/training
   */
  async trainingStats(
    request: FastifyRequest<{
      user: { userId: number };
      query: {
        period?: string;
        exerciseId?: string;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user.userId;
      const { period, exerciseId } = request.query;

      const stats = await this.statisticsService.getTrainingStats(userId, {
        period,
        exerciseId: exerciseId ? parseInt(exerciseId, 10) : undefined,
      });

      return reply.code(200).send({
        success: true,
        data: stats,
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
   * 获取力量进步数据
   * GET /api/v1/statistics/strength/:exerciseId
   */
  async strengthProgression(
    request: FastifyRequest<{
      user: { userId: number };
      params: { exerciseId: string };
      query: {
        period?: string;
        metric?: string;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user.userId;
      const exerciseId = parseInt(request.params.exerciseId, 10);
      const { period, metric } = request.query;

      const progression = await this.statisticsService.getStrengthProgression(
        userId,
        exerciseId,
        { period, metric }
      );

      return reply.code(200).send({
        success: true,
        data: progression,
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
   * 获取身体数据趋势
   * GET /api/v1/statistics/body-metrics
   */
  async bodyMetricsTrend(
    request: FastifyRequest<{
      user: { userId: number };
      query: {
        period?: string;
        metrics?: string; // comma-separated
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user.userId;
      const { period, metrics } = request.query;

      const trend = await this.statisticsService.getBodyMetricsTrend(userId, {
        period,
        metrics: metrics ? metrics.split(',') : undefined,
      });

      return reply.code(200).send({
        success: true,
        data: trend,
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
   * 获取营养统计
   * GET /api/v1/statistics/nutrition
   */
  async nutritionStats(
    request: FastifyRequest<{
      user: { userId: number };
      query: {
        period?: string;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user.userId;
      const { period } = request.query;

      const stats = await this.statisticsService.getNutritionStats(userId, {
        period,
      });

      return reply.code(200).send({
        success: true,
        data: stats,
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
}

export default StatisticsController;
