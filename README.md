# Atletika+ (Атлетика+)

Mobile fitness club management app for clients and trainers.

## Tech Stack

- **React Native** 0.83.2 + **Expo SDK 55** (New Architecture)
- **Expo Router v4** — file-based routing with typed routes
- **TypeScript** 5.9
- **TanStack React Query** 5 — server state, caching, MMKV persistence
- **Zustand** 5 + **MMKV** — client state
- **MSW** 2 — API mocking (all endpoints mocked for demo)
- **Reanimated** 4 + **Skia** — animations and graphics
- **Phosphor Icons** — iconography

## Getting Started

```bash
# Install dependencies
npm install

# Start Expo dev server
npm start

# Platform-specific
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web browser
```

## Project Structure

```
atletika-rn/
├── app/                    # Expo Router pages
│   ├── (auth)/             # Login, OTP, Offer, Club Select
│   ├── (client)/           # Client role
│   │   ├── (home)/         # Dashboard
│   │   ├── (schedule)/     # My bookings
│   │   ├── (booking)/      # Browse & book classes
│   │   ├── (qr)/           # QR pass
│   │   └── (more)/         # Profile, Settings, 27 menu items
│   └── (trainer)/          # Trainer role
│       ├── (home)/         # Day overview, shift end
│       ├── (clients)/      # Client list, plan, progress
│       ├── (schedule)/     # Trainer schedule
│       └── (more)/         # Profile, 27 menu items
├── src/
│   ├── features/           # Feature-Sliced Design modules
│   │   ├── auth/           # Auth store, guard, API
│   │   ├── booking/        # Booking CRUD, slots, browse
│   │   ├── billing/        # Invoices, payments
│   │   ├── membership/     # Plans, freeze
│   │   ├── catalog/        # Services catalog
│   │   ├── club/           # Club info, team, news, chat
│   │   ├── notifications/  # Push notifications
│   │   ├── profile/        # User profile, settings
│   │   ├── qr/             # QR pass generation
│   │   ├── trainer/        # Trainer-specific features
│   │   ├── health/         # Contraindications, documents
│   │   ├── loyalty/        # Bonus points
│   │   ├── reviews/        # Reviews CRUD
│   │   ├── achievements/   # Gamification
│   │   ├── workout/        # Workout session tracking
│   │   ├── home/           # Dashboard data
│   │   └── analytics/      # Event tracking
│   ├── shared/
│   │   ├── ui/             # 15 UI Kit components
│   │   ├── api/            # HTTP client wrapper
│   │   ├── hooks/          # useOffline, useHaptic, useDebounce
│   │   ├── theme/          # Dual theme system (Obsidian/Kinetic)
│   │   ├── stores/         # UI store
│   │   ├── providers/      # QueryClient, Theme, MSW
│   │   └── lib/            # Utilities (pluralize, etc.)
│   └── mocks/
│       ├── data/           # Mock data per sprint (s1-s10)
│       └── handlers/       # MSW request handlers
└── assets/                 # Fonts, images
```

## Architecture

Each feature module follows the same structure:
```
features/{name}/
├── types.ts      # TypeScript interfaces
├── api.ts        # API client functions
├── hooks.ts      # React Query hooks
├── utils.ts      # Pure utility functions
├── store.ts      # Zustand store (if needed)
└── __tests__/    # Unit tests
```

## Theming

Two built-in themes controlled by `EXPO_PUBLIC_THEME` env var:
- **Obsidian** (default) — dark theme with neon green accents
- **Kinetic** — warm theme with multi-color accents, time-of-day shifts

## Testing

```bash
# Run all tests
npx jest

# Run with coverage
npx jest --coverage

# Type check
npx tsc --noEmit
```

## Web Export

```bash
# Obsidian theme
EXPO_PUBLIC_THEME=obsidian npx expo export --platform web

# Kinetic theme
EXPO_PUBLIC_THEME=kinetic npx expo export --platform web
```

## Stats

- 125 route files (screens)
- 17 feature modules
- 15 shared UI components
- 273 TypeScript files
- ~25,000 lines of code
- 54 commits across 12 sprints (S0-S11)
