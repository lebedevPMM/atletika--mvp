import { useQuery } from '@tanstack/react-query';
import { achievementsApi } from './api';

export function useAchievements() {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: () => achievementsApi.getAchievements(),
    staleTime: 300_000,
  });
}
