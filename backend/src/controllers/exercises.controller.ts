/**
 * 动作库控制器
 * 处理健身动作相关的 HTTP 请求
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import ExerciseService from '../services/exercises.service';

interface CreateExerciseBody {
  name: string;
  nameEn?: string;
  category: string;
  equipment?: string;
  description?: string;
  instructions?: string;
}

interface UpdateExerciseBody {
  name?: string;
  nameEn?: string;
  category?: string;
  equipment?: string;
  description?: string;
  instructions?: string;
}

export class ExerciseController {
  private exerciseService: ExerciseService;

  constructor() {
    this.exerciseService = new ExerciseService();
  }

  /**
   * 获取动作列表
   * GET /api/v1/exercises
   */
  async list(
    request: FastifyRequest<{
      query: {
        category?: string;
        equipment?: string;
        search?: string;
        page?: string;
        pageSize?: string;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { category, equipment, search, page, pageSize } = request.query;

      const result = await this.exerciseService.findAll({
        category,
        equipment,
        search,
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
   * 获取动作详情
   * GET /api/v1/exercises/:id
   */
  async getById(
    request: FastifyRequest<{ params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const id = parseInt(request.params.id, 10);

      const exercise = await this.exerciseService.findById(id);

      if (!exercise) {
        return reply.code(404).send({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: '动作不存在',
          },
        });
      }

      return reply.code(200).send({
        success: true,
        data: exercise,
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
   * 创建动作（需要认证）
   * POST /api/v1/exercises
   */
  async create(
    request: FastifyRequest<{ body: CreateExerciseBody }>,
    reply: FastifyReply
  ) {
    try {
      const { name, category } = request.body;

      if (!name || !category) {
        return reply.code(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '动作名称和分类不能为空',
          },
        });
      }

      const exercise = await this.exerciseService.create(request.body);

      return reply.code(201).send({
        success: true,
        data: {
          id: exercise.id,
          name: exercise.name,
          category: exercise.category,
          createdAt: exercise.createdAt,
        },
        message: '动作创建成功',
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
   * 更新动作（需要认证）
   * PUT /api/v1/exercises/:id
   */
  async update(
    request: FastifyRequest<{
      params: { id: string };
      body: UpdateExerciseBody;
    }>,
    reply: FastifyReply
  ) {
    try {
      const id = parseInt(request.params.id, 10);

      const updated = await this.exerciseService.update(id, request.body);

      return reply.code(200).send({
        success: true,
        message: '动作更新成功',
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return reply.code(404).send({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: '动作不存在',
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
   * 删除动作（需要认证）
   * DELETE /api/v1/exercises/:id
   */
  async delete(
    request: FastifyRequest<{ params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const id = parseInt(request.params.id, 10);

      await this.exerciseService.delete(id);

      return reply.code(200).send({
        success: true,
        message: '动作已删除',
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return reply.code(404).send({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: '动作不存在',
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

export default ExerciseController;
