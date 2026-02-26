export interface AuthUser {
  id: string;
  phone: string;
  role: 'client' | 'trainer';
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export interface OtpRequestResponse {
  requestId: string;
  expiresAt: string;
  codeLength: number;
}

export interface OtpVerifyResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  clubs: Array<{ id: string; name: string; branchId?: string }>;
  firstLogin: boolean;
  docsUpdated: boolean;
}
