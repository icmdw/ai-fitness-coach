/**
 * 训练记录服务
 * 处理训练记录的业务逻辑
 */

import prisma from '../utils/prisma';

interface CreateTrainingLogInput {
  userId: number;
  date: string;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  notes?: string;
  rating?: number;
  sets: CreateTrainingSetInput[];
}

interface CreateTrainingSetInput {
  exerciseId: number;
  setNumber: number;
  weightKg: number;
  reps: number;
  rpe?: number;
  restSeconds?: number;
  completed?: boolean;
  notes?: string;
}

interface UpdateTrainingLogInput {
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  notes?: string;
  rating?: number;
  sets?: CreateTrainingSetInput[];
}

export class TrainingLogService {
  /**
   * 创建训练记录
   */
  async create(data: CreateTrainingLogInput) {
    const { userId, sets, ...logData } = data;

    const trainingLog = await prisma.trainingLog.create({
      data: {
        ...logData,
        date: new Date(logData.date),
        userId,
        trainingSets: {
          create: sets.map((set) => ({
            exerciseId: set.exerciseId,
            setNumber: set.setNumber,
            weightKg: set.weightKg,
            reps: set.reps,
            rpe: set.rpe,
            restSeconds: set.restSeconds,
            completed: set.completed ?? true,
            notes: set.notes,
          })),
        },
      },
      include: {
        trainingSets: {
          include: {
            exercise: true,
          },
        },
      },
    });

    return trainingLog;
  }

  /**
   * 获取训练记录列表
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

    const [logs, total] = await Promise.all([
      prisma.trainingLog.findMany({
        where,
        include: {
          trainingSets: {
            include: {
              exercise: true,
            },
          },
        },
        orderBy: { date: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.trainingLog.count({ where }),
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
   * 获取训练记录详情
   */
  async findById(id: number, userId: number) {
    const log = await prisma.trainingLog.findFirst({
      where: { id, userId },
      include: {
        trainingSets: {
          include: {
            exercise: true,
          },
        },
      },
    });

    return log;
  }

  /**
   * 更新训练记录
   */
  async update(id: number, userId: number, data: UpdateTrainingLogInput) {
    const { sets, ...logData } = data;

    const updateData: any = { ...logData };

    if (sets) {
      // 删除旧的训练组，创建新的
      updateData.trainingSets = {
        deleteMany: {},
        create: sets.map((set) => ({
          exerciseId: set.exerciseId,
          setNumber: set.setNumber,
          weightKg: set.weightKg,
          reps: set.reps,
          rpe: set.rpe,
          restSeconds: set.restSeconds,
          completed: set.completed ?? true,
          notes: set.notes,
        })),
      };
    }

    const updated = await prisma.trainingLog.update({
      where: { id, userId },
      data: updateData,
      include: {
        trainingSets: {
          include: {
            exercise: true,
          },
        },
      },
    });

    return updated;
  }

  /**
   * 删除训练记录
   */
  async delete(id: number, userId: number) {
    await prisma.trainingLog.delete({
      where: { id, userId },
    });

    return true;
  }
}

export default TrainingLogService;
