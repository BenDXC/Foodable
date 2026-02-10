# CI/CD Quick Reference

## Workflows

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| CI | `ci.yml` | Push/PR to `main`/`develop` | Lint, test, build |
| PR Checks | `pr-checks.yml` | Pull requests | Title validation, labeling, code review |
| Release | `release.yml` | Push to `main` | Semantic version + GitHub release |
| Deploy | `deploy.yml` | Manual / called by Release | Package release tarball |
| Scheduled | `scheduled.yml` | Weekly (Mon 2 AM UTC) | Security, deps, perf, Node compat |

## Running Workflows

```bash
# Trigger CI
gh workflow run ci.yml

# Trigger a release manually
gh workflow run release.yml

# Trigger deploy with version
gh workflow run deploy.yml -f version=v1.2.3

# Trigger scheduled checks
gh workflow run scheduled.yml
```

## Checking Status

```bash
# List recent runs
gh run list

# Runs for a specific workflow
gh run list --workflow=ci.yml

# View a run
gh run view <run-id>

# View failed logs only
gh run view <run-id> --log-failed

# Re-run failed jobs
gh run rerun <run-id> --failed

# Download artifacts
gh run download <run-id>
```

## Status Badges

```markdown
[![CI](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/ci.yml/badge.svg)](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/ci.yml)
[![Release](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/release.yml/badge.svg)](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/release.yml)
```

## Quality Gates (CI Workflow)

All PRs must pass:

- ESLint + Prettier (frontend and backend)
- TypeScript `--noEmit` (frontend and backend)
- Frontend unit tests (Vitest) with coverage
- Backend unit + integration tests (Jest) with MySQL service
- Production build verification

## Secrets

### Required (automatic)

- `GITHUB_TOKEN` -- provided by GitHub Actions

### Optional

| Secret | Purpose |
|--------|---------|
| `CODECOV_TOKEN` | Coverage upload |
| `SNYK_TOKEN` | Advanced vulnerability scanning |

## Feature Development Flow

```bash
git checkout -b feat/my-feature
# make changes
npm test && npm run lint
git commit -m "feat: add feature"
git push origin feat/my-feature
gh pr create
# CI + PR Checks run automatically
# merge after all checks pass
```

## Hotfix Flow

```bash
git checkout -b hotfix/fix main
# make fix
git commit -m "fix: critical bug"
git push origin hotfix/fix
gh pr create --base main
# merge -> release.yml auto-creates patch release
```

## Troubleshooting

**Workflow not triggering:** Check branch name matches trigger pattern, verify YAML syntax with `gh workflow view <file>`.

**Tests pass locally but fail in CI:** Check Node version (CI uses 20), ensure environment variables are set, check for timing-dependent tests.

**Cache problems:** List caches with `gh cache list`, delete with `gh cache delete <key>`.

For the full documentation, see [CICD_DOCUMENTATION.md](./CICD_DOCUMENTATION.md).
