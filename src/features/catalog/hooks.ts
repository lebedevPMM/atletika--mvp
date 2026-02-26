import { useQuery } from '@tanstack/react-query';
import { catalogApi } from './api';

export function useCategories() {
  return useQuery({
    queryKey: ['catalog', 'categories'],
    queryFn: () => catalogApi.getCategories(),
  });
}

export function useItems(categoryId?: string) {
  return useQuery({
    queryKey: ['catalog', 'items', { categoryId }],
    queryFn: () => catalogApi.getItems(categoryId),
  });
}

export function usePurchases(status?: string) {
  return useQuery({
    queryKey: ['purchases', { status }],
    queryFn: () => catalogApi.getPurchases(status),
  });
}
