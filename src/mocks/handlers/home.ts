import { http, HttpResponse, delay } from 'msw';
import { MOCK_DASHBOARD } from '../data/home';

export const homeHandlers = [
  http.get('*/home/dashboard', async () => {
    await delay(500);
    return HttpResponse.json(MOCK_DASHBOARD);
  }),
];
