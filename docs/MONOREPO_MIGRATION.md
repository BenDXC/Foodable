# Monorepo Migration Guide

## Overview

This document explains the migration from the old project structure to the new unified monorepo structure.

## Previous Structure

```
Foodable-Web-Dev/
├── Foodable Website/
│   ├── Front-End/
│   │   └── foodable/      # React app
│   └── Back-End/
│       └── Foodable/      # Express API
├── ASYNC_AWAIT_REVIEW.md
├── BACKEND_IMPLEMENTATION_SUMMARY.md
└── BACKEND_IMPROVEMENTS.md
```

## New Structure (Monorepo)

```
Foodable-Web-Dev/
├── frontend/              # React app (moved from Foodable Website/Front-End/foodable/)
├── backend/               # Express API (moved from Foodable Website/Back-End/Foodable/)
├── docs/                  # All documentation
│   ├── ASYNC_AWAIT_REVIEW.md
│   ├── BACKEND_IMPLEMENTATION_SUMMARY.md
│   └── BACKEND_IMPROVEMENTS.md
├── package.json           # Root workspace configuration
├── README.md              # Updated main README
└── .gitignore            # Unified gitignore
```

## Benefits of Monorepo

### 1. **Simplified Project Management**
- Single repository for both frontend and backend
- Easier to maintain consistency
- Single version control history

### 2. **Unified Commands**
```bash
npm run dev              # Start both frontend and backend
npm test                 # Run all tests
npm run build            # Build everything
```

### 3. **Shared Dependencies**
- Common dev tools (TypeScript, ESLint, Prettier)
- Easier to keep versions in sync
- Reduced duplication

### 4. **Better Developer Experience**
- Single clone command
- One `npm install` for everything
- Easier onboarding for new developers

### 5. **Code Sharing**
- Can share types between frontend and backend
- Shared utilities and constants
- Better code reuse

## Migration Steps Performed

### 1. Created Directory Structure
```bash
mkdir -p frontend backend docs
```

### 2. Moved Files
- Frontend: `Foodable Website/Front-End/foodable/*` → `frontend/`
- Backend: `Foodable Website/Back-End/Foodable/*` → `backend/`
- Docs: `*.md` files → `docs/`

### 3. Created Root Configuration
- `package.json` with npm workspaces
- Unified `.gitignore`
- Updated `README.md`

### 4. Updated Scripts
Root `package.json` now includes:
- `npm run dev` - Start both servers
- `npm run build` - Build both projects
- `npm test` - Run all tests
- `npm run lint` - Lint all code

## Using the Monorepo

### Installation

```bash
# Clone and install everything
git clone https://github.com/BenDXC/Foodable-Web-Dev.git
cd Foodable-Web-Dev
npm install
```

### Development

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend
npm run dev:backend
```

### Working on Frontend Only

```bash
cd frontend
npm run dev
```

### Working on Backend Only

```bash
cd backend
npm run dev
```

### Building

```bash
# Build everything
npm run build

# Or build individually
npm run build:frontend
npm run build:backend
```

### Testing

```bash
# Run all tests
npm test

# Or test individually
npm run test:frontend
npm run test:backend
```

## Workspace Features

### npm Workspaces

The root `package.json` uses npm workspaces:

```json
{
  "workspaces": [
    "frontend",
    "backend"
  ]
}
```

This allows:
- Installing dependencies for all workspaces with one command
- Running scripts across all workspaces
- Sharing dependencies when possible

### Running Workspace Commands

```bash
# Run a script in specific workspace
npm run dev --workspace=frontend
npm run build --workspace=backend

# Install a package in a workspace
npm install axios --workspace=frontend
npm install express --workspace=backend
```

## File Locations

### Configuration Files

**Frontend:**
- `frontend/package.json` - Frontend dependencies
- `frontend/vite.config.ts` - Vite configuration
- `frontend/tsconfig.json` - TypeScript config
- `frontend/.env.example` - Environment template

**Backend:**
- `backend/package.json` - Backend dependencies
- `backend/tsconfig.json` - TypeScript config
- `backend/.env.example` - Environment template
- `backend/.eslintrc.json` - ESLint config

**Root:**
- `package.json` - Workspace configuration
- `.gitignore` - Unified ignore rules
- `README.md` - Main documentation

### Source Code

**Frontend:**
- `frontend/src/` - All React components and code
- `frontend/public/` - Static assets
- `frontend/e2e/` - Playwright tests

**Backend:**
- `backend/src/` - All Express code
- `backend/src/controllers/` - Route handlers
- `backend/src/middleware/` - Middleware
- `backend/src/routes/` - API routes

## Environment Variables

Both frontend and backend have their own `.env` files:

**Frontend** (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:8080
```

**Backend** (`backend/.env`):
```env
NODE_ENV=development
PORT=8080
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=foodable
JWT_SECRET=your_secret_key
```

## Port Configuration

- **Frontend**: http://localhost:5173 (Vite default)
- **Backend**: http://localhost:8080 (configured in backend/.env)

## CI/CD Considerations

### GitHub Actions

You can now have a single workflow that:
1. Installs all dependencies
2. Runs frontend tests
3. Runs backend tests
4. Builds both projects
5. Deploys both

Example:
```yaml
- name: Install dependencies
  run: npm install

- name: Run tests
  run: npm test

- name: Build
  run: npm run build
```

## Troubleshooting

### "Module not found"

Make sure you've run `npm install` at the root level:
```bash
npm install
```

### "Workspace not found"

Ensure you're in the root directory when running workspace commands.

### Port conflicts

If ports are already in use:
- Frontend: Change in `frontend/vite.config.ts`
- Backend: Change `PORT` in `backend/.env`

### Dependencies not installing

Try cleaning and reinstalling:
```bash
npm run clean
npm install
```

## Future Enhancements

### Shared Package

You could add a `shared/` workspace for code used by both:

```
Foodable-Web-Dev/
├── frontend/
├── backend/
├── shared/           # New shared package
│   ├── types/
│   └── utils/
└── package.json
```

Update root `package.json`:
```json
{
  "workspaces": [
    "frontend",
    "backend",
    "shared"
  ]
}
```

### Lerna or Turborepo

For more advanced monorepo features, consider:
- **Lerna**: Version management, publishing
- **Turborepo**: Build caching, parallel execution
- **Nx**: Advanced build system

## Best Practices

1. **Always work from root** for installation
2. **Use workspace commands** for specific tasks
3. **Keep dependencies separate** unless truly shared
4. **Document changes** in relevant workspace
5. **Test both workspaces** before committing

## Rollback

If you need to revert to the old structure:
```bash
git checkout <previous-commit>
```

The old structure is preserved in git history.

## Summary

The monorepo structure provides:
- ✅ Unified project management
- ✅ Simplified commands
- ✅ Better developer experience
- ✅ Easier maintenance
- ✅ Code sharing opportunities
- ✅ Single source of truth

All functionality remains the same, just better organized!
