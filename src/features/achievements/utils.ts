import type { AchievementStatus } from './types';

export function getStatusLabel(status: AchievementStatus): string {
  switch (status) {
    case 'unlocked': return 'Получено';
    case 'in_progress': return 'В процессе';
    case 'locked': return 'Заблокировано';
    case 'secret': return 'Секретное';
  }
}

export function getCategoryLabel(category: string): string {
  switch (category) {
    case 'streak': return 'Серии';
    case 'total': return 'Количество';
    case 'variety': return 'Разнообразие';
    case 'time': return 'Время';
    case 'social': return 'Социальные';
    case 'secret': return 'Секретные';
    default: return category;
  }
}

export function getCategoryIcon(category: string): string {
  switch (category) {
    case 'streak': return '\uD83D\uDD25';
    case 'total': return '\uD83D\uDCAA';
    case 'variety': return '\uD83C\uDFAF';
    case 'time': return '\uD83C\uDF05';
    case 'social': return '\uD83D\uDC65';
    case 'secret': return '\uD83D\uDD12';
    default: return '\uD83C\uDFC6';
  }
}

export function formatProgress(current: number, target: number): string {
  return `${current}/${target}`;
}
