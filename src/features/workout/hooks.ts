import { useQuery, useMutation } from '@tanstack/react-query';
import { workoutApi } from './api';
import { analytics } from '@/features/analytics/tracker';
import type { WorkoutLog } from './types';

export function useWorkoutPlan(bookingId: string) {
  return useQuery({
    queryKey: ['workout', 'plan', bookingId],
    queryFn: () => workoutApi.getPlan(bookingId),
    enabled: !!bookingId,
  });
}

export function useSaveWorkoutLog() {
  return useMutation({
    mutationFn: (data: WorkoutLog) => workoutApi.saveLog(data),
    onSuccess: () => {
      analytics.track({ name: 'workout_session_complete', params: {} });
    },
  });
}
