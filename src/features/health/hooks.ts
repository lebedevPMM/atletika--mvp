import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { healthApi } from './api';
import { analytics } from '@/features/analytics/tracker';

export function useVisitStats() {
  return useQuery({
    queryKey: ['stats', 'visits'],
    queryFn: () => healthApi.getVisitStats(),
  });
}

export function useContraindications() {
  return useQuery({
    queryKey: ['contraindications'],
    queryFn: () => healthApi.getContraindications(),
  });
}

export function useAddContraindication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; description: string; severity: string }) =>
      healthApi.addContraindication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contraindications'] });
    },
  });
}

export function useRemoveContraindication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => healthApi.removeContraindication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contraindications'] });
    },
  });
}

export function useFamily() {
  return useQuery({
    queryKey: ['family'],
    queryFn: () => healthApi.getFamily(),
  });
}

export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: () => healthApi.getDocuments(),
  });
}

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => healthApi.getFavorites(),
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => healthApi.removeFavorite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      analytics.track({ name: 'favorite_removed', params: {} });
    },
  });
}
