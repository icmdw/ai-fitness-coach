'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trainingLogService } from '@/services/training-log.service';
import type { TrainingLog, TrainingType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Calendar, Filter, Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const TRAINING_TYPES: { value: TrainingType; label: string }[] = [
  { value: 'chest', label: '胸部' },
  { value: 'back', label: '背部' },
  { value: 'legs', label: '腿部' },
  { value: 'shoulders', label: '肩部' },
  { value: 'arms', label: '手臂' },
  { value: 'core', label: '核心' },
  { value: 'full_body', label: '全身' },
  { value: 'cardio', label: '有氧' },
];

export function TrainingLogList() {
  const [selectedType, setSelectedType] = useState<TrainingType | 'all'>('all');
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const queryClient = useQueryClient();

  const { data: logs, isLoading, error } = useQuery({
    queryKey: ['training-logs', selectedType, selectedDate],
    queryFn: () => trainingLogService.getAll({
      type: selectedType !== 'all' ? selectedType : undefined,
    }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => trainingLogService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-logs'] });
    },
  });

  const getTypeLabel = (type: TrainingType) => {
    return TRAINING_TYPES.find(t => t.value === type)?.label || type;
  };

  const getTypeColor = (type: TrainingType) => {
    const colors: Record<TrainingType, string> = {
      chest: 'bg-red-100 text-red-800',
      back: 'bg-blue-100 text-blue-800',
      legs: 'bg-green-100 text-green-800',
      shoulders: 'bg-yellow-100 text-yellow-800',
      arms: 'bg-purple-100 text-purple-800',
      core: 'bg-pink-100 text-pink-800',
      full_body: 'bg-indigo-100 text-indigo-800',
      cardio: 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return <div className="text-center py-8">加载中...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">加载失败</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">训练记录</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          新增记录
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as TrainingType | 'all')}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="all">全部类型</option>
            {TRAINING_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Training Logs List */}
      <div className="space-y-4">
        {logs?.data?.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              暂无训练记录，点击右上角新增
            </CardContent>
          </Card>
        ) : (
          logs?.data?.map((log: TrainingLog) => (
            <Card key={log.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(log.type)}`}>
                      {getTypeLabel(log.type)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(log.date), 'yyyy 年 MM 月 dd 日', { locale: zhCN })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(log.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {log.sets.map((set, index) => (
                    <div key={set.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-700">
                          {index + 1}. {set.exercise.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{set.weight} kg</span>
                        <span>× {set.reps} 次</span>
                        <span>{set.sets} 组</span>
                      </div>
                    </div>
                  ))}
                </div>
                {log.notes && (
                  <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                    备注：{log.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
