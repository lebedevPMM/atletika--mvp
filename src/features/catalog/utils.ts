import type { PurchaseStatus, PurchaseType } from './types';

export function getPurchaseTypeLabel(type: PurchaseType): string {
  switch (type) {
    case 'pt_pack': return 'ПТ';
    case 'spa_pack': return 'СПА';
    case 'single': return 'Разовая';
    case 'ticket': return 'Билет';
    case 'addon': return 'Доп. опция';
  }
}

export function isPurchaseActive(status: PurchaseStatus): boolean {
  return status === 'active';
}

export function getPurchaseProgress(left: number, total: number): number {
  if (total === 0) return 0;
  return left / total;
}

export function isExpiringSoon(validTo: string, daysThreshold: number = 7): boolean {
  const diff = new Date(validTo).getTime() - Date.now();
  return diff > 0 && diff <= daysThreshold * 86400000;
}
