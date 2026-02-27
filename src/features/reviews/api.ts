import { api } from '@/shared/api/client';
import type { Review, CreateReviewPayload } from './types';

export const reviewsApi = {
  getReviews: () =>
    api.get<Review[]>('reviews'),

  createReview: (data: CreateReviewPayload) =>
    api.post<Review>('reviews', data),
};
