export interface BonusBalance {
  total: number;
  pending: number; // бонусы в ожидании подтверждения
}

export type BonusTransactionType = 'accrual' | 'redemption' | 'expiry' | 'referral';

export interface BonusTransaction {
  id: string;
  type: BonusTransactionType;
  amount: number; // positive for accrual, negative for redemption/expiry
  description: string;
  createdAt: string;
}
