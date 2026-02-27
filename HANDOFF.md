# Handoff Guide — Atletika+ MVP

Guide for the in-house development team taking over the project.

## What's Built

### MVP1 — Feature-Complete Demo
All 108 planned tasks across 12 sprints (S0-S11) are implemented. The app runs entirely on **MSW mock data** — no real backend is connected.

### Screen Inventory

| Priority | Count | Description |
|----------|-------|-------------|
| P0 | 47 | Core flows: auth, home, booking, billing, QR, profile |
| P1 | 27 | Extended: schedule, chat, notifications, club info, health |
| P2 | 8 | Full screens: achievements, workout, reviews, trainer tools |
| Placeholder | 33 | ComingSoon stubs: social, e-commerce, advanced trainer |

### Roles
- **Client** — 5 tab bars: Home, Schedule, Booking, QR, More (27 items)
- **Trainer** — 4 tab bars: Home, Clients, Schedule, More (27 items)

## How It Works

### Routing
Expo Router v4 file-based routing. Route groups:
- `app/(auth)/` — login flow (no tabs)
- `app/(client)/` — client tabs with nested groups
- `app/(trainer)/` — trainer tabs with nested groups

Auth guard in `src/features/auth/hooks.ts` → `useAuthGuard()` redirects unauthenticated users.

### Data Flow
```
Screen → useQuery hook → api.get/post → MSW intercepts → mock data
```

To connect a real backend:
1. Remove MSW setup from `src/shared/providers/QueryProvider.tsx`
2. Update `src/shared/api/client.ts` base URL
3. API signatures in `src/features/*/api.ts` already match expected REST endpoints

### State Management
- **Server state**: TanStack React Query (cached, persisted to MMKV)
- **Client state**: Zustand stores in `src/features/*/store.ts`
  - `auth/store.ts` — token, role, phone
  - `club/store.ts` — selected club ID/name
  - `shared/stores/uiStore.ts` — theme preference

### Theming
Two complete theme sets in `src/shared/theme/tokens/`:
- `obsidian.ts` — dark (#0A0A0A), neon green (#39FF14)
- `kinetic.ts` — warm, multi-accent, time-of-day color shifts

`ThemeProvider` in `src/shared/theme/ThemeProvider.tsx` reads `EXPO_PUBLIC_THEME` env var.

`createStyles(fn)` factory in `src/shared/theme/createStyles.ts` — pass a function receiving theme tokens, returns a `useStyles()` hook.

### Mock Data
All in `src/mocks/`:
- `data/s1.ts` through `data/s10.ts` — mock data per sprint
- `handlers/` — MSW handlers per feature domain + `index.ts` barrel

### Analytics
Console-only skeleton in `src/features/analytics/tracker.ts`:
- `useScreenView(name)` — logs screen views
- `analytics.track({ name, params })` — logs events

Replace with real provider (Amplitude, Mixpanel, etc.) by implementing the `AnalyticsProvider` interface.

## Key Patterns

### Adding a New Feature
1. Create `src/features/{name}/types.ts` — interfaces
2. Create `src/features/{name}/api.ts` — API calls using `import { api } from '@/shared/api/client'`
3. Create `src/features/{name}/hooks.ts` — React Query hooks
4. Create `src/features/{name}/utils.ts` — pure functions
5. Create mock data in `src/mocks/data/` and handlers in `src/mocks/handlers/`
6. Create screen in `app/(client|trainer)/(group)/screen-name.tsx`

### Adding a New Screen
```tsx
import { useScreenView } from '@/features/analytics/tracker';
import { createStyles } from '@/shared/theme/createStyles';
import { SPACING } from '@/shared/theme/types';

export default function MyScreen() {
  useScreenView('my_screen');
  const styles = useStyles();
  // ...
}

const useStyles = createStyles((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg.primary,
    paddingHorizontal: SPACING[4],
  },
}));
```

### UI Kit Components
All in `src/shared/ui/`, exported from `index.ts`:

| Component | Usage |
|-----------|-------|
| Button | Primary actions (`variant`: primary/secondary/danger/ghost) |
| Card | Pressable card container |
| Badge | Status labels (`variant`: accent/success/warning/error/info) |
| Input | Text input with label |
| PhoneInput | Phone number with +7 prefix |
| OTPInput | 4-digit code with auto-focus |
| Skeleton | Loading placeholder |
| EmptyState | Empty list message |
| ErrorState | Error with retry button |
| OfflineBanner | Offline indicator |
| ProgressBar | Percentage bar |
| SegmentedControl | Tab-like selector |
| FilterChips | Horizontal filter pills |
| SlotCard | Booking time slot card |
| ComingSoon | Placeholder for unbuilt features |

## What to Change First

### 1. Connect Real API
- Update `BASE_URL` in `src/shared/api/client.ts`
- Remove MSW initialization (conditional on `__DEV__` already)
- API contract: all `src/features/*/api.ts` files define expected endpoints

### 2. Push Notifications
- Add `expo-notifications` setup
- Connect to `src/features/notifications/` hooks

### 3. Real Auth
- Replace mock OTP flow with real SMS provider
- Store JWT securely via `expo-secure-store` (wrapper exists in `src/shared/lib/`)

### 4. Replace ComingSoon Screens
33 placeholder screens in `app/(client)/(more)/` and `app/(trainer)/(more)/` — each needs real implementation.

## Testing

```bash
npx jest              # Unit tests
npx tsc --noEmit      # Type check
```

Test coverage focuses on:
- `src/features/*/utils.ts` — 100% covered
- `src/features/*/store.ts` — 100% covered
- `src/features/*/api.ts` — API call verification
- Integration tests in `src/__tests__/integration/`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `EXPO_PUBLIC_THEME` | Theme: `obsidian` or `kinetic` | `obsidian` |
| `EXPO_PUBLIC_API_URL` | Backend API base URL | (MSW mock) |
