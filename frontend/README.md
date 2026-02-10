# Foodable Frontend

Modern React + TypeScript + Vite application for the Foodable food donation platform.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0

## Tech Stack

- **React 18** -- UI framework
- **TypeScript** -- Type-safe JavaScript
- **Vite** -- Build tool with fast HMR
- **React Router v6** -- Client-side routing
- **Axios** -- HTTP client
- **Google Maps API** -- Food bank location search (`@react-google-maps/api`, `use-places-autocomplete`)
- **EmailJS** -- Contact form email delivery (`@emailjs/browser`)
- **FontAwesome** -- Icon library
- **React Hot Toast** -- Toast notifications
- **Vitest + Testing Library** -- Unit testing
- **Playwright** -- End-to-end testing

## Project Structure

```
src/
├── Components/
│   ├── Axios/
│   │   ├── http.ts              # Axios instance configuration
│   │   └── http.test.tsx
│   ├── MPComponents/            # Reusable UI components
│   │   ├── Button.tsx           # Button variants
│   │   ├── Cards.tsx            # Feature cards display
│   │   ├── CardItem.tsx         # Individual card component
│   │   ├── Navbar.tsx           # Navigation bar with auth state
│   │   └── Footer.tsx           # Footer with links
│   ├── pages/                   # Page components
│   │   ├── Home.tsx             # Landing page
│   │   ├── Login.tsx            # Login form with validation
│   │   ├── Registration.tsx     # User registration
│   │   ├── Donator.tsx          # Donor interface
│   │   ├── Receiver.tsx         # Receiver interface
│   │   ├── ReceiverFiles/       # Receiver sub-components
│   │   │   ├── FoodPackages.tsx
│   │   │   ├── ItemList.tsx
│   │   │   └── singleItem.tsx
│   │   ├── Foodbank.tsx         # Food bank locator (Google Maps)
│   │   ├── Profile.tsx          # User profile
│   │   ├── Reward.tsx           # Rewards system
│   │   ├── RewardItem.tsx       # Individual reward display
│   │   ├── About.tsx            # About page
│   │   ├── Contact.tsx          # Contact form (EmailJS)
│   │   ├── Logout.tsx           # Logout handler
│   │   └── cssFiles/            # Component-specific styles
│   └── shared/
│       ├── ErrorBoundary.tsx    # Error boundary component
│       ├── ProtectedRoute.tsx   # Auth-guarded route wrapper
│       └── UserSidebar.tsx      # User sidebar component
├── context/
│   └── AuthContext.tsx          # Authentication state (React Context)
├── hooks/                       # Custom React hooks
├── services/                    # API service layer
├── constants/
│   └── index.ts                 # Routes, validation, API config, map config
├── types/
│   └── index.ts                 # TypeScript type definitions
├── utils/
│   └── logger.ts               # Client-side logger
├── App.tsx                      # Main app with lazy-loaded routes
├── index.tsx                    # Entry point
├── test-utils.tsx               # Test helper functions
└── setupTests.ts                # Test configuration
```

## Features

### User Roles

**Donors** -- Register, create food donation listings, view donation history, earn rewards, and find nearby food banks.

**Receivers** -- Browse available food packages, filter by dietary requirements, view food bank locations on a map, and access detailed item information.

**Food Banks** -- Manage location information, coordinate donations, and update inventory.

### Core Functionality

- **Authentication** -- JWT-based login with session storage, protected routes, and profile management.
- **Google Maps integration** -- Interactive food bank finder with location search and place autocomplete.
- **Contact form** -- EmailJS-powered contact form with validation.
- **Lazy loading** -- Route-level code splitting with React `Suspense` for faster initial loads.
- **Error boundaries** -- Graceful error handling that prevents full-page crashes.
- **Toast notifications** -- Non-intrusive success/error feedback via React Hot Toast.
- **Responsive design** -- Mobile-first CSS with component-scoped stylesheets.

## Testing

### Unit Tests (Vitest + Testing Library)

```bash
npm test                 # Run all unit tests
npm run test:ui          # Interactive test UI
npm run test:coverage    # Coverage report
```

### End-to-End Tests (Playwright)

```bash
npm run test:e2e         # Run E2E tests (Chromium)
npm run test:e2e:ui      # Playwright UI mode
npm run test:e2e:report  # View HTML report
npx playwright test --headed   # See the browser
npx playwright test --debug    # Debug mode
```

**E2E Test Suites** (in `e2e/`):

| Suite | File | Covers |
|-------|------|--------|
| Navigation | `navigation.spec.ts` | Page routing, footer links, navbar, logo |
| Authentication | `authentication.spec.ts` | Login/registration forms, auth state |
| Forms | `forms.spec.ts` | Contact form, validation, accessibility |
| Pages | `pages.spec.ts` | All page components, responsiveness, errors |
| UI Components | `ui-components.spec.ts` | Buttons, cards, navbar, footer, images |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server at `localhost:3000` |
| `npm run build` | Production build to `build/` |
| `npm run preview` | Preview the production build |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:ui` | Interactive Vitest UI |
| `npm run test:coverage` | Tests with coverage report |
| `npm run test:e2e` | Playwright E2E tests |
| `npm run test:e2e:ui` | Playwright UI mode |
| `npm run test:e2e:report` | View Playwright HTML report |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run format` | Prettier format |
| `npm run format:check` | Prettier check |
| `npm run type-check` | TypeScript type validation |

## Configuration

### Environment Variables

Create `.env` from the provided `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8080
NODE_ENV=development
```

Optional variables for Google Maps and EmailJS:

```env
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
VITE_EMAILJS_SERVICE_ID=your-service-id
VITE_EMAILJS_TEMPLATE_ID=your-template-id
VITE_EMAILJS_USER_ID=your-emailjs-user-id
```

### Vite (`vite.config.ts`)

- React plugin for JSX/TSX
- Dev server on port 3000
- Production build output to `build/`
- Vitest configured with jsdom environment

### Playwright (`playwright.config.ts`)

- Test directory: `e2e/`
- Base URL: `http://localhost:3000`
- Browser: Chromium
- Retries: 2 on CI, 0 locally
- Screenshots and video on failure
- Traces on first retry

## API Integration

The Axios HTTP client is configured in `src/Components/Axios/http.ts` and points to the backend API. All API calls use async/await with try/catch error handling.

Base URL and other environment-dependent values are centralized in `src/constants/index.ts` via `import.meta.env`.

## State Management

- **React Context** (`AuthContext`) for authentication state (logged-in user, login/logout actions)
- **Component state** (`useState`) for local UI state
- **Session storage** for JWT token persistence

## Styling

- **Component-scoped CSS** in `pages/cssFiles/` and alongside MPComponents
- **Responsive design** with mobile-first approach
- **FontAwesome** for icons
- **Google Fonts** (PT Sans) for typography

## Deployment

```bash
npm run build
# Deploy the build/ folder to your hosting provider
```

Compatible with Vercel, Netlify, GitHub Pages, and AWS Amplify.

## Troubleshooting

**Port already in use:**
```bash
npm run dev -- --port 3001
```

**TypeScript errors after dependency change:**
```bash
rm -rf node_modules package-lock.json && npm install
```

## Contributing

1. Follow TypeScript strict mode guidelines
2. Write tests for new features
3. Use async/await for async operations
4. Update types in `src/types/index.ts`
5. Follow existing component structure
6. Add proper error handling

See the root [CONTRIBUTING.md](../CONTRIBUTING.md) for the full guide.
