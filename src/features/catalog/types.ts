export interface CatalogCategory {
  id: string;
  name: string;
  icon: string; // emoji
  itemCount: number;
}

export interface CatalogItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  tags: string[]; // e.g. ['хит', 'акция']
  available: boolean;
}

export type PurchaseType = 'pt_pack' | 'spa_pack' | 'single' | 'ticket' | 'addon';
export type PurchaseStatus = 'active' | 'expired' | 'used' | 'refunded';

export interface PurchasedService {
  id: string;
  title: string;
  type: PurchaseType;
  status: PurchaseStatus;
  qtyTotal: number;
  qtyLeft: number;
  validFrom: string;
  validTo: string;
  expiringSoon: boolean; // within 7 days
}
