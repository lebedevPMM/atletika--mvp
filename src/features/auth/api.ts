import { api } from '@/shared/api/client';
import type { OtpRequestResponse, OtpVerifyResponse } from './types';

export const authApi = {
  requestOtp: (phone: string) =>
    api.post<OtpRequestResponse>('auth/otp/request', { phone }),
  verifyOtp: (phone: string, code: string, requestId: string) =>
    api.post<OtpVerifyResponse>('auth/otp/verify', { phone, code, requestId }),
  logout: () =>
    api.post<void>('auth/logout'),
};
