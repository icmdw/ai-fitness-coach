// 用户相关类型
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// 训练记录相关类型
export interface TrainingLog {
  id: string;
  userId: string;
  date: string;
  type: TrainingType;
  notes?: string;
  sets: TrainingSet[];
  createdAt: string;
  updatedAt: string;
}

export type TrainingType = 
  | 'chest'
  | 'back'
  | 'legs'
  | 'shoulders'
  | 'arms'
  | 'core'
  | 'full_body'
  | 'cardio';

export interface TrainingSet {
  id: string;
  logId: string;
  exerciseId: string;
  exercise: Exercise;
  weight: number;
  reps: number;
  sets: number;
  order: number;
}

// 动作库相关类型
export interface Exercise {
  id: string;
  name: string;
  category: TrainingType;
  description?: string;
  createdAt: string;
}

// 身体数据相关类型
export interface BodyMetric {
  id: string;
  userId: string;
  date: string;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  bmi?: number;
  waist?: number;
  chest?: number;
  arm?: number;
  thigh?: number;
  notes?: string;
  createdAt: string;
}

// 饮食记录相关类型
export interface FoodLog {
  id: string;
  userId: string;
  date: string;
  type: MealType;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  notes?: string;
  createdAt: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

// AI 建议相关类型
export interface AISuggestion {
  id: string;
  userId: string;
  type: SuggestionType;
  content: string;
  createdAt: string;
}

export type SuggestionType = 'training' | 'diet' | 'recovery';

// API 响应类型
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

// 统计相关类型
export interface TrainingStats {
  weeklyVolume: WeeklyVolume[];
  muscleGroupVolume: MuscleGroupVolume[];
  strengthCurve: StrengthCurve[];
}

export interface WeeklyVolume {
  week: string;
  volume: number;
  sessions: number;
}

export interface MuscleGroupVolume {
  group: TrainingType;
  volume: number;
}

export interface StrengthCurve {
  date: string;
  exercise: string;
  weight: number;
  reps: number;
}
