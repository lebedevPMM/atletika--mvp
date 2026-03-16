# Фитнес-Карта Клиента (ClientCard) — Design Document

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Создать центральную сущность "Карточка клиента" — единую точку правды по клиенту для всех 3 ролей (клиент, тренер, методист).

**Architecture:** Композитная сущность — тонкий агрегат (loaded immediately) + lazy sub-resources (loaded per tab/section). Модели прошли валидацию через 3 параллельных ревью: PRD (product-writer), архитектура (backend-architect), фронтенд (frontend-developer).

**Tech Stack:** React + Vite + TypeScript + Tailwind CSS + Recharts. Mock data (no backend). Theme-aware (CSS variables `t-*`).

**Source:** `Приложение.pdf` (схема тренер-клиент-методист) + 82 PDF спецификаций в `requirements/`

---

## 1. Валидация: что изменилось после ревью

| Исходный дизайн | Проблема | Решение |
|---|---|---|
| HealthProfile.checkupDate/Status/anamnesis/healthGroup | 4 поля НЕ в спецификациях (YAGNI) | Удалены. Заменены на реальные поля из requirements |
| FitnessTest[] (целый модуль) | "Не строим детальный трекер упражнений" (L4129) | Убран из MVP1. P2 |
| BodyComposition (биоимпеданс) | Нет в MVP1 specs. Только вес + основные замеры | Понижен до P2. Вес остаётся в BodyMeasurement |
| MethodistNotes[] | Методист только просматривает в MVP1 | Убран. Одна коллекция Notes с authorRole |
| ProgressSummary.fat/muscle/fitnessScore | Нет в specs | Только weight + waist deltas |
| PersonalInfo.goal | В specs goal = часть Plan, не PersonalInfo | Перенесён в TrainingPlan |
| **ОТСУТСТВОВАЛИ** PurchasedServices[] | P0 блок в specs (L5664-5668) | Добавлен |
| **ОТСУТСТВОВАЛИ** UpcomingBookings[] | P0 блок в specs (L5669-5672) | Добавлен |
| **ОТСУТСТВОВАЛИ** Consents/Visibility | P0 safety (L2853-2866) | Добавлен в HealthProfile |
| God Object — всё в одном | Разные lifecycles, write frequency | Thin aggregate + lazy sub-resources |

---

## 2. Финальная модель данных

### 2.1. Branded ID Types

```typescript
// types/client-card.ts

type Brand<T, B extends string> = T & { readonly __brand: B };

export type ClientId = Brand<string, 'ClientId'>;
export type ClubId = Brand<string, 'ClubId'>;
export type CardId = Brand<string, 'CardId'>;
export type TrainerId = Brand<string, 'TrainerId'>;
export type PlanId = Brand<string, 'PlanId'>;
export type ISODateString = string;
```

### 2.2. Aggregate Root (thin — loaded immediately)

```typescript
export type CardStatus = 'active' | 'archived' | 'suspended';

export interface ClientCard {
  id: CardId;
  clientId: ClientId;           // один клиент → много карт (по клубам)
  clubId: ClubId;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  status: CardStatus;

  // Embedded (меняются редко, грузятся всегда)
  personalInfo: PersonalInfo;
  membership: MembershipInfo;
  healthProfile: HealthProfile | null;   // null = не заполнен после продажи

  // Computed summaries (read-only)
  visitSummary: VisitSummary;
  progressSummary: ProgressSummary | null; // null = нет замеров
}
```

### 2.3. PersonalInfo

```typescript
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  phone: string | null;         // опц для тренера
  email: string | null;
  dateOfBirth: string | null;   // ISO date
  gender: 'male' | 'female' | null;
  avatarUrl: string | null;
  tags: ClientTag[];            // ['Новичок', 'ПТ', 'Сколиоз']
  emergencyContact: EmergencyContact | null;
}

export type ClientTag = string; // свободный текст, UI предложит частые

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string | null;
}
```

### 2.4. MembershipInfo

```typescript
export type MembershipStatus = 'active' | 'expired' | 'frozen' | 'pending' | 'cancelled';

export interface MembershipInfo {
  status: MembershipStatus;
  planName: string;
  validFrom: ISODateString;
  validTo: ISODateString | null;  // null = бессрочный
  autoRenew: boolean;
  freezeInfo: FreezeInfo | null;
  limits: ServiceLimits;
}

export interface FreezeInfo {
  frozenAt: ISODateString;
  unfreezeAt: ISODateString;
  reason: string;
}

export interface ServiceLimits {
  ptRemaining: number | null;       // null = безлимит
  ptTotal: number | null;
  groupRemaining: number | null;
  groupTotal: number | null;
  spaRemaining: number | null;
  spaTotal: number | null;
}
```

### 2.5. HealthProfile

```typescript
export interface HealthProfile {
  updatedAt: ISODateString;
  // Противопоказания (structured fields из specs L2844-2846)
  contraindications: string[];       // чекбоксы: сердечно-сосудистые, позвоночник, астма, беременность
  injuries: string[];                // травмы/операции за 12-24 мес
  limitsText: string;                // ограничения (свободный текст)
  medsText: string;                  // лекарства (свободный текст)
  allergiesText: string;             // аллергии (свободный текст)
  // Visibility + consent (L2853-2866)
  visibility: HealthVisibility;
  consentHealthData: boolean;        // согласие на обработку данных здоровья
  // Health sources (small list, changes rarely)
  healthSources: HealthSource[];
}

export interface HealthVisibility {
  showTrainer: boolean;   // default: true
  showMethodist: boolean; // default: true
}

export type HealthSourceProvider = 'apple_health' | 'google_fit' | 'dexbee' | 'myzone';
export type HealthSourceStatus = 'connected' | 'disconnected' | 'error' | 'syncing' | 'permission_denied';

export interface HealthSource {
  provider: HealthSourceProvider;
  status: HealthSourceStatus;
  lastSyncAt: ISODateString | null;
  scopes: string[];           // ['steps', 'heart_rate', 'sleep']
  errorCode: string | null;
}
```

### 2.6. Lazy Sub-Resources

```typescript
// === PurchasedServices (P0) ===
export interface PurchasedService {
  id: string;
  title: string;              // "ПТ с Анной"
  type: 'pt' | 'group' | 'spa' | 'package';
  countLeft: number;
  countTotal: number;
  status: 'active' | 'exhausted' | 'expired';
  validTo: ISODateString | null;
}

// === UpcomingBookings (P0) ===
export interface UpcomingBooking {
  id: string;
  title: string;
  date: ISODateString;
  time: string;               // "19:00"
  type: 'group_class' | 'pt' | 'mini_group' | 'spa';
  trainerName: string | null;
  location: string | null;
  status: 'confirmed' | 'pending' | 'waitlisted';
}

// === BodyMeasurement (P1) ===
export interface BodyMeasurement {
  id: string;
  date: ISODateString;
  weight: number;                   // кг (обязательное)
  chest: number | null;             // см
  waist: number | null;             // см
  hips: number | null;              // см
  measuredBy: TrainerId | 'self';
}

// === TrainingPlan (P1) ===
export interface TrainingPlan {
  id: PlanId;
  title: string;
  goal: string;                     // перенесён сюда из PersonalInfo
  trainerId: TrainerId;
  trainerName: string;
  startAt: ISODateString;
  endAt: ISODateString;
  totalWeeks: number;
  currentWeek: number;
  progressPercent: number;
  checkpoints: Checkpoint[];
}

export interface Checkpoint {
  id: string;
  date: ISODateString;
  type: 'measurement' | 'photo' | 'test';
  status: 'pending' | 'completed' | 'missed';
}

// === VisitRecord (lazy — загружается при открытии истории) ===
export interface VisitRecord {
  id: string;
  date: ISODateString;
  type: 'group_class' | 'pt' | 'mini_group' | 'spa' | 'open_gym';
  title: string;
  trainerName: string | null;
  duration: number | null;          // минуты
  status: 'completed' | 'no_show' | 'canceled';
}

// === ClientNote (unified — фильтр по authorRole) ===
export type NoteAuthorRole = 'trainer' | 'methodist';

export interface ClientNote {
  id: string;
  cardId: CardId;
  authorId: string;
  authorRole: NoteAuthorRole;
  authorName: string;               // denormalized for display
  text: string;
  createdAt: ISODateString;
}
```

### 2.7. Summaries (computed, embedded in root)

```typescript
export interface VisitSummary {
  totalVisits: number;
  visitsLast30Days: number;
  lastVisitDate: ISODateString | null;
  noShowCount: number;
  streak: number;                   // дней подряд
  avgVisitsPerWeek: number;
}

export interface ProgressSummary {
  weightStart: number | null;
  weightCurrent: number | null;
  weightDelta: number | null;       // кг за период
  waistStart: number | null;
  waistCurrent: number | null;
  waistDelta: number | null;        // см за период
  lastMeasurementDate: ISODateString | null;
  trend: 'improving' | 'stable' | 'declining';
}
```

---

## 3. P0 / P1 / P2 Приоритизация

### P0 — Must-Have (реализуем сейчас)

| Модуль | Обоснование |
|---|---|
| PersonalInfo | Идентификация клиента L5632 |
| MembershipInfo + ServiceLimits | "Точка правды" L5624, главный вопрос тренера |
| PurchasedServices[] | L5664-5668, остатки пакетов |
| UpcomingBookings[] | L5669-5672, ближайшие записи |
| HealthProfile (contraindications, visibility, consent) | Safety-блок L2813 |
| ClientNote[] (с authorRole) | L5678-5682, core workflow |
| VisitSummary | L5673-5677, контекст перед занятием |

### P1 — Should-Have (следующий шаг)

| Модуль | Обоснование |
|---|---|
| TrainingPlan + Checkpoints | L4078, если сопровождение = часть ценности |
| BodyMeasurement[] | L4086, L4121, контрольные точки |
| ProgressSummary | L4121-4122, "последнее значение + изменение" |
| HealthSources[] | L2739, "MVP1 минимальный вариант" |

### P2 — Post-MVP1

| Модуль | Обоснование |
|---|---|
| BodyComposition (биоимпеданс) | Не в MVP1 specs |
| FitnessTest[] (батарея тестов) | L4129: "Не строим детальный трекер" |
| Фото до/после | L4123: "MVP2" |
| AI рекомендации | L5324: "MVP3/AI" |

---

## 4. Non-Goals MVP1

1. Детальный трекер упражнений (сеты/повторы/веса)
2. Биоимпеданс-панель
3. Fitness-тест scoring
4. Фото до/после
5. AI рекомендации
6. Ввод данных клиентом ежедневно
7. Медицинские советы и диагнозы
8. Отдельная сущность заметок методиста
9. Редактирование личных данных тренером (через ресепшн)
10. Встроенное расписание в карточку

---

## 5. Экраны

### 5.1. Новые экраны

| Экран | ScreenName | Описание |
|---|---|---|
| **ClientCardScreen** | `client_card` | Хаб карточки для клиента (видит свою карту: план, прогресс, здоровье) |
| **CheckupScreen** | `checkup` | Заполнение анамнеза + противопоказаний (шаг 1 из PDF) |
| **BodyCompositionScreen** | `body_composition` | Биоимпеданс (P2, заглушка) |

### 5.2. Обновляемые экраны

| Экран | Что меняется |
|---|---|
| **TrainerClientProfileScreen** | Подключить к ClientCard types, добавить навигацию к sub-screens, добавить PurchasedServices + UpcomingBookings |
| **TrainerClientProgressScreen** | Использовать BodyMeasurement[] из mock db, расширить графики |
| **TrainerClientAssessmentScreen** | Добавить историю (P2 заглушка) |
| **MeasurementsScreen** | Использовать BodyMeasurement types |
| **ContraindicationsScreen** | Привязать к HealthProfile types |

### 5.3. Навигация

```
TrainerClientsScreen (список)
  └→ TrainerClientProfileScreen (хаб карточки — вид тренера)
       ├→ [tab: Обзор] PurchasedServices, UpcomingBookings, VisitSummary, Membership
       ├→ [tab: Здоровье] HealthProfile, Contraindications, HealthSources
       ├→ [tab: Прогресс] BodyMeasurement[], ProgressSummary, Charts
       └→ [tab: Заметки] ClientNote[] (filtered by trainer)

MethodistHomeScreen
  └→ TrainerClientProfileScreen (тот же компонент, другие permissions)

ClientCardScreen (вид клиента)
  ├→ [блок: Мой план] TrainingPlan summary
  ├→ [блок: Прогресс] weight/waist deltas
  ├→ [блок: Здоровье] CheckupScreen → HealthProfile
  └→ [блок: Записи] UpcomingBookings
```

---

## 6. Role-Based Access

```typescript
export type AppRole = 'client' | 'trainer' | 'methodist';

export const CARD_PERMISSIONS: Record<AppRole, Record<string, string>> = {
  client: {
    personalInfo: 'own',
    membership: 'read',
    healthProfile: 'read_write',
    purchasedServices: 'read',
    upcomingBookings: 'read',
    measurements: 'read',
    trainingPlan: 'read',
    notes: 'none',
    visits: 'read',
  },
  trainer: {
    personalInfo: 'read',
    membership: 'read',
    healthProfile: 'read',          // if visibility.showTrainer
    purchasedServices: 'read',
    upcomingBookings: 'read',
    measurements: 'write',
    trainingPlan: 'write',
    notes: 'own_write',             // пишет свои, читает все staff
    visits: 'read',
  },
  methodist: {
    personalInfo: 'read',
    membership: 'read',
    healthProfile: 'write',         // управляет health profile
    purchasedServices: 'read',
    upcomingBookings: 'read',
    measurements: 'read',
    trainingPlan: 'approve',        // ревью и корректировка
    notes: 'own_write',
    visits: 'read',
  },
};
```

---

## 7. Mock Data Architecture

```
atletika-themes/
  mocks/
    db.ts              # in-memory "database"
    factories.ts       # factory functions
    seeds/
      clients.ts       # 5-10 pre-seeded client cards
```

Паттерн: centralized mock db → hooks fetch from db → components consume hooks.

Заменяет: разбросанные inline mocks в каждом компоненте.

---

## 8. Hooks Architecture

```typescript
// Загружается сразу — тонкий агрегат
useClientCard(cardId) → { card, loading }

// Загружаются лениво по табам
useClientPurchases(cardId, enabled) → { purchases, loading }
useClientBookings(cardId, enabled) → { bookings, loading }
useClientMeasurements(cardId, enabled) → { measurements, loading }
useClientNotes(cardId, authorRole?, enabled) → { notes, loading, addNote }
useClientVisits(cardId, enabled) → { visits, loading }
```

---

## 9. Edge Cases

| Кейс | Поведение |
|---|---|
| Клиент не найден / не в клубе | "Нет доступа" + кнопка назад |
| Мультиклуб (разные остатки) | Все данные scoped по clubId |
| Offline | Показать кеш + бейдж "нет сети", заметки заблокированы |
| Нет активного абонемента | "Нет активного тарифа" → "К ресепшн" |
| Противопоказания не заполнены | Показать "не заполнено" + prompt |
| Consent отозван | Тренер видит только "не предоставлено" |
| Противопоказания устарели (>N мес) | Prompt "обновите данные" |
| Конфликт данных с 1С | Перезагрузить card |

---

## 10. User Stories + Acceptance Criteria

### US-T1 (P0): Тренер открывает карточку клиента перед занятием

**Given** тренер с активной записью для клиента X в клубе Y,
**When** тренер тапает по аватару клиента в детали занятия,
**Then** карточка загружается за <2 сек, показывая:
- Имя, фото, возраст, теги
- Абонемент: статус, план, остатки (ПТ: N, групп: N, СПА: N)
- Купленные услуги: активные пакеты с остатками
- Ближайшие записи: 1-3 с датой/временем/типом/тренером
- Статистика визитов: за 30 дней, последний визит, неявки
- Бейдж противопоказаний
- Последние 3 заметки

### US-C1 (P0): Клиент заполняет противопоказания

**Given** клиент на экране Профиль > Здоровье > Противопоказания,
**When** экран загружается,
**Then** показаны: чекбоксы противопоказаний, травмы, ограничения, лекарства, аллергии, тумблеры видимости, чекбокс согласия.

### US-T2 (P0): Тренер добавляет заметку после занятия

**Given** тренер на экране профиля клиента,
**When** тап "Добавить заметку" → ввод текста → сохранить,
**Then** заметка появляется в списке с сегодняшней датой и именем тренера.

---

*Документ создан 2026-03-16. Валидирован через 3 параллельных ревью: PRD (product-writer), архитектура (backend-architect), фронтенд (frontend-developer).*
