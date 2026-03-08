/**
 * 动作库服务
 * 处理健身动作的业务逻辑
 */

import prisma from '../utils/prisma';

interface CreateExerciseInput {
  name: string;
  nameEn?: string;
  category: string;
  equipment?: string;
  description?: string;
  instructions?: string;
}

interface UpdateExerciseInput {
  name?: string;
  nameEn?: string;
  category?: string;
  equipment?: string;
  description?: string;
  instructions?: string;
}

export class ExerciseService {
  /**
   * 创建动作
   */
  async create(data: CreateExerciseInput) {
    const exercise = await prisma.exercise.create({
      data,
    });

    return exercise;
  }

  /**
   * 获取动作列表
   */
  async findAll(options?: {
    category?: string;
    equipment?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }) {
    const { category, equipment, search, page = 1, pageSize = 20 } = options || {};

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (equipment) {
      where.equipment = equipment;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { nameEn: { contains: search } },
      ];
    }

    const [exercises, total] = await Promise.all([
      prisma.exercise.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.exercise.count({ where }),
    ]);

    return {
      data: exercises,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * 获取动作详情
   */
  async findById(id: number) {
    const exercise = await prisma.exercise.findUnique({
      where: { id },
    });

    return exercise;
  }

  /**
   * 更新动作
   */
  async update(id: number, data: UpdateExerciseInput) {
    const updated = await prisma.exercise.update({
      where: { id },
      data,
    });

    return updated;
  }

  /**
   * 删除动作
   */
  async delete(id: number) {
    await prisma.exercise.delete({
      where: { id },
    });

    return true;
  }
}

export default ExerciseService;
