export type AnalyticsEvent =
  | { name: 'screen_view'; params: { screen: string; source?: string } }
  | { name: 'booking_create_click'; params: { slotId: string; serviceType: string } }
  | { name: 'booking_create_result'; params: { success: boolean; reason?: string } }
  | { name: 'billing_pay_click'; params: { method: 'card' | 'sbp'; invoiceId: string } }
  | { name: 'billing_pay_result'; params: { success: boolean; method: string; amount: number } }
  | { name: 'auth_otp_request'; params: { phone: string } }
  | { name: 'auth_otp_verify'; params: { success: boolean } }
  | { name: 'club_select'; params: { clubId: string } }
  | { name: string; params: Record<string, unknown> };
