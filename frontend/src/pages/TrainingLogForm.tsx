'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X, Plus, Minus } from 'lucide-react';

const trainingLogSchema = z.object({
  date: z.string(),
  type: z.enum([
    'chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'full_body', 'cardio'
  ]),
  notes: z.string().optional(),
  exercises: z.array(z.object({
    exerciseId: z.string(),
    exerciseName: z.string(),
    weight: z.number().min(0),
    reps: z.number().min(1),
    sets: z.number().min(1),
  })).min(1, '至少添加一个动作'),
});

type TrainingLogFormData = z.infer<typeof trainingLogSchema>;

const TRAINING_TYPES = [
  { value: 'chest', label: '胸部' },
  { value: 'back', label: '背部' },
  { value: 'legs', label: '腿部' },
  { value: 'shoulders', label: '肩部' },
  { value: 'arms', label: '手臂' },
  { value: 'core', label: '核心' },
  { value: 'full_body', label: '全身' },
  { value: 'cardio', label: '有氧' },
];

interface TrainingLogFormProps {
  onSubmit: (data: TrainingLogFormData) => void;
  onCancel: () => void;
}

export function TrainingLogForm({ onSubmit, onCancel }: TrainingLogFormProps) {
  const [exerciseSearch, setExerciseSearch] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting }, control, watch } = useForm<TrainingLogFormData>({
    resolver: zodResolver(trainingLogSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      type: 'chest',
      notes: '',
      exercises: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'exercises',
  });

  const selectedType = watch('type');

  const handleAddExercise = () => {
    if (exerciseSearch.trim()) {
      append({
        exerciseId: 'temp-' + Date.now(),
        exerciseName: exerciseSearch,
        weight: 0,
        reps: 10,
        sets: 3,
      });
      setExerciseSearch('');
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>新增训练记录</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              训练日期
            </label>
            <input
              type="date"
              {...register('date')}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Training Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              训练类型
            </label>
            <select
              {...register('type')}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              {TRAINING_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Add Exercise */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              添加动作
            </label>
            <div className="flex space-x-2">
              <Input
                placeholder="搜索或输入动作名称（如：杠铃卧推）"
                value={exerciseSearch}
                onChange={(e) => setExerciseSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExercise())}
              />
              <Button type="button" onClick={handleAddExercise} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Exercise List */}
          {fields.length > 0 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                训练动作
              </label>
              {fields.map((field, index) => (
                <div key={field.id} className="border border-gray-200 rounded-md p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      {index + 1}. {field.exerciseName}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">重量 (kg)</label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        {...register(`exercises.${index}.weight`, { valueAsNumber: true })}
                        className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">次数</label>
                      <input
                        type="number"
                        min="1"
                        {...register(`exercises.${index}.reps`, { valueAsNumber: true })}
                        className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">组数</label>
                      <input
                        type="number"
                        min="1"
                        {...register(`exercises.${index}.sets`, { valueAsNumber: true })}
                        className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {errors.exercises && (
            <p className="text-sm text-red-600">{errors.exercises.message}</p>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              备注
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="记录训练感受、注意事项等..."
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={onCancel}>
              取消
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              保存记录
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
