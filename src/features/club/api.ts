import { api } from '@/shared/api/client';
import type { Club, ClubConfig, ClubDetails, TeamMember, NewsItem, ChatMessage } from './types';

export const clubApi = {
  getMyClubs: () => api.get<Club[]>('me/clubs'),
  selectClub: (clubId: string, branchId: string) =>
    api.post<void>('me/club-context', { clubId, branchId }),
  getConfig: () => api.get<ClubConfig>('club/config'),

  // S8
  getDetails: () => api.get<ClubDetails>('club/details'),
  getTeam: (params?: { role?: string }) => api.get<TeamMember[]>('club/team', params),
  getTeamMember: (memberId: string) => api.get<TeamMember>(`club/team/${memberId}`),
  getNews: () => api.get<NewsItem[]>('club/news'),
  getNewsItem: (newsId: string) => api.get<NewsItem>(`club/news/${newsId}`),
  getChatMessages: (trainerId: string) =>
    api.get<ChatMessage[]>('chat/messages', { trainerId }),
  sendMessage: (trainerId: string, text: string) =>
    api.post<ChatMessage>('chat/messages', { trainerId, text }),
};
