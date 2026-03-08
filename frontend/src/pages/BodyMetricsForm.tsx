'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const bodyMetricSchema = z.object({
  date: z.string(),
  weight: z.number().min(0, '体重必须大于 0'),
  bodyFat: z.number().min(0).max(100).optional().or(z.literal(0)),
  muscleMass: z.number().min(0).optional().or(z.literal(0)),
  bmi: z.number().min(0).optional().or(z.literal(0)),
  waist: z.number().min(0).optional().or(z.literal(0)),
  chest: z.number().min(0).optional().or(z.literal(0)),
  arm: z.number().min(0).optional().or(z.literal(0)),
  thigh: z.number().min(0).optional().or(z.literal(0)),
  notes: z.string().optional(),
});

type BodyMetricFormData = z.infer<typeof bodyMetricSchema>;

interface BodyMetricsFormProps {
  onSubmit: (data: BodyMetricFormData) => void;
  onCancel: () => void;
}

export function BodyMetricsForm({ onSubmit, onCancel }: BodyMetricsFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<BodyMetricFormData>({
    resolver: zodResolver(bodyMetricSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      weight: 0,
      bodyFat: 0,
      muscleMass: 0,
      bmi: 0,
      waist: 0,
      chest: 0,
      arm: 0,
      thigh: 0,
      notes: '',
    },
  });

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>新增身体数据</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              测量日期
            </label>
            <input
              type="date"
              {...register('date')}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Core Metrics */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">核心数据</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">体重 (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  {...register('weight', { valueAsNumber: true })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                {errors.weight && (
                  <p className="mt-1 text-xs text-red-600">{errors.weight.message}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">体脂率 (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  {...register('bodyFat', { valueAsNumber: true })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">BMI</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  {...register('bmi', { valueAsNumber: true })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">肌肉量 (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  {...register('muscleMass', { valueAsNumber: true })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Measurements */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">围度数据</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">腰围 (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  {...register('waist', { valueAsNumber: true })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">胸围 (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  {...register('chest', { valueAsNumber: true })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">臂围 (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  {...register('arm', { valueAsNumber: true })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">腿围 (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  {...register('thigh', { valueAsNumber: true })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              备注
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="记录测量条件、感受等..."
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
