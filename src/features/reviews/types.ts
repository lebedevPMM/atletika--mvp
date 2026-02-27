export interface Review {
  id: string;
  authorName: string;
  rating: number; // 1-5
  text: string;
  date: string;
  trainerName?: string;
  className?: string;
  type: 'trainer' | 'class' | 'club';
}

export interface CreateReviewPayload {
  type: 'trainer' | 'class' | 'club';
  targetId?: string;
  rating: number;
  text: string;
}
