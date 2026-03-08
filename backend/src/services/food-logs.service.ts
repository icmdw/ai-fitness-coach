/**
 * 饮食记录服务
 * 处理饮食记录的业务逻辑
 */

import prisma from '../utils/prisma';

interface CreateFoodLogInput {
  userId: number;
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

interface UpdateFoodLogInput {
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

export class FoodLogService {
  /**
   * 创建饮食记录
   */
  async create(data: CreateFoodLogInput) {
    const { userId, ...logData } = data;

    const log = await prisma.foodLog.create({
      data: {
        ...logData,
        date: new Date(logData.date),
        userId,
      },
    });

    return log;
  }

  /**
   * 批量创建饮食记录
   */
  async createBatch(userId: number, records: CreateFoodLogInput[]) {
    const created = await prisma.foodLog.createMany({
      data: records.map((r) => ({
        ...r,
        userId,
        date: new Date(r.date),
      })),
    });

    return created;
  }

  /**
   * 获取饮食记录列表
   */
  async findByUser(userId: number, options?: {
    date?: string;
    startDate?: string;
    endDate?: string;
    mealType?: string;
    page?: number;
    pageSize?: number;
  }) {
    const { date, startDate, endDate, mealType, page = 1, pageSize = 20 } = options || {};

    const where: any = { userId };

    if (date) {
      where.date = new Date(date);
    } else if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    if (mealType) {
      where.mealType = mealType;
    }

    const [logs, total] = await Promise.all([
      prisma.foodLog.findMany({
        where,
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.foodLog.count({ where }),
    ]);

    return {
      data: logs,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * 获取每日营养汇总
   */
  async getDailySummary(userId: number, date: string) {
    const logs = await prisma.foodLog.findMany({
      where: {
        userId,
        date: new Date(date),
      },
    });

    const summary = logs.reduce(
      (acc, log) => ({
        calories: acc.calories + (log.calories || 0),
        protein: acc.protein + (log.proteinG || 0),
        carbs: acc.carbs + (log.carbsG || 0),
        fat: acc.fat + (log.fatG || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const meals = logs.reduce((acc, log) => {
      if (!acc[log.mealType]) {
        acc[log.mealType] = { calories: 0, protein: 0, carbs: 0, fat: 0 };
      }
      acc[log.mealType].calories += log.calories || 0;
      acc[log.mealType].protein += log.proteinG || 0;
      acc[log.mealType].carbs += log.carbsG || 0;
      acc[log.mealType].fat += log.fatG || 0;
      return acc;
    }, {} as Record<string, { calories: number; protein: number; carbs: number; fat: number }>);

    return {
      date,
      totalCalories: summary.calories,
      totalProtein: summary.protein,
      totalCarbs: summary.carbs,
      totalFat: summary.fat,
      meals,
      recordsCount: logs.length,
    };
  }

  /**
   * 获取饮食记录详情
   */
  async findById(id: number, userId: number) {
    const log = await prisma.foodLog.findFirst({
      where: { id, userId },
    });

    return log;
  }

  /**
   * 更新饮食记录
   */
  async update(id: number, userId: number, data: UpdateFoodLogInput) {
    const updated = await prisma.foodLog.update({
      where: { id, userId },
      data,
    });

    return updated;
  }

  /**
   * 删除饮食记录
   */
  async delete(id: number, userId: number) {
    await prisma.foodLog.delete({
      where: { id, userId },
    });

    return true;
  }
}

export default FoodLogService;
