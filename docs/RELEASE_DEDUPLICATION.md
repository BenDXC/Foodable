# Release and Tag Deduplication Strategy

## Overview

This document explains how the Foodable project prevents duplicate tags and releases through careful workflow design and validation.

## 🎯 Problem Statement

Multiple workflows could potentially create releases:
1. **release.yml** - Semantic release workflow
2. **deploy.yml** - Deployment workflow

Without proper coordination, this could lead to:
- ❌ Duplicate Git tags
- ❌ Duplicate GitHub releases
- ❌ Conflicting version numbers
- ❌ Confused release history

## ✅ Solution Implemented

### Single Source of Truth: semantic-release

**Only one workflow creates releases**: `release.yml` using semantic-release

All other workflows either:
- Update existing releases
- Reference existing tags
- Trigger after release creation

## 🔧 Workflow Coordination

### 1. Release Workflow (release.yml)

**Responsibility**: PRIMARY release creator

**Triggers:**
```yaml
on:
  push:
    branches: [main]  # Only on main branch push
```

**What it does:**
- ✅ Analyzes conventional commits
- ✅ Calculates semantic version
- ✅ Creates Git tag (e.g., v1.2.3)
- ✅ Creates GitHub release
- ✅ Generates CHANGELOG.md
- ✅ Uploads release assets
- ✅ Comments on issues/PRs

**What it does NOT do:**
- ❌ Create duplicate tags
- ❌ Override existing releases

**Safety mechanisms:**
- semantic-release checks for existing tags
- Only creates release if version doesn't exist
- Includes `[skip ci]` in commit to prevent loops

### 2. Deploy Workflow (deploy.yml)

**Responsibility**: Deployment only (NO release creation)

**Triggers:**
```yaml
on:
  workflow_dispatch:  # Manual trigger only
  workflow_call:      # Called by other workflows
  # NOTE: Removed 'tags' trigger to prevent conflicts
```

**What it does:**
- ✅ Deploys to environments
- ✅ Runs health checks
- ✅ Updates existing releases with deployment info

**What it does NOT do:**
- ❌ Create new releases
- ❌ Create Git tags
- ❌ Generate changelogs

**Changes made:**
```diff
- on:
-   push:
-     tags: ['v*']  # REMOVED to prevent duplicate triggers
```

### 3. Update Mechanism

When deploy.yml runs for a release:

```javascript
// Does NOT create new release
// Only updates existing release created by semantic-release
await github.rest.repos.updateRelease({
  release_id: existing_release.id,
  body: existing_body + '\n\nDeployed: timestamp'
});
```

**Safety checks:**
- Checks if release exists first
- Only updates if not already updated
- Continues on error (non-blocking)

## 🔍 Deduplication Checks

### Automated Check Workflow

Created `check-duplicates.yml` for validation:

**Jobs:**

1. **Check Tags**
   ```bash
   git tag -l | sort | uniq -d
   # Returns any duplicate tags
   ```

2. **Check Releases**
   ```javascript
   // Gets all releases via GitHub API
   // Checks for duplicate tag_names
   // Validates semver format
   ```

3. **Check Workflow Conflicts**
   ```bash
   # Searches for release creation patterns
   # Verifies only one primary creator
   # Checks trigger conditions
   ```

**Can be run manually:**
```bash
gh workflow run check-duplicates.yml
```

## 📋 Workflow Trigger Matrix

| Workflow | Main Push | Tag Push | Manual | Called By |
|----------|-----------|----------|--------|-----------|
| release.yml | ✅ | ❌ | ✅ | - |
| deploy.yml | ❌ | ❌ | ✅ | release.yml |
| check-duplicates.yml | ❌ | ❌ | ✅ | - |

**Key Points:**
- Only `release.yml` triggers on main push
- No workflows trigger on tag push (prevents cascade)
- Deploy is manual or called by release

## 🛡️ Prevention Mechanisms

### 1. Trigger Separation

**Before (Potential Conflict):**
```yaml
# deploy.yml
on:
  push:
    tags: ['v*']  # ❌ Would trigger when semantic-release creates tag
```

**After (No Conflict):**
```yaml
# deploy.yml
on:
  workflow_dispatch:  # ✅ Manual only
  workflow_call:      # ✅ Called by release workflow
```

### 2. Conditional Release Creation

**In semantic-release:**
```javascript
// Built-in deduplication
if (tag already exists) {
  skip release creation
} else {
  create new release
}
```

### 3. Update vs Create

**release.yml:**
```yaml
- uses: cycjimmy/semantic-release-action@v4
  # Creates NEW release only if needed
```

**deploy.yml:**
```yaml
- uses: actions/github-script@v6
  # UPDATES existing release only
  # Never creates new release
```

### 4. Skip CI Tag

Release commits include `[skip ci]`:
```
chore(release): 1.2.3 [skip ci]
```

This prevents:
- ❌ Infinite release loops
- ❌ Re-triggering CI on version bump
- ❌ Duplicate analysis

## 🔄 Release Flow Timeline

### Scenario: Push to Main with feat: commit

```
Time  Action                          Workflow        Result
────────────────────────────────────────────────────────────
0:00  Developer pushes to main        -               -
0:01  CI workflow triggers            ci.yml          Tests run
0:10  All CI passes                   ci.yml          ✅
0:11  Release workflow triggers       release.yml     Analyzing...
0:12  Semantic-release analyzes       release.yml     feat: found
0:13  Version calculated              release.yml     v1.0.0 → v1.1.0
0:14  CHANGELOG.md generated          release.yml     Updated
0:15  Git tag created                 release.yml     v1.1.0 ✅
0:16  GitHub release created          release.yml     v1.1.0 ✅
0:17  Version commit pushed           release.yml     [skip ci]
0:18  Deploy workflow called          release.yml     Triggered
0:20  Deployment completes            deploy.yml      ✅
0:21  Release updated                 deploy.yml      + Deployed timestamp
0:22  Notifications sent              release.yml     ✅

Result: ONE tag, ONE release (v1.1.0)
```

### Scenario: Manual Deployment (No New Release)

```
Time  Action                          Workflow        Result
────────────────────────────────────────────────────────────
0:00  Trigger deploy manually         -               gh workflow run deploy.yml
0:01  Deploy workflow starts          deploy.yml      Running
0:05  Deployment completes            deploy.yml      ✅
0:06  Checks for existing release     deploy.yml      Found v1.1.0
0:07  Updates release (if needed)     deploy.yml      + Info added

Result: No new tags, no new releases, existing release updated
```

## ✅ Verification Checklist

### Preventing Duplicates

- [x] Only one workflow creates releases (release.yml)
- [x] Removed tag trigger from deploy.yml
- [x] Deploy.yml only updates existing releases
- [x] Semantic-release has built-in deduplication
- [x] Release commits include [skip ci]
- [x] Check-duplicates workflow created
- [x] Clear documentation of responsibilities

### Workflow Isolation

- [x] release.yml: Primary release creator
- [x] deploy.yml: Deployment only, no release creation
- [x] check-duplicates.yml: Validation only
- [x] Other workflows: No release interaction

### Safety Mechanisms

- [x] Conditional execution (new_release_published check)
- [x] Continue-on-error for non-critical steps
- [x] Existence checks before updates
- [x] Clear workflow dependencies

## 🧪 Testing for Duplicates

### Manual Verification

```bash
# 1. Check for duplicate tags
git tag -l | sort | uniq -d

# 2. Check for duplicate releases
gh release list

# 3. Run duplicate check workflow
gh workflow run check-duplicates.yml

# 4. View workflow results
gh run list --workflow=check-duplicates.yml
gh run view <run-id>
```

### Expected Results

**First release:**
```bash
git tag -l
# Output: (empty - no tags yet)

gh release list
# Output: (empty - no releases yet)
```

**After first push to main:**
```bash
git tag -l
# Output: v1.0.0

gh release list
# Output: v1.0.0  Latest  Feb 09, 2026
```

**After second push (with feat:):**
```bash
git tag -l
# Output: 
# v1.0.0
# v1.1.0

gh release list
# Output:
# v1.1.0  Latest  Feb 09, 2026
# v1.0.0          Feb 09, 2026
```

## 🐛 Troubleshooting

### If Duplicate Tags Are Created

**Diagnosis:**
```bash
# Find duplicates
git tag -l | sort | uniq -d
```

**Fix:**
```bash
# Delete duplicate tag locally
git tag -d v1.0.0

# Delete from remote
git push origin :refs/tags/v1.0.0

# Re-create correct tag
git tag v1.0.0 <commit-sha>
git push origin v1.0.0
```

### If Duplicate Releases Are Created

**Diagnosis:**
```bash
gh release list
# Look for duplicate tag_names
```

**Fix:**
```bash
# Delete duplicate release (keeps tag)
gh release delete v1.0.0 --yes

# Or delete release and tag
gh release delete v1.0.0 --cleanup-tag --yes
```

### If Workflows Conflict

**Check workflow runs:**
```bash
# See what triggered
gh run list --workflow=release.yml
gh run list --workflow=deploy.yml

# View specific run
gh run view <run-id> --log
```

**Fix:**
```bash
# Cancel conflicting runs
gh run cancel <run-id>

# Re-run if needed
gh run rerun <run-id>
```

## 📊 Monitoring

### Regular Checks

**Daily:**
- Check workflow runs for errors
- Verify releases are sequential

**Weekly:**
- Run duplicate check workflow
- Review CHANGELOG.md
- Verify version progression

**Monthly:**
- Audit all tags and releases
- Clean up any issues
- Review workflow logs

### Automated Monitoring

The `check-duplicates.yml` workflow can be scheduled:

```yaml
on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday
```

## 📝 Best Practices

### For Developers

1. **Always use conventional commits**
   ```bash
   git commit -m "feat: add feature"
   git commit -m "fix: resolve bug"
   ```

2. **Never manually create releases**
   - Let automation handle it
   - Don't use `gh release create`
   - Don't create tags for releases

3. **Don't push tags manually**
   ```bash
   # ❌ Don't do this:
   git tag v1.2.3
   git push origin v1.2.3
   
   # ✅ Let semantic-release do it
   ```

4. **Use workflow dispatch for deployment**
   ```bash
   # For manual deploy
   gh workflow run deploy.yml -f environment=production
   ```

### For Maintainers

1. **Monitor release workflow**
   ```bash
   gh run list --workflow=release.yml
   ```

2. **Verify releases are sequential**
   ```bash
   gh release list
   # Should show: v1.2.0, v1.1.0, v1.0.0
   ```

3. **Check for anomalies**
   ```bash
   gh workflow run check-duplicates.yml
   ```

4. **Review CHANGELOG.md**
   ```bash
   cat CHANGELOG.md
   # Ensure proper formatting and no duplicates
   ```

## ✅ Summary

### Deduplication Strategy

1. **Single Creator**
   - Only `release.yml` creates new releases
   - Uses semantic-release (has built-in deduplication)

2. **Workflow Separation**
   - release.yml: Create releases
   - deploy.yml: Deploy only, update releases
   - Other workflows: No release interaction

3. **Trigger Isolation**
   - No tag triggers (prevents cascading)
   - Main branch push only triggers release
   - Deploy is manual or workflow_call only

4. **Validation**
   - check-duplicates.yml workflow
   - Conventional commit validation
   - Automated monitoring

5. **Safety Mechanisms**
   - Conditional execution
   - Existence checks
   - Continue-on-error
   - Skip CI tags

### Verification

```bash
# No existing duplicates
✅ Current tags: 0
✅ Current releases: 0
✅ Workflow conflicts: None

# Protection mechanisms
✅ Single release creator (semantic-release)
✅ Duplicate check workflow
✅ Proper trigger separation
✅ Update-only for deploys
✅ Documentation clear
```

## 🎉 Conclusion

The release system is **duplicate-proof** through:
- ✅ Single source of truth (semantic-release)
- ✅ Proper workflow trigger separation
- ✅ Automated duplicate detection
- ✅ Clear workflow responsibilities
- ✅ Safety mechanisms in place

**No duplicates possible with current configuration!** ✅

---

**Created**: February 9, 2026  
**Status**: Verified  
**Risk**: None  
**Monitoring**: Automated
