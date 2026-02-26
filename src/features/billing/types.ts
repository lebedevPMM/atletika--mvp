export type PaymentMethod = 'card' | 'sbp';
export type InvoiceStatus = 'open' | 'paid' | 'overdue' | 'cancelled';
export type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed';

export interface Invoice {
  id: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  dueDate: string;
  createdAt: string;
  paidAt?: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

export interface PaymentIntent {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  // Card-specific
  confirmationUrl?: string; // 3DS redirect URL
  // SBP-specific
  qrUrl?: string;
  qrPayload?: string;
}
