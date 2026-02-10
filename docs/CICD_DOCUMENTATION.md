# CI/CD Pipeline Documentation

## Overview

The Foodable project uses GitHub Actions for continuous integration, automated releases, and scheduled maintenance. There are **5 workflow files** in `.github/workflows/`.

## Workflow Summary

| # | Workflow | File | Trigger | Purpose |
|---|----------|------|---------|---------|
| 1 | **CI** | `ci.yml` | Push/PR to `main` or `develop` | Lint, type-check, test, and build both frontend and backend |
| 2 | **PR Checks** | `pr-checks.yml` | Pull requests | Validate PR title, check size, auto-label, ESLint review |
| 3 | **Release** | `release.yml` | Push to `main` | Semantic release: version bump, changelog, GitHub release |
| 4 | **Deploy** | `deploy.yml` | Manual or called by Release | Build, package, and upload release assets |
| 5 | **Scheduled** | `scheduled.yml` | Weekly (Monday 2 AM UTC) | Security scan, dependency check, performance audit, Node compat |

## 1. CI Workflow (`ci.yml`)

**Triggers:** Push or PR to `main`/`develop`, manual dispatch.

**Concurrency:** Cancels in-progress runs for the same ref.

### Jobs

| Job | Name | Timeout | Description |
|-----|------|---------|-------------|
| `lint` | Lint & Type Check | 10 min | ESLint (frontend + backend), Prettier check, TypeScript `--noEmit` |
| `test-frontend` | Frontend Tests | 15 min | Vitest with coverage, uploads to Codecov |
| `test-backend` | Backend Tests | 20 min | Jest with coverage, MySQL 8.0 service container, uploads to Codecov |
| `build` | Build | 15 min | Vite production build (frontend), `tsc` (backend), verifies output dirs |

All jobs run on `ubuntu-latest` with Node.js 20 and npm caching.

### Backend Test Environment

The backend test job spins up a MySQL 8.0 service container with:

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=test_password
DB_NAME=foodable_test
```

## 2. PR Checks (`pr-checks.yml`)

**Triggers:** Pull request opened, synchronized, reopened, edited, or marked ready for review.

**Concurrency:** One run per PR number.

### Jobs

| Job | Name | Timeout | Description |
|-----|------|---------|-------------|
| `validate` | Validate PR | 5 min | Conventional commit title check (`amannn/action-semantic-pull-request`), PR size warning (>100 files), auto-labeling |
| `code-review` | Automated Code Review | 10 min | ESLint with inline PR annotations via Reviewdog |

### Auto-Labeling

Labels are automatically applied based on changed file paths (configured in `.github/labeler.yml`):

| Label | Matches |
|-------|---------|
| `frontend` | `frontend/**/*` |
| `backend` | `backend/**/*` |
| `documentation` | `**/*.md`, `docs/**/*` |
| `tests` | `**/*.test.*`, `**/*.spec.*` |
| `ci` | `.github/**/*` |
| `dependencies` | `**/package.json` |
| `security` | `**/auth*`, `**/security*` |

## 3. Release Workflow (`release.yml`)

**Triggers:** Push to `main`, manual dispatch.

**Concurrency:** Non-cancelling (ensures releases complete).

### Jobs

| Job | Name | Description |
|-----|------|-------------|
| `release` | Semantic Release | Analyzes commits, calculates version, generates changelog, creates GitHub release and git tag |
| `upload-assets` | Upload Release Assets | Calls `deploy.yml` to build and attach release tarball (only if a new release was published) |

### Semantic Release Plugins

Configured in `.releaserc.json`:

1. **commit-analyzer** -- Determines version bump from conventional commits
2. **release-notes-generator** -- Generates structured release notes
3. **changelog** -- Updates `CHANGELOG.md`
4. **npm** -- Updates `package.json` versions (no publish)
5. **github** -- Creates GitHub release with assets
6. **git** -- Commits changelog and version updates back to repo

### Version Bump Rules

| Commit type | Release | Example |
|-------------|---------|---------|
| `feat:` | Minor (1.0.0 -> 1.1.0) | `feat: add user dashboard` |
| `fix:` | Patch (1.0.0 -> 1.0.1) | `fix: resolve login bug` |
| `perf:` | Patch | `perf: optimize query` |
| `docs:` | Patch | `docs: update guide` |
| `refactor:` | Patch | `refactor: simplify auth` |
| `feat!:` / `BREAKING CHANGE` | Major (1.0.0 -> 2.0.0) | `feat!: redesign API` |
| `style:`, `test:`, `build:`, `ci:`, `chore:` | No release | -- |

## 4. Deploy Workflow (`deploy.yml`)

**Triggers:** Manual dispatch (with version input), or called by the Release workflow.

**Concurrency:** Non-cancelling (one deploy at a time).

### Jobs

| Job | Name | Timeout | Description |
|-----|------|---------|-------------|
| `build-and-release` | Build & Create GitHub Release | 15 min | Install deps, build frontend and backend, package into tarball, attach to GitHub release |

The tarball (`foodable-<version>.tar.gz`) contains:
- `release-package/frontend/` -- Vite production build
- `release-package/backend/` -- Compiled TypeScript

## 5. Scheduled Checks (`scheduled.yml`)

**Triggers:** Weekly cron (Monday 2 AM UTC), manual dispatch.

### Jobs

| Job | Name | Timeout | Description |
|-----|------|---------|-------------|
| `security-deep` | Deep Security Scan | 30 min | npm audit, CodeQL analysis, TruffleHog secret scan, license check |
| `dependency-check` | Dependency Updates | 10 min | Checks outdated packages (frontend + backend matrix), creates/updates GitHub issues |
| `performance` | Performance Audit | 20 min | Lighthouse CI on built frontend, bundle size check (5 MB limit) |
| `compatibility` | Node.js Compatibility | 15 min | Build both apps on Node 18, 20, and 22 |

### Security Tools

| Tool | Purpose |
|------|---------|
| `npm audit` | Dependency vulnerability scan |
| CodeQL (`github/codeql-action`) | Semantic code analysis |
| TruffleHog (`trufflesecurity/trufflehog`) | Secret detection in history |
| `license-checker` | License compliance |

### Dependency Update Issues

When outdated packages are found, the workflow automatically creates or updates a GitHub issue titled `deps(<workspace>): outdated packages` with a list of packages and their current/latest versions.

## Quality Gates

All PRs are expected to pass:

- ESLint and Prettier (frontend + backend)
- TypeScript compilation (`--noEmit`)
- Frontend unit tests (Vitest)
- Backend unit + integration tests (Jest + MySQL)
- Production build (frontend `dist/`, backend `dist/`)

## Required Secrets

### Built-in (automatic)

- `GITHUB_TOKEN` -- Used by all workflows for checkout, releases, PR comments, and issue creation.

### Optional

| Secret | Used by | Purpose |
|--------|---------|---------|
| `CODECOV_TOKEN` | CI | Coverage upload (may work without for public repos) |
| `SNYK_TOKEN` | Scheduled | Advanced vulnerability scanning (if Snyk step is added) |

## Running Workflows Manually

```bash
# Trigger the CI pipeline
gh workflow run ci.yml

# Trigger a release
gh workflow run release.yml

# Trigger a deploy with a specific version
gh workflow run deploy.yml -f version=v1.2.3

# Trigger scheduled checks
gh workflow run scheduled.yml

# View recent runs
gh run list

# View logs for a specific run
gh run view <run-id> --log

# Re-run failed jobs
gh run rerun <run-id> --failed
```

## Workflow File Locations

```
.github/
├── workflows/
│   ├── ci.yml          # Main CI: lint, test, build
│   ├── pr-checks.yml   # PR validation & code review
│   ├── release.yml     # Semantic release
│   ├── deploy.yml      # Build & package release assets
│   └── scheduled.yml   # Weekly security, deps, perf, compat
├── labeler.yml         # Auto-labeling rules for PRs
└── PULL_REQUEST_TEMPLATE.md
```
