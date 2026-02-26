import { http, HttpResponse, delay } from 'msw';
import { MOCK_CLIENT, MOCK_TRAINER, MOCK_CLUBS, VALID_OTP } from '../data/users';

export const authHandlers = [
  // Request OTP
  http.post('*/auth/otp/request', async ({ request }) => {
    await delay(300);
    const body = await request.json() as { phone: string };
    if (!body.phone || body.phone.length < 10) {
      return HttpResponse.json(
        { code: 'INVALID_PHONE', message: 'Некорректный номер' },
        { status: 400 },
      );
    }
    return HttpResponse.json({
      requestId: 'otp-req-001',
      expiresAt: new Date(Date.now() + 120_000).toISOString(),
      codeLength: 4,
    });
  }),

  // Verify OTP
  http.post('*/auth/otp/verify', async ({ request }) => {
    await delay(400);
    const body = await request.json() as { phone: string; code: string; requestId: string };

    if (body.code !== VALID_OTP) {
      return HttpResponse.json(
        { code: 'INVALID_OTP', message: 'Неверный код' },
        { status: 400 },
      );
    }

    const isTrainer = body.phone === MOCK_TRAINER.phone;
    const user = isTrainer ? MOCK_TRAINER : MOCK_CLIENT;

    return HttpResponse.json({
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      user,
      clubs: MOCK_CLUBS,
      firstLogin: false,
      docsUpdated: false,
    });
  }),

  // Logout
  http.post('*/auth/logout', async () => {
    await delay(200);
    return new HttpResponse(null, { status: 204 });
  }),
];
