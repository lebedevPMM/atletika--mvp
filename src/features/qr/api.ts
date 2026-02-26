import { api } from '@/shared/api/client';
import type { QRPass } from './types';

export const qrApi = {
  getPass: () => api.get<QRPass>('me/qr-pass'),
};
