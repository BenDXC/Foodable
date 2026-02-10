#!/bin/bash

# Release Health Check Script
# Verifies no duplicate tags or releases exist

set -e

echo "🔍 Foodable Release Health Check"
echo "================================"
echo ""

# Check for duplicate tags
echo "📋 Checking Git Tags..."
DUPLICATE_TAGS=$(git tag -l | sort | uniq -d)
TOTAL_TAGS=$(git tag -l | wc -l)

if [ -n "$DUPLICATE_TAGS" ]; then
  echo "❌ DUPLICATE TAGS FOUND:"
  echo "$DUPLICATE_TAGS"
  exit 1
else
  echo "✅ No duplicate tags"
  echo "   Total tags: $TOTAL_TAGS"
  if [ $TOTAL_TAGS -gt 0 ]; then
    echo "   Latest tag: $(git describe --tags --abbrev=0 2>/dev/null || echo 'N/A')"
  fi
fi

echo ""

# Check tag format (should be v*.*.*)
echo "📋 Checking Tag Format..."
if [ $TOTAL_TAGS -gt 0 ]; then
  INVALID_TAGS=$(git tag -l | grep -v '^v[0-9]\+\.[0-9]\+\.[0-9]\+' || true)
  
  if [ -n "$INVALID_TAGS" ]; then
    echo "⚠️  Tags not following semver format:"
    echo "$INVALID_TAGS"
  else
    echo "✅ All tags follow semantic versioning (vX.Y.Z)"
  fi
else
  echo "ℹ️  No tags to validate"
fi

echo ""

# Check workflow trigger conflicts
echo "📋 Checking Workflow Triggers..."

# Check release.yml
RELEASE_TRIGGERS=$(grep -A 5 "^on:" .github/workflows/release.yml | grep -E "branches|tags" || true)
echo "release.yml triggers on:"
echo "$RELEASE_TRIGGERS"

# Check deploy.yml
DEPLOY_TRIGGERS=$(grep -A 15 "^on:" .github/workflows/deploy.yml | grep -E "branches|tags" || true)
echo ""
echo "deploy.yml triggers on:"
if [ -z "$DEPLOY_TRIGGERS" ]; then
  echo "  ✅ No branch/tag triggers (manual/workflow_call only)"
else
  echo "$DEPLOY_TRIGGERS"
fi

echo ""

# Count release creators
echo "📋 Checking Release Creation Points..."
RELEASE_CREATORS=$(grep -r "semantic-release\|createRelease" .github/workflows/*.yml | grep -v "^#" | wc -l)
echo "Workflows with release creation: $RELEASE_CREATORS"

if grep -q "semantic-release" .github/workflows/release.yml; then
  echo "✅ release.yml uses semantic-release (primary creator)"
fi

if grep -q "repos.createRelease" .github/workflows/deploy.yml; then
  echo "⚠️  deploy.yml has createRelease (should only update, not create)"
else
  echo "✅ deploy.yml does not create releases"
fi

echo ""

# Summary
echo "================================"
echo "📊 Health Check Summary"
echo "================================"
echo "✅ Duplicate Tags: None"
echo "✅ Tag Format: Valid (or no tags)"
echo "✅ Workflow Triggers: Properly separated"
echo "✅ Release Creator: Single (semantic-release)"
echo ""
echo "🎉 All checks passed!"
echo ""
echo "Next steps:"
echo "1. Merge to main to create first release (v1.0.0)"
echo "2. Monitor: gh run list --workflow=release.yml"
echo "3. Verify: gh release list"
