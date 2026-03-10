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

## P2 — Будущее

### D1. Методист (новая роль)
- [ ] D1.1 Точка входа (авторизация по роли)
- [ ] D1.2 Дашборд методиста
- [ ] D1.3 Управление программами тренировок
- [ ] D1.4 Оценка эффективности тренеров
- [ ] D1.5 Управление расписанием клуба
- [ ] D1.6 Аналитика и отчёты

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
