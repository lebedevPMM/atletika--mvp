import { api } from '@/shared/api/client';
import type { VisitStats, Contraindication, FamilyMember, DocumentItem, FavoriteItem } from './types';

export const healthApi = {
  getVisitStats: () => api.get<VisitStats>('me/stats/visits'),
  getContraindications: () => api.get<Contraindication[]>('me/contraindications'),
  addContraindication: (data: { title: string; description: string; severity: string }) =>
    api.post<Contraindication>('me/contraindications', data),
  removeContraindication: (id: string) => api.delete<void>(`me/contraindications/${id}`),
  getFamily: () => api.get<FamilyMember[]>('me/family'),
  getDocuments: () => api.get<DocumentItem[]>('me/documents'),
  getFavorites: () => api.get<FavoriteItem[]>('me/favorites'),
  removeFavorite: (id: string) => api.delete<void>(`me/favorites/${id}`),
};
