import { useQuery } from '@tanstack/react-query';
import { trainingLogService } from '@/services/training-log.service';
import type { TrainingLog, TrainingType } from '@/types';

export function useTrainingLogs(type?: TrainingType) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['training-logs', type],
    queryFn: () => trainingLogService.getAll({ type }),
  });

  return {
    logs: data?.data || [],
    isLoading,
    error,
    refetch,
  };
}
