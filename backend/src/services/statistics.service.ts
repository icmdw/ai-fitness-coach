/**
 * 数据统计服务
 * 处理训练统计、力量进步、身体数据趋势等业务逻辑
 */

import prisma from '../utils/prisma';

export class StatisticsService {
  /**
   * 获取训练统计
   */
  async getTrainingStats(userId: number, options?: {
    period?: string; // week, month, year, all
    exerciseId?: number;
  }) {
    const { period = 'month', exerciseId } = options || {};

    const now = new Date();
    const startDate = new Date();

    if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(now.getFullYear() - 1);
    }

    const where: any = {
      userId,
      date: { gte: startDate },
    };

    if (exerciseId) {
      where.trainingSets = { some: { exerciseId } };
    }

    const logs = await prisma.trainingLog.findMany({
      where,
      include: {
        trainingSets: {
          include: { exercise: true },
        },
      },
      orderBy: { date: 'desc' },
    });

    // 计算统计数据
    const totalWorkouts = logs.length;
    const totalSets = logs.reduce((sum, log) => sum + log.trainingSets.length, 0);
    const totalVolume = logs.reduce(
      (sum, log) =>
        sum +
        log.trainingSets.reduce((s, set) => s + set.weightKg * set.reps, 0),
      0
    );
    const averageDuration =
      logs.reduce((sum, log) => sum + (log.durationMinutes || 0), 0) /
      (totalWorkouts || 1);

    // 按动作统计
    const exerciseStats: any = {};
    logs.forEach((log) => {
      log.trainingSets.forEach((set) => {
        const exId = set.exerciseId;
        if (!exerciseStats[exId]) {
          exerciseStats[exId] = {
            exerciseId: exId,
            exerciseName: set.exercise.name,
            sessions: 0,
            totalSets: 0,
            maxWeight: 0,
            totalVolume: 0,
          };
        }
        exerciseStats[exId].sessions += 1;
        exerciseStats[exId].totalSets += 1;
        exerciseStats[exId].maxWeight = Math.max(
          exerciseStats[exId].maxWeight,
          set.weightKg
        );
        exerciseStats[exId].totalVolume += set.weightKg * set.reps;
      });
    });

    return {
      period,
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
      totalWorkouts,
      totalSets,
      totalVolume,
      averageDuration: Math.round(averageDuration),
      exerciseStats: Object.values(exerciseStats),
    };
  }

  /**
   * 获取力量进步数据（针对特定动作）
   */
  async getStrengthProgression(
    userId: number,
    exerciseId: number,
    options?: {
      period?: string; // month, year, all
      metric?: string; // max, average, volume
    }
  ) {
    const { period = 'year', metric = 'max' } = options || {};

    const now = new Date();
    const startDate = new Date();

    if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(now.getFullYear() - 1);
    }

    const logs = await prisma.trainingLog.findMany({
      where: {
        userId,
        date: { gte: startDate },
        trainingSets: { some: { exerciseId } },
      },
      include: {
        trainingSets: {
          where: { exerciseId },
        },
      },
      orderBy: { date: 'asc' },
    });

    // 按日期聚合数据
    const dataPoints = logs.map((log) => {
      const sets = log.trainingSets;
      const maxWeight = Math.max(...sets.map((s) => s.weightKg));
      const avgWeight =
        sets.reduce((sum, s) => sum + s.weightKg, 0) / sets.length;
      const volume = sets.reduce((sum, s) => sum + s.weightKg * s.reps, 0);

      return {
        date: log.date.toISOString().split('T')[0],
        maxWeight,
        averageWeight: Math.round(avgWeight * 10) / 10,
        volume,
      };
    });

    // 计算进步情况
    const firstPoint = dataPoints[0];
    const lastPoint = dataPoints[dataPoints.length - 1];
    const weightGain = lastPoint
      ? lastPoint.maxWeight - (firstPoint ? firstPoint.maxWeight : 0)
      : 0;
    const percentageGain = firstPoint
      ? (weightGain / firstPoint.maxWeight) * 100
      : 0;

    return {
      exerciseId,
      period,
      metric,
      dataPoints,
      progression: {
        weightGain,
        percentageGain: Math.round(percentageGain * 10) / 10,
        trend: weightGain > 0 ? 'up' : weightGain < 0 ? 'down' : 'stable',
      },
    };
  }

  /**
   * 获取身体数据趋势
   */
  async getBodyMetricsTrend(
    userId: number,
    options?: {
      period?: string; // month, year, all
      metrics?: string[]; // weight, bodyFat, muscleMass, etc.
    }
  ) {
    const { period = 'year', metrics = ['weight', 'bodyFat'] } = options || {};

    const now = new Date();
    const startDate = new Date();

    if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(now.getFullYear() - 1);
    }

    const bodyMetrics = await prisma.bodyMetric.findMany({
      where: {
        userId,
        date: { gte: startDate },
      },
      orderBy: { date: 'asc' },
    });

    const dataPoints = bodyMetrics.map((m) => {
      const point: any = { date: m.date.toISOString().split('T')[0] };
      if (metrics.includes('weight')) point.weight = m.weightKg;
      if (metrics.includes('bodyFat')) point.bodyFat = m.bodyFatPercent;
      if (metrics.includes('muscleMass')) point.muscleMass = m.muscleMassKg;
      return point;
    });

    // 计算变化
    const first = bodyMetrics[0];
    const last = bodyMetrics[bodyMetrics.length - 1];
    const summary: any = {};
    if (metrics.includes('weight') && first && last) {
      summary.weightChange = last.weightKg - (first.weightKg || 0);
    }
    if (metrics.includes('bodyFat') && first && last) {
      summary.bodyFatChange = last.bodyFatPercent - (first.bodyFatPercent || 0);
    }

    return {
      period,
      metrics,
      dataPoints,
      summary,
    };
  }

  /**
   * 获取营养统计
   */
  async getNutritionStats(
    userId: number,
    options?: {
      period?: string; // week, month
    }
  ) {
    const { period = 'week' } = options || {};

    const now = new Date();
    const startDate = new Date();

    if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    }

    const foodLogs = await prisma.foodLog.findMany({
      where: {
        userId,
        date: { gte: startDate },
      },
    });

    // 计算每日汇总
    const dailyStats: any = {};
    foodLogs.forEach((log) => {
      const date = log.date.toISOString().split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = {
          date,
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        };
      }
      dailyStats[date].calories += log.calories || 0;
      dailyStats[date].protein += log.proteinG || 0;
      dailyStats[date].carbs += log.carbsG || 0;
      dailyStats[date].fat += log.fatG || 0;
    });

    const dailyBreakdown = Object.values(dailyStats);
    const days = dailyBreakdown.length || 1;

    // 计算平均值
    const dailyAverage = {
      calories: Math.round(
        dailyBreakdown.reduce((s, d: any) => s + d.calories, 0) / days
      ),
      protein: Math.round(
        dailyBreakdown.reduce((s, d: any) => s + d.protein, 0) / days
      ),
      carbs: Math.round(
        dailyBreakdown.reduce((s, d: any) => s + d.carbs, 0) / days
      ),
      fat: Math.round(
        dailyBreakdown.reduce((s, d: any) => s + d.fat, 0) / days
      ),
    };

    // 计算总和
    const weeklyTotal = {
      calories: dailyBreakdown.reduce((s: any, d: any) => s + d.calories, 0),
      protein: dailyBreakdown.reduce((s: any, d: any) => s + d.protein, 0),
      carbs: dailyBreakdown.reduce((s: any, d: any) => s + d.carbs, 0),
      fat: dailyBreakdown.reduce((s: any, d: any) => s + d.fat, 0),
    };

    return {
      period,
      dailyAverage,
      weeklyTotal,
      dailyBreakdown,
    };
  }
}

export default StatisticsService;
