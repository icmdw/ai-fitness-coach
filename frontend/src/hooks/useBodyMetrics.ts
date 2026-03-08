import { useQuery } from '@tanstack/react-query';
import { bodyMetricService } from '@/services/body-metric.service';
import type { BodyMetric } from '@/types';

export function useBodyMetrics() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['body-metrics'],
    queryFn: () => bodyMetricService.getAll(),
  });

  return {
    metrics: data?.data || [],
    isLoading,
    error,
    refetch,
  };
}
