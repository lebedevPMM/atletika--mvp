# Тема "Ember" — План имплементации

## Статус: ПЛАН УТВЕРЖДЁН, ОЖИДАЕТ ИМПЛЕМЕНТАЦИИ

## Что сделано в этой сессии
- [x] PlanScreen.tsx — 4 CSS-фикса (absolute positioning)
- [x] Деплой на gh-pages (PlanScreen фикс)
- [x] Восстановление atletika-mvp-rescue из _archive
- [x] План "Ember" темы утверждён

## Характеристики Ember-темы (из HTML дизайна)
- **Шрифт:** Rajdhani (Google Fonts), wght 400-700
- **Палитра:**
  - `--ember-bg: #080808` (near-black)
  - `--ember-surface: #111111` (dark surface)
  - `--ember-surface-raised: #1a1a1a`
  - `--ember-accent: #ff4d00` (orange glow)
  - `--ember-accent-dim: #8a2be2` (purple dim)
  - `--ember-text-primary: #e0e0e0`
  - `--ember-text-secondary: #666666`
- **Радиусы:** 24px cards, 12px small
- **Эффекты:**
  - Ember glow: `0 0 15px rgba(255,77,0,0.4), 0 0 5px rgba(255,77,0,0.8)`
  - Bezel shadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 20px rgba(0,0,0,0.6)`
  - Pulse-glow animation, dot-matrix patterns, glow bars

## Шаги имплементации

### Шаг 1: Инфраструктура
- `ThemeContext.tsx` — `BrandTheme = 'default' | 'ember'`, `isEmber` вместо `isNeon`
- `index.html` — добавить Rajdhani font
- `index.css` — CSS-переменные `html.brand-ember { ... }`
- `tailwind.config.js` — ember цвета + Rajdhani в fontFamily

### Шаг 2: HomeScreenEmber.tsx
- Создать на основе HomeScreenDefault
- Применить ember-эстетику: bezel cards, glow bars, Rajdhani
- HomeScreen.tsx: заменить neon/pastel на ember

### Шаг 3: Обновить 11 файлов (isNeon → isEmber)
Файлы:
1. `PlanScreen.tsx`
2. `BookingScreen.tsx`
3. `ProfileScreen.tsx`
4. `CommunityScreen.tsx`
5. `SettingsScreen.tsx` (+ UI toggle)
6. `BottomNav.tsx`
7. `App.tsx` (brandTheme !== 'neon' → 'ember')
8. `HomeScreenDefault.tsx` (reference only)

### Шаг 4: Архивировать neon/pastel
- mv HomeScreenNeon.tsx → _archive/
- mv HomeScreenPastel.tsx → _archive/

### Шаг 5: Верификация
- Dev server скриншоты обоих тем
- Toggle default ↔ ember

### Шаг 6: Билд + деплой
- `npx vite build` + деплой через /tmp клон

## Файл плана Claude Code
`~/.claude/plans/shimmering-hatching-fox.md`
