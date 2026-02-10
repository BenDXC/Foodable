# Contributing to Foodable

Thank you for your interest in contributing to Foodable! This guide will help you get started.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Coding Standards](#coding-standards)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Maintain professionalism

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- MySQL >= 5.7
- Git

### Setup Development Environment

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/Foodable-Web-Dev.git
cd Foodable-Web-Dev

# 3. Add upstream remote
git remote add upstream https://github.com/BenDXC/Foodable-Web-Dev.git

# 4. Install dependencies
npm install

# 5. Configure environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit .env files with your local config

# 6. Start development servers
npm run dev
```

## 🔄 Development Workflow

### Creating a Feature Branch

```bash
# 1. Update main branch
git checkout main
git pull upstream main

# 2. Create feature branch
git checkout -b feat/your-feature-name

# 3. Make your changes
# ... code ...

# 4. Test your changes
npm test

# 5. Lint your code
npm run lint
```

### Keeping Your Branch Updated

```bash
# Regularly sync with upstream
git fetch upstream
git rebase upstream/main
```

## 📝 Commit Guidelines

### Conventional Commits Format

We use [Conventional Commits](https://www.conventionalcommits.org/) for automated releases.

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Types

| Type | Description | Version Bump |
|------|-------------|--------------|
| `feat` | New feature | Minor (1.0.0 → 1.1.0) |
| `fix` | Bug fix | Patch (1.0.0 → 1.0.1) |
| `docs` | Documentation | Patch |
| `style` | Code formatting | None |
| `refactor` | Code refactoring | Patch |
| `perf` | Performance improvement | Patch |
| `test` | Adding tests | None |
| `build` | Build system changes | None |
| `ci` | CI/CD changes | None |
| `chore` | Other changes | None |

### Examples

✅ **Good Commits:**
```bash
feat: add email notifications for donations
fix: resolve login timeout issue
docs: update API authentication guide
perf: optimize database query performance
test: add unit tests for auth service
```

❌ **Bad Commits:**
```bash
update code
fixed stuff
WIP
test
misc changes
```

### Breaking Changes

For major version bumps (1.0.0 → 2.0.0):

```bash
# Option 1: Use ! suffix
git commit -m "feat!: redesign authentication API"

# Option 2: Use BREAKING CHANGE in footer
git commit -m "feat: redesign authentication

BREAKING CHANGE: Authentication endpoints have new response format.
See docs/migration.md for upgrade guide."
```

### Commit Message Rules

1. **Type must be lowercase**: `feat` not `Feat`
2. **Subject must be sentence case**: Start with uppercase
3. **No period at end** of subject line
4. **Subject max 100 characters**
5. **Use imperative mood**: "add" not "added" or "adds"
6. **Reference issues**: `fixes #123`, `relates to #456`

## 🔍 Pull Request Process

### Before Creating PR

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] All tests pass locally
- [ ] Linting passes
- [ ] Documentation updated
- [ ] Commit messages are conventional

### Creating a Pull Request

```bash
# 1. Push your branch
git push origin feat/your-feature

# 2. Create PR via GitHub CLI
gh pr create --fill

# Or via GitHub UI
# Go to repository → Pull Requests → New Pull Request
```

### PR Title Format

Use conventional commit format:
```
feat: Add user profile editing
fix: Resolve login timeout issue
docs: Update API documentation
```

### PR Description Template

The repository includes a PR template. Fill it out completely:
- Description of changes
- Type of change
- Related issues
- Testing done
- Checklist items

### Review Process

1. **Automated Checks Run**:
   - PR validation
   - Commit message validation
   - All CI/CD pipelines
   - Code review automation

2. **Code Review**:
   - At least one approval required
   - Address all comments
   - Make requested changes

3. **Final Checks**:
   - All conversations resolved
   - All CI checks pass
   - Branch up to date with main

4. **Merge**:
   - Squash merge (preferred)
   - Rebase merge (for clean history)
   - Regular merge (for feature branches)

## ✅ Testing

### Run Tests Before Committing

```bash
# Run all tests
npm test

# Run specific workspace
npm run test:frontend
npm run test:backend

# Run with coverage
cd backend && npm test
cd frontend && npm test -- --coverage
```

### Writing Tests

- Add tests for new features
- Add tests for bug fixes
- Test error scenarios
- Test edge cases
- Maintain coverage (>70% for backend)

### Test File Locations

```
frontend/src/**/__tests__/*.test.tsx
backend/src/__tests__/unit/**/*.test.ts
backend/src/__tests__/integration/**/*.test.ts
```

## 🎨 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types (avoid `any`)
- Use interfaces for objects
- Export types when shared

### Formatting

```bash
# Check formatting
npx prettier --check .

# Auto-format
npx prettier --write .
```

### Linting

```bash
# Frontend
cd frontend && npm run lint

# Backend
cd backend && npm run lint

# Auto-fix
npm run lint -- --fix
```

### Best Practices

- **DRY**: Don't Repeat Yourself
- **SOLID**: Follow SOLID principles
- **Error Handling**: Always handle errors
- **Async/Await**: Use async/await (no .then())
- **Security**: Validate all inputs
- **Comments**: Explain complex logic
- **Naming**: Use clear, descriptive names

## 📚 Documentation

### When to Update Docs

- New features added
- API changes
- Configuration changes
- Breaking changes
- Bug fixes affecting usage

### Documentation Files

- `README.md`: Project overview
- `docs/`: Technical documentation
- `backend/API_DOCUMENTATION.md`: API reference
- Code comments: Complex logic

## 🐛 Reporting Bugs

### Before Reporting

- Check existing issues
- Verify it's reproducible
- Test on latest version

### Bug Report Should Include

- Clear title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment info (OS, Node version, etc.)
- Error messages/logs

### Creating Bug Report

```bash
gh issue create --label bug
```

## 💡 Suggesting Features

### Feature Requests Should Include

- Clear description
- Use case/motivation
- Proposed solution
- Alternative solutions considered
- Additional context

```bash
gh issue create --label enhancement
```

## 🔐 Security Issues

**DO NOT** create public issues for security vulnerabilities.

Instead:
1. Email: foodable7@gmail.com
2. Use GitHub Security Advisories
3. Provide detailed information
4. Allow time for fix before disclosure

## 🎯 Areas to Contribute

### Code Contributions
- Bug fixes
- New features
- Performance improvements
- Refactoring
- Test coverage

### Documentation
- API documentation
- Setup guides
- Tutorials
- Translation

### Testing
- Unit tests
- Integration tests
- E2E tests
- Performance tests

### DevOps
- CI/CD improvements
- Deployment scripts
- Monitoring
- Documentation

## 📊 Contribution Statistics

We value all contributions! Contributors will be:
- Listed in README
- Mentioned in release notes
- Credited in commits

## 🎓 Learning Resources

### Project-Specific
- [Project Structure](./README.md#project-structure)
- [API Documentation](./backend/API_DOCUMENTATION.md)
- [Testing Guide](./docs/TESTING_GUIDE.md)
- [CI/CD Documentation](./docs/CICD_DOCUMENTATION.md)

### Technologies
- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## ❓ Getting Help

### Communication Channels

- **GitHub Discussions**: For questions and discussions
- **GitHub Issues**: For bugs and features
- **Pull Request Comments**: For code-specific questions

### Response Time

- Bug reports: Within 48 hours
- Feature requests: Within 1 week
- Pull requests: Within 1 week

## ✨ Recognition

Contributors will be recognized:
- In README contributors section
- In release notes
- In commit history
- On project website (future)

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Every contribution helps make Foodable better. Whether it's code, documentation, bug reports, or feature ideas - we appreciate your effort!

---

**Questions?** Create a discussion or reach out to the maintainers.

**Ready to contribute?** Follow the workflow above and submit your first PR!
