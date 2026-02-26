import { http, HttpResponse, delay } from 'msw';
import { MOCK_MEMBERSHIP } from '../data/membership';

export const membershipHandlers = [
  http.get('*/me/membership', async () => {
    await delay(400);
    return HttpResponse.json(MOCK_MEMBERSHIP);
  }),
];
