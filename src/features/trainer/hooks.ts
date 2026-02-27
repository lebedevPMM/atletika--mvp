import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trainerApi } from './api';
import { analytics } from '@/features/analytics/tracker';
import type { TrainerProfile } from './types';

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

export function useTrainerProfile() {
  return useQuery({
    queryKey: ['trainer', 'profile'],
    queryFn: () => trainerApi.getProfile(),
    staleTime: 300_000,
  });
}

export function useUpdateTrainerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<TrainerProfile>) => trainerApi.updateProfile(data),
    onSuccess: () => {
      analytics.track({ name: 'trainer_profile_save', params: {} });
      queryClient.invalidateQueries({ queryKey: ['trainer', 'profile'] });
    },
  });
}

export function useTrainerClientPlan(clientId: string) {
  return useQuery({
    queryKey: ['trainer', 'client-plan', clientId],
    queryFn: () => trainerApi.getClientPlan(clientId),
    enabled: !!clientId,
  });
}

export function useTrainerDaySummary(date?: string) {
  return useQuery({
    queryKey: ['trainer', 'day-summary', date],
    queryFn: () => trainerApi.getDaySummary(date),
  });
}

export function useEndShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { date: string; notes?: string }) => trainerApi.endShift(data),
    onSuccess: () => {
      analytics.track({ name: 'trainer_shift_end_confirm', params: {} });
      queryClient.invalidateQueries({ queryKey: ['trainer'] });
    },
  });
}

export function useTrainerClientProgress(clientId: string) {
  return useQuery({
    queryKey: ['trainer', 'client-progress', clientId],
    queryFn: () => trainerApi.getClientProgress(clientId),
    enabled: !!clientId,
  });
}

export function useTrainerNotifications() {
  return useQuery({
    queryKey: ['trainer', 'notifications'],
    queryFn: () => trainerApi.getNotifications(),
    staleTime: 30_000,
  });
}

export function useReadAllTrainerNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => trainerApi.readAllNotifications(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainer', 'notifications'] });
    },
  });
}
