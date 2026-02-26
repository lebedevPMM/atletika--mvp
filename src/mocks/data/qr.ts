import type { QRPass } from '@/features/qr/types';

export function generateMockQRPass(): QRPass {
  return {
    id: `qr-${Date.now()}`,
    payload: `ATLETIKA:${Date.now()}:MEMBER:mem-001:SIGN:${Math.random().toString(36).slice(2)}`,
    expiresAt: new Date(Date.now() + 60_000).toISOString(), // expires in 60s
    memberName: 'Иван Петров',
    clubName: 'Atletika Премиум',
    membershipStatus: 'active',
  };
}
