import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from './api';
import { analytics } from '@/features/analytics/tracker';
import type { CreateReviewPayload } from './types';

export function useReviews() {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: () => reviewsApi.getReviews(),
    staleTime: 60_000,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReviewPayload) => reviewsApi.createReview(data),
    onSuccess: () => {
      analytics.track({ name: 'review_created', params: {} });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
