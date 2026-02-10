# Foodable - Food Donation Platform 🍎

[![CI Pipeline](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/ci.yml/badge.svg)](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/ci.yml)
[![Frontend Tests](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/frontend-tests.yml/badge.svg)](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/frontend-tests.yml)
[![Backend Tests](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/backend-tests.yml/badge.svg)](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/backend-tests.yml)
[![E2E Tests](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/e2e-tests.yml)
[![Security](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/security.yml/badge.svg)](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/security.yml)
[![Linting](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/linting.yml/badge.svg)](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/linting.yml)
[![Build](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/build.yml/badge.svg)](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/build.yml)
[![codecov](https://codecov.io/gh/BenDXC/Foodable-Web-Dev/branch/main/graph/badge.svg)](https://codecov.io/gh/BenDXC/Foodable-Web-Dev)

A full-stack web application connecting food donors with food banks and receivers, helping reduce food waste while supporting those in need.

## 📁 Project Structure (Monorepo)

```
foodable/
├── frontend/              # React + TypeScript frontend
│   ├── src/
│   ├── public/
│   ├── e2e/              # Playwright tests
│   ├── package.json
│   └── vite.config.ts
├── backend/              # Express + TypeScript API
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── config/
│   │   └── utils/
│   ├── package.json
│   └── tsconfig.json
├── docs/                 # Documentation
├── package.json          # Root workspace config
└── README.md            # This file
```

## 🚀 Quick Start

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

# Setup environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Configure your .env files with database credentials
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

# Run frontend tests only
npm run test:frontend

# Run backend tests only
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

## 🎯 Features

### Frontend
- ✅ Modern React 18 with TypeScript
- ✅ Vite for fast development
- ✅ React Router for navigation
- ✅ Axios for API calls
- ✅ React Hot Toast for notifications
- ✅ Comprehensive accessibility (ARIA, WCAG 2.1)
- ✅ Playwright E2E tests
- ✅ Responsive design
- ✅ Protected routes with authentication

### Backend
- ✅ Express.js with TypeScript
- ✅ JWT authentication with refresh tokens
- ✅ MySQL database with connection pooling
- ✅ Comprehensive error handling
- ✅ Request validation with express-validator
- ✅ Security middleware (Helmet, CORS, rate limiting)
- ✅ Winston logging with request tracing
- ✅ Health check endpoints
- ✅ RESTful API design
- ✅ Async/await patterns throughout

## 📚 API Documentation

The backend API is fully documented. See:
- [API Documentation](./backend/API_DOCUMENTATION.md)
- [Backend README](./backend/README.md)

**Base URL**: `http://localhost:8080/api/v1`

### Quick API Reference

**Authentication**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/profile` - Get user profile
- `POST /auth/refresh` - Refresh access token

**Users**
- `GET /users` - Get all users (paginated)
- `GET /users/:id` - Get user by ID
- `PUT /users/profile` - Update profile

**Donations**
- `POST /donations` - Create donation
- `GET /donations` - List donations (paginated)
- `GET /donations/my-donations` - User's donations
- `PUT /donations/:id` - Update donation
- `DELETE /donations/:id` - Delete donation

**System**
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system status

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API
- **UI Notifications**: React Hot Toast
- **Testing**: Vitest, Playwright
- **Styling**: CSS3

### Backend
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Logging**: Winston
- **Security**: Helmet, CORS, bcrypt
- **Development**: Nodemon, ts-node

## 📂 Directory Details

### Frontend (`/frontend`)

```
frontend/
├── src/
│   ├── Components/
│   │   ├── MPComponents/    # Main page components
│   │   ├── pages/           # Page components
│   │   ├── shared/          # Shared components
│   │   └── Axios/           # HTTP client setup
│   ├── context/             # React Context
│   ├── hooks/               # Custom hooks
│   ├── services/            # API services
│   ├── types/               # TypeScript types
│   ├── utils/               # Utility functions
│   ├── constants/           # Constants
│   ├── App.tsx              # Main App component
│   └── index.tsx            # Entry point
├── public/                  # Static assets
├── e2e/                     # E2E tests
└── package.json
```

### Backend (`/backend`)

```
backend/
├── src/
│   ├── controllers/         # Route controllers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── donation.controller.ts
│   │   └── health.controller.ts
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   ├── validation.ts
│   │   ├── security.ts
│   │   └── requestId.ts
│   ├── routes/              # API routes
│   ├── config/              # Configuration
│   │   ├── database.ts
│   │   └── index.ts
│   ├── types/               # TypeScript types
│   ├── utils/               # Utilities
│   │   ├── logger.ts
│   │   ├── response.ts
│   │   └── constants.ts
│   ├── app.ts               # Express app
│   └── server.ts            # Server entry
└── package.json
```

## 🔧 Configuration

### Frontend Environment Variables

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### Backend Environment Variables

Create `backend/.env`:

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

# Security
BCRYPT_ROUNDS=10

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

## 🗄️ Database Setup

```sql
-- Create database
CREATE DATABASE foodable;

-- Tables are created automatically on first run
```

The backend will automatically create these tables:
- `donator` - User accounts
- `donations` - Food donations
- `food_packages` - Donation packages
- `refresh_tokens` - JWT refresh tokens

## 🧪 Testing

### Frontend Tests

```bash
cd frontend

# Unit tests
npm test

# E2E tests with Playwright
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui
```

### Backend Tests

```bash
cd backend

# Run all tests with coverage
npm test

# Run in watch mode
npm run test:watch

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration
```

## 🔄 CI/CD Pipeline

### Automated Workflows

The project includes **11 independent GitHub Actions workflows**:

#### Testing Pipelines
- **Frontend Tests** - Unit & component tests (3 Node versions)
- **Backend Tests** - Unit & integration tests with MySQL
- **E2E Tests** - Playwright across 3 browsers (sharded)

#### Quality Pipelines
- **Linting** - ESLint, Prettier, TypeScript checks
- **Code Review** - Automated reviews, complexity analysis
- **Performance** - Lighthouse, bundle size, load testing

#### Security Pipelines
- **Security Scan** - npm audit, Snyk, CodeQL, secret detection

#### Build & Deploy Pipelines
- **Build** - Production builds for frontend & backend
- **Deploy** - Multi-environment deployment
- **CI Pipeline** - Main orchestrator
- **PR Validation** - PR title, size, conflicts

### Running Workflows

```bash
# View all workflows
gh workflow list

# Run specific workflow
gh workflow run frontend-tests.yml
gh workflow run backend-tests.yml

# View workflow status
gh run list --workflow=ci.yml

# View detailed logs
gh run view <run-id> --log
```

### Quality Gates

All PRs must pass:
- ✅ Frontend tests
- ✅ Backend tests
- ✅ Linting
- ✅ Build
- ✅ TypeScript checks
- ✅ Coverage thresholds (70% backend)

See [CI/CD Documentation](./docs/CICD_DOCUMENTATION.md) for complete details.

## 📦 Available Scripts

### Root Level

```bash
npm run dev              # Start both frontend and backend
npm run build            # Build both projects
npm test                 # Run all tests
npm run lint             # Lint all code
npm run clean            # Clean all node_modules and build artifacts
```

### Frontend Specific

```bash
npm run dev:frontend     # Start frontend dev server
npm run build:frontend   # Build frontend for production
npm run test:frontend    # Run frontend tests
npm run lint:frontend    # Lint frontend code
```

### Backend Specific

```bash
npm run dev:backend      # Start backend dev server
npm run build:backend    # Build backend for production
npm run test:backend     # Run backend tests
npm run lint:backend     # Lint backend code
```

## 🚀 Deployment

### Frontend Deployment

```bash
cd frontend
npm run build
# Deploy the 'dist' folder to your hosting service
```

Recommended platforms:
- Vercel
- Netlify
- GitHub Pages

### Backend Deployment

```bash
cd backend
npm run build
npm start
```

Recommended platforms:
- Heroku
- Railway
- DigitalOcean
- AWS EC2

### Environment Variables

Make sure to set all environment variables in your deployment platform.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards

- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Foodable Team - [@BenDXC](https://github.com/BenDXC)

## 🙏 Acknowledgments

- React community
- Express.js community
- All contributors and supporters

## 📞 Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/BenDXC/Foodable-Web-Dev/issues)
- Email: foodable7@gmail.com

## 🗺️ Roadmap

- [ ] Add file upload for donation images
- [ ] Implement real-time notifications
- [ ] Add email notifications
- [ ] Implement admin dashboard
- [ ] Add donation analytics
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Integration with food bank APIs

---

**Made with ❤️ by the Foodable Team**
