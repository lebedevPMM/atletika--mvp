export const MOCK_DASHBOARD = {
  nextBooking: {
    id: 'bk-001',
    title: 'Групповая тренировка',
    date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    time: '10:00',
    trainer: 'Игорь Смирнов',
    room: 'Зал A',
  },
  membership: {
    name: 'Премиум',
    validUntil: new Date(Date.now() + 30 * 86400000).toISOString(),
    remainingVisits: 18,
    totalVisits: 24,
  },
  billing: {
    openInvoices: 1,
    totalDue: 5500,
    currency: 'RUB',
  },
  bonus: {
    balance: 1200,
    level: 'Серебро',
    nextLevel: 'Золото',
    pointsToNext: 800,
  },
  promos: [
    {
      id: 'promo-001',
      title: 'Приведи друга',
      description: 'Получите 500 бонусов за каждого приглашенного друга',
      imageUrl: undefined,
    },
    {
      id: 'promo-002',
      title: 'Летняя акция',
      description: 'Скидка 20% на SPA-процедуры до конца месяца',
      imageUrl: undefined,
    },
  ],
};
