# 🍽️ Foodable Frontend

Modern React + TypeScript + Vite application for the Foodable food donation platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 📋 Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

## 🛠️ Tech Stack

- **React 18.2.0** - UI framework with latest features
- **TypeScript 5.3.3** - Type-safe JavaScript
- **Vite 5.0.12** - Next generation frontend tooling
- **React Router DOM 6.2.1** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing utilities

## 📁 Project Structure

```
src/
├── Components/
│   ├── Axios/
│   │   ├── http.ts              # Axios instance configuration
│   │   └── http.test.tsx        # HTTP client tests
│   ├── MPComponents/            # Reusable UI components
│   │   ├── Button.tsx           # Button variants (Login, Donator, Receiver, etc.)
│   │   ├── Button.test.tsx      # Button component tests
│   │   ├── Cards.tsx            # Feature cards display
│   │   ├── Cards.test.tsx       # Cards tests
│   │   ├── CardItem.tsx         # Individual card component
│   │   ├── CardItem.test.tsx    # Card item tests
│   │   ├── Navbar.tsx           # Navigation bar with auth
│   │   ├── Navbar.test.tsx      # Navbar tests
│   │   ├── Footer.tsx           # Footer with links
│   │   └── Footer.test.tsx      # Footer tests
│   └── pages/                   # Page components
│       ├── Home.tsx             # Landing page
│       ├── Home.test.tsx        # Home page tests
│       ├── Login.tsx            # Login form with validation
│       ├── Login.test.tsx       # Login tests
│       ├── Registration.tsx     # User registration
│       ├── Donator.tsx          # Donor interface
│       ├── Receiver.tsx         # Receiver interface
│       ├── ReceiverFiles/       # Receiver sub-components
│       │   ├── FoodPackages.tsx
│       │   ├── ItemList.tsx
│       │   └── singleItem.tsx
│       ├── Foodbank.tsx         # Foodbank locations
│       ├── Profile.tsx          # User profile
│       ├── Reward.tsx           # Rewards system
│       ├── RewardItem.tsx       # Individual reward
│       ├── RewardItem.test.tsx  # Reward tests
│       ├── About.tsx            # About page
│       ├── About.test.tsx       # About tests
│       ├── Contact.tsx          # Contact form
│       ├── Contact.test.tsx     # Contact tests
│       ├── Logout.tsx           # Logout handler
│       └── cssFiles/            # Component-specific styles
├── types/
│   └── index.ts                 # TypeScript type definitions
├── App.tsx                      # Main app component
├── App.test.tsx                 # App tests
├── index.tsx                    # Application entry point
├── test-utils.tsx               # Test helper functions
├── setupTests.ts                # Test configuration
└── reportWebVitals.ts           # Performance monitoring
```

## 🎯 Features

### User Roles

#### Donors
- Register and login to donation system
- Create food donation listings
- View donation history
- Earn rewards for contributions
- Find nearby foodbanks

#### Receivers
- Browse available food packages
- Filter by dietary requirements
- View foodbank locations on map
- Access detailed item information

#### Foodbanks
- Manage location information
- Coordinate donations
- Update inventory

### Core Functionality

#### Authentication
- JWT-based authentication
- Secure session management
- Protected routes
- User profile management

#### Maps Integration
- Google Maps API integration
- Location-based search
- Interactive foodbank finder

#### Contact System
- EmailJS integration
- Contact form with validation
- Direct email communication

## 🧪 Testing

### Test Coverage
- **125 unit tests** across all components (Vitest)
- **82 E2E tests** covering user flows (Playwright)
- **12 unit test files** with comprehensive coverage
- **5 E2E test suites** with browser automation
- All tests use async/await patterns
- Type-safe test utilities

### Unit Tests (Vitest + React Testing Library)

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- Button.test.tsx

# Run with coverage report
npm run test:coverage

# Run with interactive UI
npm run test:ui
```

**Test Categories:**
- **Component Tests**: UI component behavior
- **Integration Tests**: Component interactions
- **Form Validation Tests**: Input validation
- **API Tests**: HTTP client configuration
- **Async Tests**: Asynchronous operations

### End-to-End Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Run with interactive UI
npm run test:e2e:ui

# View HTML report
npm run test:e2e:report

# Run in headed mode (see browser)
npx playwright test --headed

# Debug tests
npx playwright test --debug
```

**E2E Test Suites:**
1. **navigation.spec.ts** - Page routing and navigation (17 tests)
2. **authentication.spec.ts** - Login and registration flows (11 tests)
3. **forms.spec.ts** - Form validation and submission (11 tests)
4. **pages.spec.ts** - All page components (21 tests)
5. **ui-components.spec.ts** - UI components and interactions (22 tests)

**E2E Coverage:**
- ✅ Complete user journeys
- ✅ Form validation in real browser
- ✅ Navigation across all pages
- ✅ Responsive design testing
- ✅ Accessibility checks
- ✅ Performance monitoring
- ✅ Error handling
- ✅ Mobile interactions

## 📦 Scripts

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # Build for production
npm run preview          # Preview production build

# Unit Testing (Vitest)
npm test                 # Run unit tests
npm run test:ui          # Interactive test UI
npm run test:coverage    # Coverage report

# E2E Testing (Playwright)
npm run test:e2e         # Run E2E tests
npm run test:e2e:ui      # Playwright UI mode
npm run test:e2e:report  # View HTML report

# Type Checking
npx tsc --noEmit         # Check TypeScript types
```

## 🔧 Configuration

### Vite Configuration (`vite.config.ts`)

```typescript
- React plugin for JSX/TSX support
- TypeScript configuration
- Test environment setup (jsdom)
- Build optimization
- Development server on port 3000
```

### TypeScript Configuration (`tsconfig.json`)

```json
- Strict mode enabled
- ES2020 target
- React JSX support
- Path aliases
- Type checking for tests
```

## 🌐 API Integration

### Base Configuration

```typescript
// src/Components/Axios/http.ts
import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-type": "application/json"
  }
});
```

### Async/Await Pattern

All API calls use modern async/await:

```typescript
const fetchData = async (): Promise<void> => {
  try {
    const response = await axios.get('/endpoint');
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

## 🎨 Styling

- **Modular CSS**: Component-scoped styles
- **Responsive Design**: Mobile-first approach
- **CSS Variables**: Consistent theming
- **Font Awesome**: Icon library
- **Google Fonts**: PT Sans typography

## 🔐 Environment Variables

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_GOOGLE_MAPS_API_KEY=your_api_key
VITE_EMAILJS_SERVICE_ID=gmail
VITE_EMAILJS_TEMPLATE_ID=Automated_Email
VITE_EMAILJS_USER_ID=user_mlsqPrWKZea6YAr2udP9X
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Output: `build/` directory with optimized assets

### Preview Production Build

```bash
npm run preview
```

### Deployment Platforms

Compatible with:
- Vercel
- Netlify
- GitHub Pages
- AWS Amplify
- Azure Static Web Apps

## 📝 Code Style

### TypeScript Best Practices
- Strict type checking enabled
- Explicit return types for functions
- Interface definitions for props
- Type-safe event handlers

### React Best Practices
- Functional components with hooks
- Custom hooks for reusable logic
- Proper dependency arrays in useEffect
- Memoization where appropriate

### Async Patterns
- async/await instead of .then()
- Proper error handling with try/catch
- Typed error objects (AxiosError)
- Loading and error states

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Change port in vite.config.ts or use:
npm run dev -- --port 3001
```

**Node version mismatch**
```bash
# Use nvm to switch Node version:
nvm use 18
```

**TypeScript errors**
```bash
# Clear cache and reinstall:
rm -rf node_modules package-lock.json
npm install
```

**Test failures**
```bash
# Clear test cache:
npm test -- --clearCache
```

## 📊 Performance

- **Fast Refresh**: Instant HMR with Vite
- **Optimized Builds**: Tree-shaking and code splitting
- **Type Safety**: Catch errors at compile time
- **Lazy Loading**: Route-based code splitting
- **Asset Optimization**: Automatic image optimization

## 🔄 State Management

Currently using:
- React useState for local state
- sessionStorage for authentication
- Props for component communication

Future considerations:
- Redux Toolkit for global state
- React Query for server state
- Zustand for simpler state management

## 🌟 Future Enhancements

- [ ] Progressive Web App (PWA) support
- [ ] Offline functionality
- [ ] Push notifications
- [ ] Real-time updates with WebSockets
- [ ] Advanced filtering and search
- [ ] Multi-language support (i18n)
- [ ] Dark mode theme
- [ ] Advanced analytics dashboard

## 🤝 Contributing

1. Follow TypeScript strict mode guidelines
2. Write tests for new features
3. Use async/await for async operations
4. Update types in `src/types/index.ts`
5. Follow existing component structure
6. Add proper error handling

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Vitest Documentation](https://vitest.dev/)
- [React Router](https://reactrouter.com/)

## 📞 Support

For issues or questions:
- Create an issue in the repository
- Email: foodable7@gmail.com

---

**Built with React ⚛️ + TypeScript 📘 + Vite ⚡**
