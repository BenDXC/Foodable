# CI/CD Quick Reference Guide

## 🚀 Quick Commands

### Run Workflows Manually

```bash
# Main CI pipeline
gh workflow run ci.yml

# Individual workflows
gh workflow run frontend-tests.yml
gh workflow run backend-tests.yml
gh workflow run e2e-tests.yml
gh workflow run security.yml

# Deployment
gh workflow run deploy.yml -f environment=staging
gh workflow run deploy.yml -f environment=production
```

### Check Workflow Status

```bash
# List recent runs
gh run list

# List runs for specific workflow
gh run list --workflow=ci.yml

# View detailed run
gh run view <run-id>

# View logs
gh run view <run-id> --log

# View failed logs only
gh run view <run-id> --log-failed
```

### Download Artifacts

```bash
# Download all artifacts from a run
gh run download <run-id>

# Download specific artifact
gh run download <run-id> -n frontend-coverage
```

## 📊 Workflow Overview

| Workflow | Purpose | Trigger | Duration |
|----------|---------|---------|----------|
| `ci.yml` | Main CI orchestrator | Push, PR | ~30 min |
| `frontend-tests.yml` | Frontend tests | Push, PR | ~8 min |
| `backend-tests.yml` | Backend tests + lint | Push, PR | ~12 min |
| `e2e-tests.yml` | Playwright E2E | Push, PR, Weekly | ~25 min |
| `linting.yml` | Code quality | Push, PR | ~7 min |
| `build.yml` | Build verification | Push, PR | ~10 min |
| `security.yml` | Security scans | Push, Weekly | ~20 min |
| `deploy.yml` | Deployment | Main, Tags | ~18 min |
| `pr-validation.yml` | PR checks | PR | ~3 min |
| `dependency-update.yml` | Dep monitoring | Weekly | ~8 min |
| `performance.yml` | Performance tests | PR | ~15 min |

## 🎯 Status Badges

Add to your README:

```markdown
[![CI Pipeline](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/ci.yml/badge.svg)](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/ci.yml)
[![Frontend Tests](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/frontend-tests.yml/badge.svg)](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/frontend-tests.yml)
[![Backend Tests](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/backend-tests.yml/badge.svg)](https://github.com/BenDXC/Foodable-Web-Dev/actions/workflows/backend-tests.yml)
```

## 🔐 Required Secrets

### Essential (for deployment)
```bash
# Application
JWT_SECRET
API_URL

# Database
DB_HOST
DB_USER
DB_PASSWORD
DB_NAME
```

### Optional Deployment Platforms
```bash
# Vercel
VERCEL_TOKEN

# Netlify
NETLIFY_AUTH_TOKEN
NETLIFY_SITE_ID

# Heroku
HEROKU_API_KEY
HEROKU_APP_NAME
HEROKU_EMAIL

# SSH
SSH_HOST
SSH_USERNAME
SSH_PRIVATE_KEY
```

### Optional Services
```bash
# Security
SNYK_TOKEN

# Monitoring
SLACK_WEBHOOK
CODECOV_TOKEN
```

## 🔧 Setting Up Secrets

### Via GitHub UI
1. Go to repository Settings
2. Click "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add name and value
5. Click "Add secret"

### Via GitHub CLI
```bash
gh secret set JWT_SECRET --body "your-secret-key"
gh secret set API_URL --body "https://api.foodable.com"
```

### Environment Secrets
```bash
# Set secret for specific environment
gh secret set DB_PASSWORD --env production
```

## 🚦 Quality Gates

### What Blocks Merging

❌ **Must Pass:**
- Frontend tests
- Backend tests
- Linting
- TypeScript checks
- Build

⚠️ **Warnings (Non-blocking):**
- Security scan (moderate)
- Performance tests
- Bundle size warnings

### Coverage Requirements

**Backend:**
- Branches: ≥ 70%
- Functions: ≥ 70%
- Lines: ≥ 70%
- Statements: ≥ 70%

**Frontend:**
- Existing coverage maintained
- New code covered

## 📋 Common Workflows

### Feature Development

```bash
# 1. Create feature branch
git checkout -b feat/new-feature

# 2. Make changes
# ... code ...

# 3. Run tests locally
npm test

# 4. Commit and push
git commit -m "feat: add new feature"
git push origin feat/new-feature

# 5. Workflows triggered:
#    - Frontend Tests (if frontend changed)
#    - Backend Tests (if backend changed)
#    - Linting
#    - Build

# 6. Create PR
gh pr create

# 7. Additional workflows triggered:
#    - PR Validation
#    - CI Pipeline
#    - E2E Tests
#    - Performance Tests

# 8. Review workflow results
gh pr checks

# 9. Merge when all pass
gh pr merge
```

### Hotfix Deployment

```bash
# 1. Create hotfix branch
git checkout -b hotfix/critical-fix main

# 2. Make fix
# ... code ...

# 3. Run tests
npm test

# 4. Commit and push
git commit -m "fix: critical bug"
git push origin hotfix/critical-fix

# 5. Create PR to main
gh pr create --base main

# 6. After approval and CI pass
gh pr merge

# 7. Deploy automatically triggers
#    (on push to main)
```

### Release Process

```bash
# 1. Update version in package.json
npm version patch  # or minor, major

# 2. Push tag
git push origin v1.0.1

# 3. Workflows triggered:
#    - Full CI Pipeline
#    - Security Scan
#    - Deploy to Production
#    - Create Release Notes

# 4. Monitor deployment
gh run list --workflow=deploy.yml
gh run view <run-id>
```

## 🐛 Troubleshooting

### Workflow Not Triggering

**Check:**
1. Path filters match your changes
2. Branch name matches trigger pattern
3. Workflow file syntax is valid

**Fix:**
```bash
# Validate workflow syntax
gh workflow view ci.yml

# Manually trigger
gh workflow run ci.yml
```

### Tests Failing in CI but Pass Locally

**Common Causes:**
1. Environment variables missing
2. Node version mismatch
3. Timing issues in tests
4. Database not ready

**Debug:**
```bash
# Download logs
gh run view <run-id> --log-failed

# Re-run with debug
# Add to workflow: ACTIONS_STEP_DEBUG: true
```

### Deployment Fails

**Check:**
1. Secrets are configured
2. Deployment target is accessible
3. Build artifacts exist
4. Health check endpoint responding

**Rollback:**
```bash
# Revert deployment
git revert <commit-hash>
git push origin main

# Or use GitHub UI → Deployments → Redeploy previous
```

### Cache Issues

**Clear cache:**
```bash
# Via GitHub CLI
gh cache list
gh cache delete <cache-key>

# Or in workflow, change cache key
# key: v2-${{ hashFiles('package-lock.json') }}
```

## 📈 Monitoring

### GitHub Actions Dashboard
- https://github.com/BenDXC/Foodable-Web-Dev/actions

### Coverage Reports
- https://codecov.io/gh/BenDXC/Foodable-Web-Dev

### Workflow Insights
```bash
# View workflow usage
gh api repos/BenDXC/Foodable-Web-Dev/actions/workflows

# View run statistics
gh api repos/BenDXC/Foodable-Web-Dev/actions/runs
```

## ⚡ Performance Tips

### Speed Up Workflows

1. **Use caching**
   ```yaml
   - uses: actions/cache@v3
   ```

2. **Run in parallel**
   ```yaml
   jobs:
     job1:
     job2:  # Runs parallel to job1
   ```

3. **Use path filters**
   ```yaml
   paths:
     - 'frontend/**'
   ```

4. **Matrix optimization**
   ```yaml
   strategy:
     matrix:
       node: [18, 20]  # Only test what you need
   ```

5. **Fast-fail**
   ```yaml
   strategy:
     fail-fast: true
   ```

## 🎯 Workflow Triggers

### Manual Trigger
```bash
gh workflow run <workflow>.yml
```

### On Schedule
```yaml
on:
  schedule:
    - cron: '0 0 * * 1'  # Weekly Monday
```

### On Specific Events
```yaml
on:
  pull_request:
    types: [opened, synchronize]
  push:
    branches: [main]
    paths:
      - 'frontend/**'
```

## 📞 Getting Help

### Resources
- [Full CI/CD Documentation](./CICD_DOCUMENTATION.md)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Workflow Examples](../.github/workflows/)

### Support
- Create issue with `ci` label
- Check workflow logs
- Review documentation

---

**Quick Start**: `gh workflow run ci.yml`  
**View Status**: `gh run list`  
**Get Logs**: `gh run view <run-id> --log`
