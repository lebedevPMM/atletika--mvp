import type { TrainerProfile, TrainerClientPlan, TrainerDaySummary, TrainerClientProgress, TrainerNotification } from '@/features/trainer/types';
import type { Review } from '@/features/reviews/types';
import type { AchievementsSummary } from '@/features/achievements/types';
import type { WorkoutPlan } from '@/features/workout/types';

export const MOCK_TRAINER_PROFILE: TrainerProfile = {
  id: 'trainer-1',
  firstName: 'Игорь',
  lastName: 'Смирнов',
  phone: '+7 999 123-45-67',
  email: 'igor@gym.ru',
  avatarUrl: null,
  bio: 'Сертифицированный фитнес-тренер с 8-летним опытом. Специализация: силовые тренировки, HIIT, функциональный тренинг.',
  specializations: ['Силовые', 'HIIT', 'Functional'],
  certifications: ['NSCA-CPT', 'ACE', 'FPA'],
};

export const MOCK_CLIENT_PLAN: TrainerClientPlan = {
  id: 'plan-1',
  clientId: 'client-1',
  clientName: 'Анна Петрова',
  period: '01.03 — 31.03',
  frequency: '3 раза/неделю',
  days: [
    { day: 'Пн', title: 'Верхняя часть тела', exercises: ['Жим лёжа 4×10', 'Тяга верхнего блока 3×12', 'Подъемы на бицепс 3×15'] },
    { day: 'Ср', title: 'Нижняя часть тела', exercises: ['Приседания 4×12', 'Выпады 3×15', 'Жим ногами 3×12'] },
    { day: 'Пт', title: 'Full Body + Cardio', exercises: ['Deadlift 3×8', 'Отжимания 3×20', 'HIIT 15 мин'] },
  ],
};

export const MOCK_DAY_SUMMARY: TrainerDaySummary = {
  date: new Date().toISOString().split('T')[0],
  sessionsCount: 6,
  clientsCount: 18,
  cancellations: 2,
  startTime: '08:00',
  endTime: '21:45',
  durationMinutes: 825,
  sessions: [
    { id: 's1', time: '10:00', title: 'HIIT', type: 'group', attendeeCount: 12, completed: true, cancelled: false },
    { id: 's2', time: '11:30', title: 'ПТ: Анна П.', type: 'pt', completed: true, cancelled: false },
    { id: 's3', time: '14:00', title: 'Yoga Flow', type: 'group', attendeeCount: 8, completed: true, cancelled: false },
    { id: 's4', time: '15:30', title: 'ПТ: Иван К.', type: 'pt', completed: false, cancelled: true },
    { id: 's5', time: '17:00', title: 'Functional', type: 'group', attendeeCount: 15, completed: true, cancelled: false },
    { id: 's6', time: '19:00', title: 'ПТ: Мария Д.', type: 'pt', completed: true, cancelled: false },
  ],
};

export const MOCK_CLIENT_PROGRESS: TrainerClientProgress = {
  clientId: 'client-1',
  clientName: 'Анна Петрова',
  visitsPerWeek: 2.8,
  visitsTrend: 15,
  metrics: [
    { label: 'Вес', startValue: '72 кг', currentValue: '70 кг', change: '-2', improved: true },
    { label: 'Жим', startValue: '60 кг', currentValue: '70 кг', change: '+10', improved: true },
    { label: 'Присед', startValue: '80 кг', currentValue: '95 кг', change: '+15', improved: true },
    { label: 'Бег 5км', startValue: '28:30', currentValue: '26:15', change: '-2:15', improved: true },
  ],
  notes: [
    { id: 'n1', date: '2026-02-15', text: 'Хорошая динамика, увеличиваем веса' },
    { id: 'n2', date: '2026-02-08', text: 'Увеличили нагрузку на верхнюю часть тела' },
  ],
};

export const MOCK_TRAINER_NOTIFICATIONS: TrainerNotification[] = [
  { id: 'tn1', type: 'cancellation', title: 'Отмена: Иван К.', body: '15:30 ПТ отменена (30 мин назад)', time: new Date(Date.now() - 30 * 60000).toISOString(), read: false },
  { id: 'tn2', type: 'new_booking', title: 'Новая запись', body: 'Мария Д. записалась на ПТ. Завтра, 11:00', time: new Date(Date.now() - 2 * 3600000).toISOString(), read: true },
  { id: 'tn3', type: 'report', title: 'Еженедельный отчет', body: '18 занятий, 12 клиентов', time: new Date(Date.now() - 24 * 3600000).toISOString(), read: true },
  { id: 'tn4', type: 'system', title: 'Обновление расписания', body: 'Зал B закрыт на ремонт 5-7 марта', time: new Date(Date.now() - 48 * 3600000).toISOString(), read: true },
];

export const MOCK_REVIEWS: Review[] = [
  { id: 'r1', authorName: 'Анна П.', rating: 5, text: 'Отличный тренер! Всегда находит подход.', date: new Date(Date.now() - 2 * 86400000).toISOString(), trainerName: 'Игорь С.', type: 'trainer' },
  { id: 'r2', authorName: 'Дмитрий К.', rating: 4, text: 'Хорошее занятие, но хотелось бы больше упражнений на растяжку.', date: new Date(Date.now() - 5 * 86400000).toISOString(), className: 'HIIT', type: 'class' },
  { id: 'r3', authorName: 'Мария Д.', rating: 5, text: 'Прекрасный клуб! Чисто, современное оборудование.', date: new Date(Date.now() - 7 * 86400000).toISOString(), type: 'club' },
  { id: 'r4', authorName: 'Иван С.', rating: 3, text: 'Занятие неплохое, но тренер опоздал на 5 минут.', date: new Date(Date.now() - 10 * 86400000).toISOString(), className: 'Yoga Flow', type: 'class' },
];

export const MOCK_ACHIEVEMENTS: AchievementsSummary = {
  total: 45,
  unlocked: 12,
  achievements: [
    { id: 'a1', title: 'Первая неделя', description: '3 тренировки за неделю', icon: '\uD83C\uDFC6', status: 'unlocked', unlockedAt: '2026-02-20T10:00:00Z', category: 'streak' },
    { id: 'a2', title: 'Огненная серия', description: '5 тренировок подряд', icon: '\uD83D\uDD25', status: 'unlocked', unlockedAt: '2026-02-18T15:00:00Z', category: 'streak' },
    { id: 'a3', title: 'Марафонец', description: '20 тренировок за месяц', icon: '\uD83C\uDFAF', status: 'in_progress', progress: 14, target: 20, category: 'total' },
    { id: 'a4', title: 'Ранняя пташка', description: '10 утренних тренировок', icon: '\uD83C\uDF05', status: 'in_progress', progress: 6, target: 10, category: 'time' },
    { id: 'a5', title: 'Первый отзыв', description: 'Оставить первый отзыв', icon: '\u2B50', status: 'unlocked', unlockedAt: '2026-02-25T12:00:00Z', category: 'social' },
    { id: 'a6', title: 'Разносторонний', description: 'Попробовать 5 разных типов', icon: '\uD83C\uDFAF', status: 'in_progress', progress: 3, target: 5, category: 'variety' },
    { id: 'a7', title: '???', description: 'Секретное достижение', icon: '\uD83D\uDD12', status: 'secret', category: 'secret' },
    { id: 'a8', title: 'Сотня', description: '100 тренировок', icon: '\uD83D\uDCAF', status: 'locked', progress: 42, target: 100, category: 'total' },
  ],
};

export const MOCK_WORKOUT_PLAN: WorkoutPlan = {
  id: 'wp-1',
  bookingId: 'booking-1',
  exercises: [
    { id: 'ex1', name: 'Разминка', sets: 1, durationMinutes: 5, status: 'completed', completedSets: 1 },
    { id: 'ex2', name: 'Приседания', sets: 4, reps: 12, status: 'completed', completedSets: 4, weight: 60 },
    { id: 'ex3', name: 'Жим лёжа', sets: 4, reps: 10, status: 'active', completedSets: 2, weight: 70 },
    { id: 'ex4', name: 'Тяга верхнего блока', sets: 3, reps: 12, status: 'pending', completedSets: 0, weight: 50 },
    { id: 'ex5', name: 'Подъемы на бицепс', sets: 3, reps: 15, status: 'pending', completedSets: 0, weight: 12 },
    { id: 'ex6', name: 'Заминка / Stretching', sets: 1, durationMinutes: 10, status: 'pending', completedSets: 0 },
  ],
};
