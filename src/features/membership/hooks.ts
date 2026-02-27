import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { membershipApi } from './api';
import { analytics } from '@/features/analytics/tracker';
import type { FreezeRequest } from './types';

export function useMembership() {
  return useQuery({
    queryKey: ['membership'],
    queryFn: () => membershipApi.getMembership(),
  });
}

export function useFreezeRules() {
  return useQuery({
    queryKey: ['membership', 'freeze-rules'],
    queryFn: () => membershipApi.getFreezeRules(),
  });
}

export function useFreezeHistory() {
  return useQuery({
    queryKey: ['membership', 'freeze-history'],
    queryFn: () => membershipApi.getFreezeHistory(),
  });
}

export function useRequestFreeze() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FreezeRequest) => membershipApi.requestFreeze(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership'] });
      analytics.track({ name: 'freeze_request_result', params: { success: true } });
    },
    onError: (error: Error) => {
      analytics.track({ name: 'freeze_request_result', params: { success: false, reason: error.message } });
    },
  });
}
