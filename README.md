# Foodable - Food Donation Platform

[![CI](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/ci.yml/badge.svg)](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/ci.yml)
[![Release](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/release.yml/badge.svg)](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/release.yml)
[![codecov](https://codecov.io/gh/BenDXC/Foodable-Web-Dev/branch/main/graph/badge.svg)](https://codecov.io/gh/BenDXC/Foodable-Web-Dev)

A full-stack web application connecting food donors with food banks and receivers, helping reduce food waste while supporting those in need. Donors can list surplus food, receivers can browse available food packages, and the platform provides a food bank locator powered by Google Maps.

## Project Structure

```
foodable/
├── frontend/              # React 18 + TypeScript (Vite)
│   ├── src/
│   │   ├── Components/    # UI and page components
│   │   ├── context/       # React Context (auth state)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service layer
│   │   ├── constants/     # App-wide constants & config
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   ├── e2e/               # Playwright end-to-end tests
│   └── public/            # Static assets & images
├── backend/               # Express + TypeScript API
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/     # Auth, validation, security, error handling
│   │   ├── routes/        # API route definitions
│   │   ├── config/        # Database & app configuration
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Logger, response helpers, constants
│   └── __tests__/         # Unit & integration tests
├── docs/                  # Project documentation
├── .github/workflows/     # CI/CD pipeline definitions
└── package.json           # Root workspace configuration
```

## Quick Start

### Prerequisites

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0
- **MySQL** >= 5.7

### Installation

```bash
# Clone the repository
git clone https://github.com/BenDXC/Foodable-Web-Dev.git
cd Foodable-Web-Dev

# Install all dependencies (frontend + backend)
npm install

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit the .env files with your database credentials and API keys
```

### Development

```bash
# Start both frontend and backend in development mode
npm run dev

# Or start them separately:
npm run dev:frontend    # Frontend at http://localhost:5173
npm run dev:backend     # Backend at http://localhost:8080
```

### Building for Production

```bash
# Build both frontend and backend
npm run build

# Or build separately:
npm run build:frontend
npm run build:backend
```

### Testing

```bash
# Run all tests (frontend + backend)
npm test

# Frontend tests only
npm run test:frontend

# Backend tests only
npm run test:backend
```

### Linting

```bash
# Lint all code
npm run lint

# Lint frontend only
npm run lint:frontend

# Lint backend only
npm run lint:backend
```

## Features

### Frontend

- **React 18** with TypeScript and Vite for fast development
- **Lazy-loaded routes** with React Router v6 for code splitting
- **Google Maps integration** for food bank locations and place search
- **Contact form** powered by EmailJS
- **Authentication flow** with JWT tokens and protected routes
- **User roles**: Donor, Receiver, and Food Bank views
- **Rewards system** for active donors
- **Toast notifications** via React Hot Toast
- **Accessibility** support with ARIA labels (WCAG 2.1)
- **Error boundaries** for graceful error handling
- **Playwright E2E tests** covering navigation, forms, auth, and UI components
- **Responsive design** with custom CSS

### Backend

- **Express.js** REST API with TypeScript
- **JWT authentication** with access tokens, refresh tokens, and password changes
- **MySQL** database with connection pooling
- **Request validation** using express-validator
- **Security middleware**: Helmet, CORS, rate limiting, CSRF protection, XSS sanitization, bcrypt password hashing
- **Structured logging** with Winston and request ID tracing
- **Compression** for response payloads
- **Health check endpoints** (basic and detailed)
- **Async error handling** throughout with express-async-errors
- **Unit and integration tests** with Jest and Supertest

## API Reference

**Base URL**: `http://localhost:8080/api/v1`

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | Log in | Public |
| POST | `/auth/logout` | Log out | Private |
| POST | `/auth/refresh` | Refresh access token | Public |
| GET | `/auth/profile` | Get current user profile | Private |
| POST | `/auth/change-password` | Change password | Private |

### Users

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/users` | List all users (paginated) | Private |
| GET | `/users/email` | Get user by email query | Private |
| GET | `/users/:id` | Get user by ID | Private |
| PUT | `/users/profile` | Update own profile | Private |
| DELETE | `/users/account` | Delete own account | Private |

### Donations

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/donations` | Create a donation | Private |
| GET | `/donations` | List donations (paginated, filterable by status) | Private |
| GET | `/donations/my-donations` | List current user's donations | Private |
| GET | `/donations/:id` | Get donation by ID | Private |
| PUT | `/donations/:id` | Update donation (owner only) | Private |
| DELETE | `/donations/:id` | Delete donation (owner only) | Private |

### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Basic health check |
| GET | `/health/detailed` | Detailed system status |

For the full API documentation, see [backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md).

## Technology Stack

### Frontend

| Category | Technology |
|----------|-----------|
| Framework | React 18 |
| Language | TypeScript |
| Build Tool | Vite |
| Routing | React Router v6 |
| HTTP Client | Axios |
| State | React Context API |
| Maps | Google Maps API (`@react-google-maps/api`, `use-places-autocomplete`) |
| Email | EmailJS (`@emailjs/browser`) |
| Icons | FontAwesome (`@fortawesome/react-fontawesome`) |
| Notifications | React Hot Toast |
| Unit Testing | Vitest, Testing Library |
| E2E Testing | Playwright |
| Styling | CSS3 |

### Backend

| Category | Technology |
|----------|-----------|
| Framework | Express.js |
| Language | TypeScript |
| Database | MySQL (mysql2) |
| Auth | JWT (`jsonwebtoken`), bcrypt |
| Validation | express-validator |
| Logging | Winston |
| Security | Helmet, CORS, express-rate-limit, csurf, xss |
| Compression | compression |
| Testing | Jest, Supertest |
| Dev Tools | Nodemon, ts-node |

## Configuration

### Frontend Environment Variables

Create `frontend/.env` (see `frontend/.env.example`):

```env
VITE_API_BASE_URL=http://localhost:8080
NODE_ENV=development
```

Optional variables for Google Maps and EmailJS:

```env
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
VITE_EMAILJS_SERVICE_ID=gmail
VITE_EMAILJS_TEMPLATE_ID=Automated_Email
VITE_EMAILJS_USER_ID=your-emailjs-user-id
```

### Backend Environment Variables

Create `backend/.env` (see `backend/.env.example`):

```env
# Server
NODE_ENV=development
PORT=8080
API_VERSION=v1

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=foodable
DB_CONNECTION_LIMIT=10

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_ROUNDS=10

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

## Database Setup

```sql
CREATE DATABASE foodable;
```

The backend automatically creates the required tables on first run:

- `donator` -- User accounts
- `donations` -- Food donations
- `food_packages` -- Donation packages
- `refresh_tokens` -- JWT refresh tokens

## Testing

### Frontend Tests

```bash
cd frontend

# Unit tests (Vitest)
npm test

# Tests with UI
npm run test:ui

# Tests with coverage
npm run test:coverage

# E2E tests (Playwright)
npm run test:e2e

# E2E tests with interactive UI
npm run test:e2e:ui
```

### Backend Tests

```bash
cd backend

# All tests with coverage
npm test

# Watch mode
npm run test:watch

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration
```

## CI/CD

The project uses **5 GitHub Actions workflows**:

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| **CI** | `ci.yml` | Push/PR to `main`/`develop` | Lint, type-check, frontend tests, backend tests (with MySQL service), production build |
| **PR Checks** | `pr-checks.yml` | Pull requests | Validate PR title (conventional commits), check PR size, auto-label, ESLint review via Reviewdog |
| **Release** | `release.yml` | Push to `main` | Automated semantic versioning, changelog generation, GitHub release |
| **Deploy** | `deploy.yml` | Manual or called by Release | Build both apps, package release tarball, create GitHub release asset |
| **Scheduled** | `scheduled.yml` | Weekly (Monday 2 AM UTC) | Deep security scan (npm audit, CodeQL, TruffleHog, license check), dependency freshness check, Lighthouse performance audit, Node.js compatibility matrix (18/20/22) |

### Quality Gates

All pull requests must pass:

- ESLint and Prettier checks (frontend + backend)
- TypeScript compilation (both workspaces)
- Frontend unit tests with coverage
- Backend unit + integration tests with MySQL
- Production build verification

### Commit Convention

The project enforces [Conventional Commits](https://www.conventionalcommits.org/) via commitlint:

```bash
feat: add user dashboard          # Minor version bump
fix: resolve login timeout        # Patch version bump
feat!: redesign auth API          # Major version bump (breaking)
docs: update API guide            # Patch version bump
```

Every push to `main` triggers semantic-release, which automatically calculates the next version, updates `CHANGELOG.md`, and creates a GitHub release.

See [docs/RELEASE_PROCESS.md](./docs/RELEASE_PROCESS.md) and [docs/CICD_DOCUMENTATION.md](./docs/CICD_DOCUMENTATION.md) for full details.

## Available Scripts

### Root Level (npm workspaces)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend + backend in parallel |
| `npm run build` | Build both projects |
| `npm test` | Run all tests |
| `npm run lint` | Lint all code |
| `npm run clean` | Remove node_modules and build artifacts |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev:frontend` | Vite dev server at `localhost:5173` |
| `npm run build:frontend` | Production build to `frontend/dist/` |
| `npm run test:frontend` | Vitest unit tests |
| `npm run lint:frontend` | ESLint |

### Backend

| Command | Description |
|---------|-------------|
| `npm run dev:backend` | Nodemon dev server at `localhost:8080` |
| `npm run build:backend` | TypeScript compilation to `backend/dist/` |
| `npm run test:backend` | Jest tests with coverage |
| `npm run lint:backend` | ESLint |

## Deployment

### Frontend

```bash
cd frontend && npm run build
# Deploy the dist/ folder to your hosting provider
```

Recommended: Vercel, Netlify, or GitHub Pages.

### Backend

```bash
cd backend && npm run build && npm start
```

Recommended: Railway, Heroku, DigitalOcean, or AWS EC2.

Make sure all environment variables are configured in your deployment platform.

## Documentation

Key documents in the `docs/` directory:

| Document | Description |
|----------|-------------|
| [CICD_DOCUMENTATION.md](./docs/CICD_DOCUMENTATION.md) | Full CI/CD pipeline reference |
| [RELEASE_PROCESS.md](./docs/RELEASE_PROCESS.md) | Semantic release workflow |
| [TESTING_GUIDE.md](./docs/TESTING_GUIDE.md) | Testing strategy and setup |
| [ACCESSIBILITY_REPORT.md](./docs/ACCESSIBILITY_REPORT.md) | WCAG compliance report |
| [MONOREPO_MIGRATION.md](./docs/MONOREPO_MIGRATION.md) | Monorepo setup guide |
| [BACKEND_IMPROVEMENTS.md](./docs/BACKEND_IMPROVEMENTS.md) | Backend architecture notes |

Additional references:

- [Backend API Documentation](./backend/API_DOCUMENTATION.md)
- [Contributing Guide](./CONTRIBUTING.md)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Make your changes following the coding standards
4. Commit using conventional commit messages (`git commit -m "feat: add feature"`)
5. Push to your branch (`git push origin feat/your-feature`)
6. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide, including coding standards, testing expectations, and the PR review process.

## License

This project is licensed under the MIT License.

## Team

Foodable Team -- [@BenDXC](https://github.com/BenDXC)

## Support

- GitHub Issues: [Create an issue](https://github.com/BenDXC/Foodable-Web-Dev/issues)
- Email: foodable7@gmail.com

## Roadmap

- [ ] File uploads for donation images
- [ ] Real-time notifications
- [ ] Email notifications for donation status changes
- [ ] Admin dashboard
- [ ] Donation analytics and reporting
- [ ] Mobile application
- [ ] Multi-language support (i18n)
- [ ] Third-party food bank API integrations
