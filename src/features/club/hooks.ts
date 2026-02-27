import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clubApi } from './api';
import { analytics } from '@/features/analytics/tracker';

export function useClubDetails() {
  return useQuery({
    queryKey: ['club', 'details'],
    queryFn: () => clubApi.getDetails(),
    staleTime: 60_000,
  });
}

export function useClubTeam(role?: string) {
  return useQuery({
    queryKey: ['club', 'team', { role }],
    queryFn: () => clubApi.getTeam(role ? { role } : undefined),
    staleTime: 60_000,
  });
}

export function useTeamMember(memberId: string) {
  return useQuery({
    queryKey: ['club', 'team', memberId],
    queryFn: () => clubApi.getTeamMember(memberId),
    enabled: !!memberId,
  });
}

export function useClubNews() {
  return useQuery({
    queryKey: ['club', 'news'],
    queryFn: () => clubApi.getNews(),
    staleTime: 30_000,
  });
}

export function useNewsItem(newsId: string) {
  return useQuery({
    queryKey: ['club', 'news', newsId],
    queryFn: () => clubApi.getNewsItem(newsId),
    enabled: !!newsId,
  });
}

export function useChatMessages(trainerId: string) {
  return useQuery({
    queryKey: ['chat', trainerId],
    queryFn: () => clubApi.getChatMessages(trainerId),
    enabled: !!trainerId,
    refetchInterval: 10_000, // poll every 10s
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ trainerId, text }: { trainerId: string; text: string }) =>
      clubApi.sendMessage(trainerId, text),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat', variables.trainerId] });
      analytics.track({ name: 'chat_send_message', params: { success: true } });
    },
  });
}
