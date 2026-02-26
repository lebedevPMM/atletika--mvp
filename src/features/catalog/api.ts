import { api } from '@/shared/api/client';
import type { CatalogCategory, CatalogItem, PurchasedService } from './types';

export const catalogApi = {
  getCategories: () => api.get<CatalogCategory[]>('catalog/categories'),
  getItems: (categoryId?: string) =>
    api.get<CatalogItem[]>('catalog/items', categoryId ? { category: categoryId } : undefined),
  getPurchases: (status?: string) =>
    api.get<PurchasedService[]>('me/purchases', status ? { status } : undefined),
};
