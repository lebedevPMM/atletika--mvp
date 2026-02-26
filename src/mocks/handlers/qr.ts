import { http, HttpResponse, delay } from 'msw';
import { generateMockQRPass } from '../data/qr';

export const qrHandlers = [
  http.get('*/me/qr-pass', async () => {
    await delay(300);
    return HttpResponse.json(generateMockQRPass());
  }),
];
