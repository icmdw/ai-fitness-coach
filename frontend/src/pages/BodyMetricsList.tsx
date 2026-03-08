'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bodyMetricService } from '@/services/body-metric.service';
import type { BodyMetric } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Calendar, Trash2, Edit2, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function BodyMetricsList() {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const queryClient = useQueryClient();

  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['body-metrics'],
    queryFn: () => bodyMetricService.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => bodyMetricService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['body-metrics'] });
    },
  });

  const getTrendIcon = (value: number, prevValue?: number) => {
    if (!prevValue) return null;
    const diff = value - prevValue;
    if (diff > 0) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (diff < 0) return <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />;
    return <span className="text-gray-400">-</span>;
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
        <h1 className="text-2xl font-bold text-gray-900">身体数据</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          新增记录
        </Button>
      </div>

      {/* Latest Metrics Summary */}
      {metrics?.data?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="py-4">
              <div className="text-sm text-gray-500 mb-1">最新体重</div>
              <div className="text-2xl font-bold text-gray-900">
                {metrics.data[0].weight} <span className="text-sm font-normal">kg</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-sm text-gray-500 mb-1">体脂率</div>
              <div className="text-2xl font-bold text-gray-900">
                {metrics.data[0].bodyFat || '-'} <span className="text-sm font-normal">%</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-sm text-gray-500 mb-1">BMI</div>
              <div className="text-2xl font-bold text-gray-900">
                {metrics.data[0].bmi || '-'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <div className="text-sm text-gray-500 mb-1">肌肉量</div>
              <div className="text-2xl font-bold text-gray-900">
                {metrics.data[0].muscleMass || '-'} <span className="text-sm font-normal">kg</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Metrics List */}
      <div className="space-y-4">
        {metrics?.data?.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              暂无身体数据记录，点击右上角新增
            </CardContent>
          </Card>
        ) : (
          metrics?.data?.map((metric: BodyMetric, index: number) => (
            <Card key={metric.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {format(new Date(metric.date), 'yyyy 年 MM 月 dd 日', { locale: zhCN })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(metric.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">体重</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {metric.weight} <span className="text-sm font-normal">kg</span>
                      {getTrendIcon(metric.weight, metrics.data[index + 1]?.weight)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">体脂率</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {metric.bodyFat || '-'} <span className="text-sm font-normal">%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">BMI</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {metric.bmi || '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">肌肉量</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {metric.muscleMass || '-'} <span className="text-sm font-normal">kg</span>
                    </div>
                  </div>
                  {metric.waist && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">腰围</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {metric.waist} <span className="text-sm font-normal">cm</span>
                      </div>
                    </div>
                  )}
                  {metric.chest && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">胸围</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {metric.chest} <span className="text-sm font-normal">cm</span>
                      </div>
                    </div>
                  )}
                  {metric.arm && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">臂围</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {metric.arm} <span className="text-sm font-normal">cm</span>
                      </div>
                    </div>
                  )}
                  {metric.thigh && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">腿围</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {metric.thigh} <span className="text-sm font-normal">cm</span>
                      </div>
                    </div>
                  )}
                </div>
                {metric.notes && (
                  <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                    备注：{metric.notes}
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
