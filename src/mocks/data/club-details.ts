import type { ClubDetails, TeamMember, NewsItem, ChatMessage, NotificationItem } from '@/features/club/types';

export const MOCK_CLUB_DETAILS: ClubDetails = {
  id: 'club-001',
  name: 'Атлетика+ Центральный',
  address: 'ул. Спортивная, 15, Москва',
  phone: '+7 (495) 123-45-67',
  email: 'info@atletika.ru',
  hours: 'Пн-Пт: 6:00-23:00, Сб-Вс: 8:00-22:00',
  description:
    'Atletika — сеть фитнес-клубов премиум-класса. Более 50 000 м² спортивных площадей, бассейн, SPA-зона, персональные тренировки и групповые программы.',
  features: ['Тренажёрный зал', 'Бассейн', 'СПА', 'Групповые', 'Сауна', 'Парковка'],
  socialLinks: [
    { type: 'telegram', url: 'https://t.me/atletika' },
    { type: 'whatsapp', url: 'https://wa.me/74951234567' },
    { type: 'vk', url: 'https://vk.com/atletika' },
  ],
  coordinates: { lat: 55.7558, lng: 37.6173 },
};

export const MOCK_TEAM: TeamMember[] = [
  {
    id: 'tm-001',
    name: 'Игорь Смирнов',
    role: 'trainer',
    specialization: 'Силовые тренировки',
    rating: 4.8,
    experience: '10 лет',
    bio: 'Мастер спорта по тяжёлой атлетике. Специализация — силовой тренинг и функциональная подготовка.',
    certifications: ['NSCA-CPT', 'FPA'],
  },
  {
    id: 'tm-002',
    name: 'Анна Петрова',
    role: 'instructor',
    specialization: 'Йога и пилатес',
    rating: 4.9,
    experience: '8 лет',
    bio: 'Сертифицированный инструктор йоги (RYT-500). Ведёт хатха-йогу, виньясу и восстановительные практики.',
    certifications: ['RYT-500', 'Pilates Mat'],
  },
  {
    id: 'tm-003',
    name: 'Дмитрий Козлов',
    role: 'trainer',
    specialization: 'Кардио и HIIT',
    rating: 4.7,
    experience: '6 лет',
    bio: 'Специалист по функциональному тренингу и кардио-нагрузкам. Бывший профессиональный легкоатлет.',
    certifications: ['ACE-CPT'],
  },
  {
    id: 'tm-004',
    name: 'Елена Волкова',
    role: 'spa',
    specialization: 'Спортивный массаж',
    rating: 4.9,
    experience: '12 лет',
    bio: 'Дипломированный массажист с медицинским образованием. Спортивный, лечебный и релакс-массаж.',
  },
  {
    id: 'tm-005',
    name: 'Мария Соколова',
    role: 'manager',
    specialization: 'Администрация',
    rating: 5.0,
    experience: '5 лет',
    bio: 'Администратор клуба. Решает вопросы абонементов, записей и обратной связи.',
  },
  {
    id: 'tm-006',
    name: 'Алексей Новиков',
    role: 'trainer',
    specialization: 'Кроссфит',
    rating: 4.6,
    experience: '4 года',
    bio: 'Сертифицированный тренер CrossFit L2. Групповые и персональные тренировки.',
    certifications: ['CrossFit L2'],
  },
];

const now = Date.now();

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'news-001',
    title: 'Новое расписание групповых тренировок',
    summary: 'С 1 марта обновлённое расписание: добавлены утренние занятия и новые направления.',
    body: 'Уважаемые клиенты! С 1 марта 2026 года мы обновляем расписание групповых тренировок.\n\nНовинки:\n- Утренняя йога (7:00) — мягкое пробуждение\n- TRX-тренировка (12:00) — для продвинутых\n- Stretching (21:00) — вечернее расслабление\n\nСтарые занятия сохранены. Полное расписание — в приложении.',
    category: 'news',
    publishedAt: new Date(now - 3_600_000).toISOString(), // 1 час назад
    isRead: false,
  },
  {
    id: 'news-002',
    title: 'Скидка 20% на персональные тренировки',
    summary: 'Весь март — персональные тренировки со скидкой. Количество мест ограничено!',
    body: 'Весенняя акция!\n\nВесь март при покупке пакета от 10 персональных тренировок — скидка 20%.\n\nУсловия:\n- Пакеты от 10 занятий\n- Действует на всех тренеров\n- Срок использования — 3 месяца\n- Количество мест ограничено\n\nЗаписывайтесь у администратора или в приложении.',
    category: 'promo',
    publishedAt: new Date(now - 86_400_000).toISOString(), // 1 день назад
    isRead: true,
  },
  {
    id: 'news-003',
    title: 'Открытая тренировка с чемпионом',
    summary: 'В субботу — открытая тренировка с мастером спорта. Вход свободный для всех клиентов.',
    body: 'Приглашаем на открытую тренировку!\n\nДата: суббота, 8 марта\nВремя: 11:00–13:00\nМесто: Основной зал\nТренер: Игорь Смирнов (мастер спорта)\n\nПрограмма:\n- Разминка и функциональная подготовка\n- Техника базовых упражнений\n- Мини-соревнование\n- Фото и автограф-сессия\n\nВход свободный для всех клиентов клуба.',
    category: 'event',
    publishedAt: new Date(now - 172_800_000).toISOString(), // 2 дня назад
    isRead: false,
  },
  {
    id: 'news-004',
    title: 'Ремонт раздевалок завершён',
    summary: 'Мужская и женская раздевалки полностью обновлены. Новые шкафчики и душевые.',
    body: 'Рады сообщить, что ремонт раздевалок завершён!\n\nЧто нового:\n- Новые шкафчики с электронными замками\n- Обновлённые душевые кабины\n- Зона сушки волос\n- Бесплатные полотенца\n\nСпасибо за терпение во время ремонта!',
    category: 'news',
    publishedAt: new Date(now - 432_000_000).toISOString(), // 5 дней назад
    isRead: true,
  },
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-001',
    senderId: 'tm-001',
    senderName: 'Игорь Смирнов',
    senderRole: 'trainer',
    text: 'Привет! Как прошла тренировка? Мышцы не болят?',
    createdAt: new Date(now - 7_200_000).toISOString(),
  },
  {
    id: 'msg-002',
    senderId: 'me',
    senderName: 'Вы',
    senderRole: 'client',
    text: 'Привет! Всё хорошо, немного ноги болят после приседаний 😄',
    createdAt: new Date(now - 6_600_000).toISOString(),
  },
  {
    id: 'msg-003',
    senderId: 'tm-001',
    senderName: 'Игорь Смирнов',
    senderRole: 'trainer',
    text: 'Это нормально, крепатура пройдёт через день-два. В следующий раз попробуем увеличить вес. На среду записаны?',
    createdAt: new Date(now - 6_000_000).toISOString(),
  },
  {
    id: 'msg-004',
    senderId: 'me',
    senderName: 'Вы',
    senderRole: 'client',
    text: 'Да, на 14:00. Жду!',
    createdAt: new Date(now - 5_400_000).toISOString(),
  },
  {
    id: 'msg-005',
    senderId: 'system',
    senderName: 'Система',
    senderRole: 'system',
    text: 'Запись на персональную тренировку подтверждена: среда, 14:00',
    createdAt: new Date(now - 5_000_000).toISOString(),
  },
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-001',
    type: 'booking',
    title: 'Напоминание о тренировке',
    body: 'Силовая тренировка через 1 час (09:00, Зал A)',
    isRead: false,
    createdAt: new Date(now - 1_800_000).toISOString(),
  },
  {
    id: 'notif-002',
    type: 'promo',
    title: 'Скидка 20% на персональные',
    body: 'Весенняя акция на пакеты от 10 занятий. Подробнее в новостях.',
    isRead: false,
    createdAt: new Date(now - 43_200_000).toISOString(),
  },
  {
    id: 'notif-003',
    type: 'chat',
    title: 'Новое сообщение от тренера',
    body: 'Игорь Смирнов: «Привет! Как прошла тренировка?»',
    isRead: true,
    createdAt: new Date(now - 7_200_000).toISOString(),
  },
  {
    id: 'notif-004',
    type: 'system',
    title: 'Обновление расписания',
    body: 'С 1 марта обновлённое расписание групповых тренировок.',
    isRead: true,
    createdAt: new Date(now - 86_400_000).toISOString(),
  },
  {
    id: 'notif-005',
    type: 'booking',
    title: 'Запись подтверждена',
    body: 'Персональная тренировка: среда, 14:00, Игорь Смирнов',
    isRead: true,
    createdAt: new Date(now - 172_800_000).toISOString(),
  },
  {
    id: 'notif-006',
    type: 'system',
    title: 'Ремонт раздевалок завершён',
    body: 'Мужская и женская раздевалки полностью обновлены.',
    isRead: true,
    createdAt: new Date(now - 432_000_000).toISOString(),
  },
];
