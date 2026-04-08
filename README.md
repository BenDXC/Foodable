# Foodable - Food Donation Platform

[![CI](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/ci.yml/badge.svg)](/actions/workflows/ci.yml)
[![Release](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/release.yml/badge.svg)](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/release.yml)
[![codecov](https://codecov.io/gh/BenDXC/Foodable-Web-Dev/branch/main/graph/badge.svg)](https://codecov.io/gh/BenDXC/Foodable-Web-Dev)

A full-stack web application connecting food donors with food banks and receivers, helping reduce food waste while supporting those in need. Donors can list surplus food, receivers can browse available food packages, and the platform provides a food bank locator powered by Google Maps.

## Quick Start

### Prerequisites

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0
- **MySQL** >= 5.7

### Installation

````bash
# Clone the repository
git clone https://github.com/BenDXC/Foodable.git
cd Foodable

# Install all dependencies (frontend + backend)
npm install


### Development

```bash
# Start both frontend and backend in development mode
npm run dev

### Building for Production

```bash
# Build both frontend and backend
npm run build

# Or build separately:
npm run build:frontend
npm run build:backend
````

### Testing

````bash
# Run all tests (frontend + backend)
npm test


### Linting

```bash
# Lint all code
npm run lint

````

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
- **Unit and integration tests** with ViTest

## Testing

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

````


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
````

Every push to `main` triggers semantic-release, which automatically calculates the next version, updates `CHANGELOG.md`, and creates a GitHub release.
