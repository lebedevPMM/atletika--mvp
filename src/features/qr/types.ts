export interface QRPass {
  id: string;
  payload: string; // Base64 or signed string for QR
  expiresAt: string; // ISO date — QR refreshes before this
  memberName: string;
  clubName: string;
  membershipStatus: 'active' | 'expired' | 'frozen';
}
