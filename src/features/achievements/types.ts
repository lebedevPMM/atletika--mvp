export type AchievementStatus = 'unlocked' | 'in_progress' | 'locked' | 'secret';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: AchievementStatus;
  progress?: number; // current
  target?: number; // max
  unlockedAt?: string;
  category: 'streak' | 'total' | 'variety' | 'time' | 'social' | 'secret';
}

export interface AchievementsSummary {
  total: number;
  unlocked: number;
  achievements: Achievement[];
}
