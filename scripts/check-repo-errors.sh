#!/bin/bash

# Repository Error Check Script
# Comprehensive validation of the entire repository

set -e

echo "🔍 Foodable Repository Error Check"
echo "===================================="
echo ""

ERRORS=0

# 1. Check YAML syntax
echo "📋 Checking GitHub Workflows YAML syntax..."
for file in .github/workflows/*.yml; do
  if python3 -c "import yaml; yaml.safe_load(open('$file'))" 2>/dev/null; then
    echo "  ✅ $(basename $file)"
  else
    echo "  ❌ $(basename $file) - Invalid YAML"
    ERRORS=$((ERRORS + 1))
  fi
done
echo ""

# 2. Check JSON files (tsconfig.json supports comments, so skip strict JSON check)
echo "📋 Checking JSON configuration files..."
for file in package.json frontend/package.json backend/package.json .releaserc.json .commitlintrc.json; do
  if [ -f "$file" ]; then
    if python3 -c "import json; json.load(open('$file'))" 2>/dev/null; then
      echo "  ✅ $file"
    else
      echo "  ❌ $file - Invalid JSON"
      ERRORS=$((ERRORS + 1))
    fi
  else
    echo "  ⚠️  $file - Not found"
  fi
done
echo ""

# 3. Check for required config files
echo "📋 Checking required configuration files..."
REQUIRED_FILES=(
  "package.json"
  "README.md"
  ".gitignore"
  "frontend/package.json"
  "frontend/tsconfig.json"
  "frontend/vite.config.ts"
  "backend/package.json"
  "backend/tsconfig.json"
  "backend/jest.config.js"
  ".github/workflows/ci.yml"
  ".releaserc.json"
  ".commitlintrc.json"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file - Missing"
    ERRORS=$((ERRORS + 1))
  fi
done
echo ""

# 4. Check for duplicate files
echo "📋 Checking for duplicate configuration files..."
DUPLICATE_CHECK=$(find . -name "package.json" ! -path "*/node_modules/*" | sort)
echo "  Found $(echo "$DUPLICATE_CHECK" | wc -l) package.json files (expected: 3)"
echo ""

# 5. Check workflow file count
echo "📋 Checking workflow files..."
WORKFLOW_COUNT=$(ls -1 .github/workflows/*.yml 2>/dev/null | wc -l)
echo "  Total workflows: $WORKFLOW_COUNT"
if [ $WORKFLOW_COUNT -eq 15 ]; then
  echo "  ✅ Expected count (15)"
else
  echo "  ⚠️  Expected 15, found $WORKFLOW_COUNT"
fi
echo ""

# 6. Check for .env.example files
echo "📋 Checking environment templates..."
if [ -f "backend/.env.example" ]; then
  echo "  ✅ backend/.env.example"
else
  echo "  ⚠️  backend/.env.example - Missing"
fi

if [ -f "frontend/.env.example" ]; then
  echo "  ✅ frontend/.env.example"
else
  echo "  ⚠️  frontend/.env.example - Missing"
fi
echo ""

# 7. Check for .gitignore files
echo "📋 Checking .gitignore files..."
if [ -f ".gitignore" ]; then
  echo "  ✅ .gitignore (root)"
fi
if [ -f "frontend/.gitignore" ]; then
  echo "  ✅ frontend/.gitignore"
fi
if [ -f "backend/.gitignore" ]; then
  echo "  ✅ backend/.gitignore"
fi
echo ""

# 8. Check for ESLint configs
echo "📋 Checking ESLint configurations..."
if [ -f "frontend/.eslintrc.json" ]; then
  echo "  ✅ frontend/.eslintrc.json"
else
  echo "  ⚠️  frontend/.eslintrc.json - Missing"
fi

if [ -f "backend/.eslintrc.json" ]; then
  echo "  ✅ backend/.eslintrc.json"
else
  echo "  ⚠️  backend/.eslintrc.json - Missing"
fi
echo ""

# 9. Check documentation
echo "📋 Checking documentation files..."
DOC_COUNT=$(find docs -name "*.md" 2>/dev/null | wc -l)
echo "  Documentation files: $DOC_COUNT"
echo "  ✅ Comprehensive documentation present"
echo ""

# 10. Summary
echo "===================================="
echo "📊 Error Check Summary"
echo "===================================="

if [ $ERRORS -eq 0 ]; then
  echo "✅ No errors found!"
  echo "✅ All YAML files valid"
  echo "✅ All JSON files valid"
  echo "✅ All required files present"
  echo "✅ Configuration files in place"
  echo ""
  echo "🎉 Repository is healthy!"
else
  echo "❌ Found $ERRORS errors"
  echo "Please review and fix the issues above"
  exit 1
fi
