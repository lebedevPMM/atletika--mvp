# Atletika+ Themes — Бэклог

> **Последнее обновление:** 2026-03-06
> На основе UX аудита `docs/audit/2026-03-06-ux-audit.md`

---

## P0 — Критические (без них приложение не работает)

### A1. Booking Flow End-to-End
**Проблема:** Запись на услугу обрывается на Generic screen. Core action приложения не работает.
**Задачи:**
- [x] A1.1 BookingDetailsScreen — детали групповой записи ✅ уже реализован
- [x] A1.2 BookingPTDetailsScreen — детали PT ✅ уже реализован
- [x] A1.3 BookingSpaDetailsScreen — детали SPA ✅ уже реализован
- [x] A1.4 BookingConfirmScreen — подтверждение ✅ уже реализован
- [x] A1.5 BookingResultScreen — результат ✅ уже реализован
- [x] A1.6 Связать flow: BookingScreen → Details → Confirm → Result ✅ уже подключено в App.tsx

### A2. Навигация "Назад"
**Проблема:** На вложенных экранах нет кнопки ← Назад. Пользователь застревает.
**Задачи:**
- [x] A2.1 Все back-кнопки используют onNavigate('BACK') — 79 файлов исправлено
- [x] A2.2 3 параллельных агента: client (42), trainer (35), social (2)
- [x] A2.3 Browser back button support (popstate) ✅

### A3. Error / Loading / Empty States
**Проблема:** Нет обработки ошибок, загрузки, пустых данных.
**Задачи:**
- [x] A3.1 LoadingState компонент (spinner + сообщение) ✅
- [x] A3.2 ErrorState компонент ("Что-то пошло не так" + Повторить) ✅
- [x] A3.3 EmptyState компонент (иконка + текст + CTA) ✅
- [x] A3.4 Внедрить loading/error/empty — экраны уже имеют контекстные состояния ✅

---

## P1 — Важные (юзабилити и консистентность)

### B1. Русификация — убрать смешение языков
**Проблема:** "Network" среди русских табов, "Check-out", "CLUB RAID BOSS", "Geofence Active"
**Задачи:**
- [x] B1.1 NavDock: "Network" → "Сообщество" ✅
- [x] B1.2 CommunityScreen: sub-tabs → "Зал/Запросы/События/Чаты" ✅
- [x] B1.3 CheckInStatus: "Check-out" → "Уйти", "Geofence Active" → "Вы отмечены" ✅
- [x] B1.4 RaidBossWidget: "Рейд-босс клуба", "ОЗ" ✅
- [x] B1.5 GymActiveUsersList: "Ур." + "Сейчас в зале" ✅
- [x] B1.6 Stories: "СОЗДАТЬ" → "+" ✅

### B2. Единый стиль CTA-кнопок
**Проблема:** "РАСПИСАНИЕ" (outlined pill), "НАЧАТЬ СЕССИЮ >" (text link), "СОЗДАТЬ" (circle) — нет паттерна.
**Задачи:**
- [x] B2.1 Определить 3 уровня CTA: Primary (filled), Secondary (outlined), Tertiary (text) ✅
- [x] B2.2 Создать компонент Button с вариантами ✅ components/ui/Button.tsx
- [x] B2.3 Заменить hardcoded кнопки на компонент ✅ PlanScreen, BookingScreen, FamilyScreen, TariffScreen

### B3. Убрать debug-элементы из production
- [x] B3.1 ThemeSwitcher — только с ?debug=true ✅
- [x] B3.2 "Ост: 4" → "Осталось: 4" ✅

### B4. Home Screen — снизить информационную нагрузку
**Проблема:** 12+ блоков информации, пользователь не знает куда смотреть.
**Задачи:**
- [x] B4.1 Next Booking перемещён выше Status Grid (QR → Booking → Tiles → Promos) ✅
- [x] B4.2 Тайлы: 2×2 grid → горизонтальный скролл (компактные вертикальные карточки) ✅
- [x] B4.3 Stories: аватарки 16→12px, убраны подписи ✅

### B5. BrainBlink — убрать из Плана
**Проблема:** Когнитивная разминка внутри тренировочного плана отвлекает от core-задачи.
- [x] B5.1 Убран баннер BrainBlink из PlanScreen ✅
- [x] B5.2 Игра остаётся доступна через WorkoutSession ✅

### B6. Confirmation Dialogs
**Проблема:** Деструктивные действия без подтверждения.
- [x] B6.1 "ВЫЙТИ" → диалог уже есть в ProfileScreen ✅
- [x] B6.2 Отмена записи → диалог уже есть в BookingDetailsScreen ✅
- [x] B6.3 Check-out → ConfirmDialog добавлен в CheckInStatus ✅

---

## P1 — Тренерский Flow

### C1. Полный цикл сессии
**Проблема:** Тренер не может провести сессию — 80% экранов заглушки.
**Задачи:**
- [x] C1.1 TrainerClassDetailsScreen = сессия (planned→in_progress→done, участники, заметки) ✅ уже реализован
- [x] C1.2 TrainerScanScreen — QR-скан + ручная отметка ✅ уже реализован
- [x] C1.3 TrainerShiftEndScreen — чеклист, сводка, завершение ✅ уже реализован
- [x] C1.4 Flow подключен: trainer_home → trainer_class_details → BACK ✅

### C2. Создание/редактирование плана клиента
- [x] C2.1 TrainerPlanScreen — дни, упражнения, подходы/повторы/вес ✅ уже реализован
- [x] C2.2 TrainerExerciseLibraryScreen — каталог упражнений ✅ уже реализован

### C3. Базовые отчёты
- [x] C3.1 TrainerFinanceScreen — графики, транзакции, период ✅ уже реализован
- [x] C3.2 TrainerKPIScreen — продажи, удержание, NPS, рейтинг ✅ уже реализован

---

## P1 — Фитнес-Карта Клиента (ClientCard)

### E1. Типы и модель данных — DONE
**Описание:** Центральная сущность — единая точка правды по клиенту для 3 ролей.
**Docs:** `docs/plans/2026-03-16-client-card-entity-design.md`, `docs/product/client-card.md`
**Задачи:**
- [x] E1.1 Branded ID types + ClientCard aggregate root (`types/client-card.ts`) ✅
- [x] E1.2 PersonalInfo, MembershipInfo, ServiceLimits, FreezeInfo ✅
- [x] E1.3 HealthProfile + HealthVisibility + HealthSource ✅
- [x] E1.4 PurchasedService, UpcomingBooking (P0 sub-resources) ✅
- [x] E1.5 BodyMeasurement, TrainingPlan, Checkpoint (P1 sub-resources) ✅
- [x] E1.6 VisitRecord, ClientNote (lazy sub-resources) ✅
- [x] E1.7 VisitSummary, ProgressSummary (computed summaries) ✅
- [x] E1.8 Role-based permissions (CARD_PERMISSIONS) ✅

### E2. Mock Data + Hooks — DONE
**Описание:** Централизованная mock-база вместо inline моков в компонентах.
**Задачи:**
- [x] E2.1 `mocks/client-card-db.ts` — in-memory database ✅
- [x] E2.2 `mocks/client-card-factories.ts` — factory functions ✅
- [x] E2.3 `mocks/seeds/clients.ts` — 5 pre-seeded клиентов ✅
- [x] E2.4 `hooks/useClientCard.ts` — aggregate root hook ✅
- [x] E2.5 `hooks/useClientPurchases.ts`, `useClientBookings.ts` — P0 hooks ✅
- [x] E2.6 `hooks/useClientMeasurements.ts`, `useClientNotes.ts`, `useClientVisits.ts` — lazy hooks ✅

### E3. Экраны — обновление существующих — DONE
**Описание:** Подключить существующие экраны к новым типам и mock data.
**Задачи:**
- [x] E3.1 TrainerClientProfileScreen — 4 таба (Обзор/Здоровье/История/Заметки) + ClientCard types ✅
- [x] E3.3 MeasurementsScreen — BodyMeasurement types + useClientMeasurements hook ✅
- [x] E3.4 ContraindicationsScreen — HealthProfile types + useClientCard hook ✅

### E4. Экраны — новые — DONE
**Описание:** Новые экраны для клиентского вида и чекапа.
**Задачи:**
- [x] E4.1 ClientCardScreen — хаб карточки для клиента (план, прогресс, здоровье, записи) ✅
- [x] E4.2 CheckupScreen — 3-step wizard (противопоказания → аллергии → согласие) ✅
- [x] E4.3 Регистрация ScreenNames в types.ts + routing в App.tsx ✅

---

## P1 — Новые фичи (исследование 2026-03-16)

### F1. Счётчик загрузки клуба (MVP 1)
**Описание:** Реальтайм виджет загруженности зала — влияет на решение "идти сейчас или позже".
**Research:** `docs/research/2026-03-16-gym-occupancy-counter-research.md`
**Retention impact:** +8-15% визитов (перераспределение в off-peak), +12% DAU (привычка проверять)
**Задачи:**
- [x] F1.1 Типы и mock-движок загруженности (OccupancyLevel, зоны, почасовые кривые) ✅
- [x] F1.2 OccupancyWidget на HomeScreen (80px compact, 5 уровней, цветовая шкала) ✅
- [x] F1.3 ClubOccupancyScreen — детальный вид (почасовой график, зоны, прогноз) ✅
- [x] F1.4 Интеграция с GymActiveUsersList (фактические данные) ✅
- [ ] F1.5 Heatmap в MethodistAnalyticsScreen (уже есть данные)

### F2. Оферта при регистрации (MVP 1)
**Описание:** Юридически корректное принятие оферты с trust-building UX.
**Research:** `docs/research/2026-03-16-offer-agreement-ux-research.md`
**Критические проблемы:** Объединённый чекбокс (нарушение ФЗ-152), отсутствие timestamp
**Задачи:**
- [x] F2.1 Разделить чекбоксы (оферта + ПДн + здоровье отдельно) — P0 юридическое ✅
- [x] F2.2 Сохранять timestamp акцепта в store — P0 юридическое ✅
- [x] F2.3 Summary Card с 4 ключевыми пунктами (вместо wall of text) ✅
- [x] F2.4 Expandable полный текст (collapsed по умолчанию) ✅
- [x] F2.5 docsUpdated diff — "Что изменилось" при обновлении оферты ✅
- [x] F2.6 Версионирование (v1.0, v1.1) ✅

### F3. Коммьюнити / Социальная механика (MVP 2)
**Описание:** Activity-Based Matching (НЕ Tinder-swipe) — знакомства через совместные тренировки.
**Research:** `docs/research/2026-03-16-community-social-tinder-strategy.md`
**Retention impact:** +16-30% retention, +27-55% LTV (консервативно-агрессивно)
**North Star:** SAU (Social Active Users) >= 40% MAU к 6 месяцам
**Задачи:**
- [x] F3.1 Open Workouts — публичные тренировки с присоединением ✅
- [x] F3.2 Suggested Buddies — алгоритм подбора по расписанию/уровню/целям ✅
- [ ] F3.3 Challenge Teams — командные вызовы (2-5 чел, 7 дней)
- [x] F3.4 Enhanced Profiles — фитнес-интересы, предпочтения, "ищу напарника" ✅
- [ ] F3.5 Privacy & Safety — ghost mode, блокировка, отчёты, opt-in
- [x] F3.6 Social Feed на CommunityScreen (вкладка "Поиск" + buddy/workouts) ✅
- [ ] F3.7 Buddy Chat — чат между matched пользователями
- [ ] F3.8 Gamification — бейджи за социальную активность, streak за тренировки с buddy

---

## P2 — Будущее

### D1. Методист (новая роль) — DONE
- [x] D1.1 Точка входа (авторизация по роли) — Login/OTP/SelectClub/Logout + "Я методист" на TrainerLogin
- [x] D1.2 Дашборд методиста — MethodistHomeScreen (сводка дня, сигналы, расписание)
- [x] D1.3 Управление программами тренировок — MethodistProgramsScreen + ProgramDetailScreen (recharts)
- [x] D1.4 Оценка эффективности тренеров — MethodistTrainersScreen + TrainerProfileScreen (recharts)
- [x] D1.5 Управление расписанием клуба — отображение в дашборде (Расписание в меню → "В разработке")
- [x] D1.6 Аналитика и отчёты — MethodistAnalyticsScreen (Area+Bar+Pie+Heatmap)

### D2. Accessibility
- [ ] D2.1 aria-labels на всех интерактивных элементах
- [ ] D2.2 Keyboard navigation
- [ ] D2.3 Контраст проверка (серый текст на тёмном фоне)
- [ ] D2.4 Увеличение шрифта

### D3. Gamification — объяснение механик
- [ ] D3.1 Онбординг для Raid Boss (что это, зачем, как)
- [ ] D3.2 Объяснение уровней (LVL) и как их повышать
- [ ] D3.3 Status beacons — тултипы при первом использовании

### D4. Поиск
- [ ] D4.1 Глобальный поиск по расписанию/тренерам/услугам
- [ ] D4.2 "Повторить запись" — для регулярных занятий

### D5. Десктопная адаптация для тренеров
- [ ] D5.1 Расписание на большом экране (таблица, не мобильный стек)
- [ ] D5.2 Список клиентов — таблица с фильтрами

---

## DONE

| # | Задача | Дата | Коммит |
|---|--------|------|--------|
| G12 | Multi-Theme Registry System (default + ember) | 2026-03-03 | 0388cc2 |
| G13 | UX Audit (Bastien-Scapin + Nielsen) | 2026-03-06 | — |
| A1 | Booking Flow E2E — verified connected | 2026-03-09 | 4e1d087 |
| A2 | Back Navigation — 79 files + popstate | 2026-03-09 | 4e1d087 |
| A3.1-3 | Loading/Error/Empty State components | 2026-03-09 | 4e1d087 |
| B1 | Russification — NavDock, Community, Stories, etc | 2026-03-09 | 4e1d087 |
| B3 | Debug elements hidden (?debug=true) | 2026-03-09 | 4e1d087 |
| A3.4 | Loading/Error/Empty — contextual per screen | 2026-03-10 | 609a592 |
| B2 | Button component + integrated 4 screens | 2026-03-10 | 609a592 |
| B5 | BrainBlink removed from PlanScreen | 2026-03-10 | 609a592 |
| B6 | ConfirmDialog created + CheckInStatus | 2026-03-10 | 609a592 |
| B1+ | Russification — 11 more screens (Family, Profile, Social, Events, Directory, ClubInfo, RequestFeed, Tariff) | 2026-03-10 | 609a592 |
| B4 | Home Screen — reduced info overload (reordered, compact tiles, smaller stories) | 2026-03-10 | 792e3b7 |
| C1 | Trainer session flow — already implemented (ClassDetails, Scan, ShiftEnd) | 2026-03-10 | — verified |
| C2 | Trainer plan editor + exercise library — already implemented | 2026-03-10 | — verified |
| C3 | Trainer finance + KPI reports — already implemented | 2026-03-10 | — verified |
| D1 | Methodist role — 11 screens, 4 functions, full flow (Auth+Tabs+Details+Analytics) | 2026-03-11 | 3bf66e9 |
| E1 | ClientCard types — 239 lines, branded IDs, 20 interfaces, CARD_PERMISSIONS | 2026-03-16 | — |
| E2 | ClientCard mocks + hooks — db, factories, 5 seeds, 7 hooks | 2026-03-16 | — |
| E3 | Screens updated — TrainerClientProfile (4 tabs), Measurements, Contraindications | 2026-03-16 | — |
| E4 | New screens — ClientCardScreen (client hub), CheckupScreen (3-step wizard) + routing | 2026-03-16 | — |
| F1-R | Research: Gym Occupancy Counter — 11 секций, психология, 3 подхода, mock-движок | 2026-03-16 | — |
| F2-R | Research: Offer/Agreement UX — юридика (ФЗ-152, ФЗ-63), 3 подхода, wireframe | 2026-03-16 | — |
| F3-R | Research: Community/Social — Activity-Based Matching, challenge system, ROI модель | 2026-03-16 | — |
| F1 | Gym Occupancy — types, mock engine, widget, detail screen, HomeScreen integration | 2026-03-16 | — |
| F2 | Offer/Agreement — 3 checkboxes, timestamps, Summary Card, expandable text, version badge | 2026-03-16 | — |
| F3.1-4,6 | Community Social — buddy system, open workouts, suggested buddies, CommunityScreen tab | 2026-03-16 | — |
