import { http, HttpResponse, delay } from 'msw';
import type { ClubConfig, ChatMessage } from '@/features/club/types';
import {
  MOCK_CLUB_DETAILS,
  MOCK_TEAM,
  MOCK_NEWS,
  MOCK_CHAT_MESSAGES,
  MOCK_NOTIFICATIONS,
} from '../data/club-details';

const MOCK_CLUB_LIST = [
  {
    id: 'club-001',
    name: 'Атлетика+ Центральный',
    address: 'ул. Центральная, 10',
    logoUrl: undefined,
    branches: [
      { id: 'branch-001', name: 'Основной зал', address: 'ул. Центральная, 10' },
    ],
  },
];

const MOCK_CONFIG: ClubConfig = {
  spaEnabled: true,
  eventsEnabled: true,
  chatEnabled: true,
  freezeEnabled: true,
  cancelPolicyMinutes: 120,
  maxBookingsPerDay: 3,
};

let chatMessages = [...MOCK_CHAT_MESSAGES];
let nextMsgId = 6;
const notifications = [...MOCK_NOTIFICATIONS];

export const clubHandlers = [
  http.get('*/me/clubs', async () => {
    await delay(300);
    return HttpResponse.json(MOCK_CLUB_LIST);
  }),

  http.post('*/me/club-context', async () => {
    await delay(200);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('*/club/config', async () => {
    await delay(400);
    return HttpResponse.json(MOCK_CONFIG);
  }),

  // S8: Club details
  http.get('*/club/details', async () => {
    await delay(300);
    return HttpResponse.json(MOCK_CLUB_DETAILS);
  }),

  // S8: Club team (member detail must come before list route)
  http.get('*/club/team/:memberId', async ({ params }) => {
    await delay(200);
    const member = MOCK_TEAM.find((m) => m.id === params.memberId);
    if (!member) return HttpResponse.json({ code: 'NOT_FOUND' }, { status: 404 });
    return HttpResponse.json(member);
  }),

  http.get('*/club/team', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const role = url.searchParams.get('role');
    const filtered = role ? MOCK_TEAM.filter((m) => m.role === role) : MOCK_TEAM;
    return HttpResponse.json(filtered);
  }),

  // S8: Club news (detail must come before list)
  http.get('*/club/news/:newsId', async ({ params }) => {
    await delay(200);
    const item = MOCK_NEWS.find((n) => n.id === params.newsId);
    if (!item) return HttpResponse.json({ code: 'NOT_FOUND' }, { status: 404 });
    return HttpResponse.json(item);
  }),

  http.get('*/club/news', async () => {
    await delay(300);
    return HttpResponse.json(MOCK_NEWS);
  }),

  // S8: Chat
  http.get('*/chat/messages', async () => {
    await delay(300);
    return HttpResponse.json(chatMessages);
  }),

  http.post('*/chat/messages', async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as { trainerId: string; text: string };
    const msg: ChatMessage = {
      id: `msg-${String(nextMsgId++).padStart(3, '0')}`,
      senderId: 'me',
      senderName: 'Вы',
      senderRole: 'client',
      text: body.text,
      createdAt: new Date().toISOString(),
    };
    chatMessages.push(msg);
    return HttpResponse.json(msg, { status: 201 });
  }),

  // S8: Notifications
  http.get('*/notifications', async () => {
    await delay(300);
    return HttpResponse.json(notifications);
  }),

  http.post('*/notifications/:notifId/read', async ({ params }) => {
    await delay(200);
    const idx = notifications.findIndex((n) => n.id === params.notifId);
    if (idx !== -1) notifications[idx] = { ...notifications[idx], isRead: true };
    return new HttpResponse(null, { status: 204 });
  }),

  http.post('*/notifications/read-all', async () => {
    await delay(200);
    notifications.forEach((n, i) => {
      notifications[i] = { ...n, isRead: true };
    });
    return new HttpResponse(null, { status: 204 });
  }),
];
