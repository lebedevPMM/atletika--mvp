import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trainerApi } from './api';

export function useDayOverview(date?: string) {
  return useQuery({
    queryKey: ['trainer', 'day-overview', date],
    queryFn: () => trainerApi.getDayOverview(date),
    staleTime: 60_000,
  });
}

export function useTrainerSchedule(from: string, to: string) {
  return useQuery({
    queryKey: ['trainer', 'schedule', from, to],
    queryFn: () => trainerApi.getSchedule(from, to),
    staleTime: 60_000,
  });
}

export function useTrainerSession(sessionId: string) {
  return useQuery({
    queryKey: ['trainer', 'session', sessionId],
    queryFn: () => trainerApi.getSession(sessionId),
    enabled: !!sessionId,
  });
}

export function useTrainerClients() {
  return useQuery({
    queryKey: ['trainer', 'clients'],
    queryFn: () => trainerApi.getClients(),
    staleTime: 60_000,
  });
}

export function useTrainerClient(clientId: string) {
  return useQuery({
    queryKey: ['trainer', 'client', clientId],
    queryFn: () => trainerApi.getClient(clientId),
    enabled: !!clientId,
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => trainerApi.markAttendance(sessionId),
    onSuccess: (_data, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ['trainer', 'session', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['trainer', 'day-overview'] });
      queryClient.invalidateQueries({ queryKey: ['trainer', 'schedule'] });
    },
  });
}

export function useCancelSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => trainerApi.cancelSession(sessionId),
    onSuccess: (_data, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ['trainer', 'session', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['trainer', 'day-overview'] });
      queryClient.invalidateQueries({ queryKey: ['trainer', 'schedule'] });
    },
  });
}
