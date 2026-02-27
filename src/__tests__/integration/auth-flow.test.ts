/**
 * Integration test: Auth Flow
 *
 * Verifies the complete login sequence:
 *   requestOtp -> verifyOtp -> getMyClubs -> selectClub -> getConfig -> dashboard
 *
 * Each step mocks the api client responses in sequence and asserts that
 * the correct endpoints are called with the expected arguments in the right order.
 */

jest.mock('@/shared/api/client', () => ({
  api: {
    get: jest.fn().mockResolvedValue({}),
    post: jest.fn().mockResolvedValue({}),
  },
}));

import { api } from '@/shared/api/client';
import { authApi } from '@/features/auth/api';
import { clubApi } from '@/features/club/api';
import type { OtpRequestResponse, OtpVerifyResponse, AuthUser } from '@/features/auth/types';
import type { Club, ClubConfig } from '@/features/club/types';

const mockGet = api.get as jest.Mock;
const mockPost = api.post as jest.Mock;

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const PHONE = '+79001234567';
const OTP_CODE = '1234';
const REQUEST_ID = 'req-abc-123';

const otpRequestResponse: OtpRequestResponse = {
  requestId: REQUEST_ID,
  expiresAt: '2026-03-01T12:05:00Z',
  codeLength: 4,
};

const mockUser: AuthUser = {
  id: 'user-1',
  phone: PHONE,
  role: 'client',
  firstName: 'Ivan',
  lastName: 'Petrov',
};

const otpVerifyResponse: OtpVerifyResponse = {
  accessToken: 'jwt-access-token',
  refreshToken: 'jwt-refresh-token',
  user: mockUser,
  clubs: [{ id: 'club-1', name: 'Atletika Gym', branchId: 'branch-1' }],
  firstLogin: false,
  docsUpdated: false,
};

const myClubs: Club[] = [
  {
    id: 'club-1',
    name: 'Atletika Gym',
    address: 'ul. Sportivnaya 1',
    branches: [{ id: 'branch-1', name: 'Main', address: 'ul. Sportivnaya 1' }],
  },
];

const clubConfig: ClubConfig = {
  spaEnabled: true,
  eventsEnabled: true,
  chatEnabled: false,
  freezeEnabled: true,
  cancelPolicyMinutes: 120,
  maxBookingsPerDay: 3,
};

const dashboardData = {
  nextBooking: null,
  membership: { name: 'Premium', validUntil: '2026-12-31', remainingVisits: 20, totalVisits: 30 },
  billing: { openInvoices: 0, totalDue: 0, currency: 'RUB' },
  bonus: null,
  promos: [],
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Auth Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('completes the full login -> OTP -> club selection -> dashboard flow', async () => {
    // Step 1: Request OTP
    mockPost.mockResolvedValueOnce(otpRequestResponse);

    const otpResult = await authApi.requestOtp(PHONE);

    expect(mockPost).toHaveBeenCalledWith('auth/otp/request', { phone: PHONE });
    expect(otpResult).toEqual(otpRequestResponse);
    expect(otpResult.requestId).toBe(REQUEST_ID);
    expect(otpResult.codeLength).toBe(4);

    // Step 2: Verify OTP
    mockPost.mockResolvedValueOnce(otpVerifyResponse);

    const verifyResult = await authApi.verifyOtp(PHONE, OTP_CODE, REQUEST_ID);

    expect(mockPost).toHaveBeenCalledWith('auth/otp/verify', {
      phone: PHONE,
      code: OTP_CODE,
      requestId: REQUEST_ID,
    });
    expect(verifyResult.accessToken).toBe('jwt-access-token');
    expect(verifyResult.refreshToken).toBe('jwt-refresh-token');
    expect(verifyResult.user).toEqual(mockUser);
    expect(verifyResult.clubs).toHaveLength(1);

    // Step 3: Fetch available clubs
    mockGet.mockResolvedValueOnce(myClubs);

    const clubs = await clubApi.getMyClubs();

    expect(mockGet).toHaveBeenCalledWith('me/clubs');
    expect(clubs).toHaveLength(1);
    expect(clubs[0].id).toBe('club-1');

    // Step 4: Select club + branch
    mockPost.mockResolvedValueOnce(undefined); // 204 no content

    await clubApi.selectClub('club-1', 'branch-1');

    expect(mockPost).toHaveBeenCalledWith('me/club-context', {
      clubId: 'club-1',
      branchId: 'branch-1',
    });

    // Step 5: Fetch club config
    mockGet.mockResolvedValueOnce(clubConfig);

    const config = await clubApi.getConfig();

    expect(mockGet).toHaveBeenCalledWith('club/config');
    expect(config.maxBookingsPerDay).toBe(3);
    expect(config.spaEnabled).toBe(true);

    // Step 6: Load dashboard (home screen)
    mockGet.mockResolvedValueOnce(dashboardData);

    const dashboard = await api.get('home/dashboard');

    expect(mockGet).toHaveBeenCalledWith('home/dashboard');
    expect(dashboard).toEqual(dashboardData);

    // Verify total call counts
    expect(mockPost).toHaveBeenCalledTimes(3); // requestOtp, verifyOtp, selectClub
    expect(mockGet).toHaveBeenCalledTimes(3);  // getMyClubs, getConfig, dashboard
  });

  it('handles OTP request failure gracefully', async () => {
    mockPost.mockRejectedValueOnce(new Error('Network error'));

    await expect(authApi.requestOtp(PHONE)).rejects.toThrow('Network error');
    expect(mockPost).toHaveBeenCalledWith('auth/otp/request', { phone: PHONE });
    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  it('handles invalid OTP code rejection', async () => {
    // Step 1: Request OTP succeeds
    mockPost.mockResolvedValueOnce(otpRequestResponse);
    await authApi.requestOtp(PHONE);

    // Step 2: Verify OTP fails (wrong code)
    mockPost.mockRejectedValueOnce(new Error('Invalid OTP code'));

    await expect(
      authApi.verifyOtp(PHONE, '0000', REQUEST_ID),
    ).rejects.toThrow('Invalid OTP code');

    expect(mockPost).toHaveBeenCalledTimes(2);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('handles user with no clubs', async () => {
    // OTP flow succeeds
    mockPost.mockResolvedValueOnce(otpRequestResponse);
    await authApi.requestOtp(PHONE);

    const responseNoClubs: OtpVerifyResponse = {
      ...otpVerifyResponse,
      clubs: [],
    };
    mockPost.mockResolvedValueOnce(responseNoClubs);
    const verifyResult = await authApi.verifyOtp(PHONE, OTP_CODE, REQUEST_ID);

    expect(verifyResult.clubs).toHaveLength(0);

    // Fetch clubs returns empty list
    mockGet.mockResolvedValueOnce([]);
    const clubs = await clubApi.getMyClubs();

    expect(clubs).toHaveLength(0);
  });

  it('calls logout endpoint correctly', async () => {
    mockPost.mockResolvedValueOnce(undefined);

    await authApi.logout();

    expect(mockPost).toHaveBeenCalledWith('auth/logout');
    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  it('links requestId from OTP request to OTP verify call', async () => {
    // This test verifies that the requestId returned by requestOtp
    // is correctly passed to verifyOtp, ensuring the two-step flow is linked.
    const dynamicRequestId = 'req-dynamic-456';
    mockPost.mockResolvedValueOnce({
      ...otpRequestResponse,
      requestId: dynamicRequestId,
    });

    const otpResult = await authApi.requestOtp(PHONE);
    const returnedRequestId = otpResult.requestId;

    mockPost.mockResolvedValueOnce(otpVerifyResponse);
    await authApi.verifyOtp(PHONE, OTP_CODE, returnedRequestId);

    expect(mockPost).toHaveBeenNthCalledWith(2, 'auth/otp/verify', {
      phone: PHONE,
      code: OTP_CODE,
      requestId: dynamicRequestId,
    });
  });
});
