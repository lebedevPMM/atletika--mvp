import { api } from '@/shared/api/client';
import type { NotificationItem } from '@/features/club/types';

export const notificationsApi = {
  getNotifications: () => api.get<NotificationItem[]>('notifications'),
  markRead: (notificationId: string) =>
    api.post<void>(`notifications/${notificationId}/read`),
  markAllRead: () => api.post<void>('notifications/read-all'),
};
