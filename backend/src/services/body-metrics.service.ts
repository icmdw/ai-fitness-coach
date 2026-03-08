/**
 * 身体数据服务
 * 处理身体测量数据的业务逻辑
 */

import prisma from '../utils/prisma';

interface CreateBodyMetricInput {
  userId: number;
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

interface UpdateBodyMetricInput {
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

export class BodyMetricService {
  /**
   * 创建身体数据记录
   */
  async create(data: CreateBodyMetricInput) {
    const { userId, ...metricData } = data;

    const metric = await prisma.bodyMetric.create({
      data: {
        ...metricData,
        date: new Date(metricData.date),
        userId,
      },
    });

    return metric;
  }

  /**
   * 获取身体数据列表
   */
  async findByUser(userId: number, options?: {
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
  }) {
    const { startDate, endDate, page = 1, pageSize = 20 } = options || {};

    const where: any = { userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const [metrics, total] = await Promise.all([
      prisma.bodyMetric.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.bodyMetric.count({ where }),
    ]);

    return {
      data: metrics,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * 获取身体数据详情
   */
  async findById(id: number, userId: number) {
    const metric = await prisma.bodyMetric.findFirst({
      where: { id, userId },
    });

    return metric;
  }

  /**
   * 更新身体数据记录
   */
  async update(id: number, userId: number, data: UpdateBodyMetricInput) {
    const updated = await prisma.bodyMetric.update({
      where: { id, userId },
      data,
    });

    return updated;
  }

  /**
   * 删除身体数据记录
   */
  async delete(id: number, userId: number) {
    await prisma.bodyMetric.delete({
      where: { id, userId },
    });

    return true;
  }
}

export default BodyMetricService;
