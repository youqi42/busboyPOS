# Contributing to busboyPOS

Thank you for considering contributing to busboyPOS! This document outlines the process for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How Can I Contribute?

### Reporting Bugs

- Check if the bug has already been reported in the Issues section
- Use the bug report template to create a new issue
- Include detailed steps to reproduce the bug
- Include screenshots if applicable
- Specify your environment (OS, browser, etc.)

### Suggesting Features

- Check if the feature has already been suggested in the Issues section
- Use the feature request template to create a new issue
- Clearly describe the feature and its benefits
- Provide examples of how the feature would work

### Pull Requests

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Follow the code style guidelines
4. Write tests for your changes
5. Make sure all tests pass
6. Commit your changes: `git commit -am 'Add some feature'`
7. Push to the branch: `git push origin feature/my-new-feature`
8. Submit a pull request

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Redis
- Docker (optional)

### Local Development

#### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm start
```

#### Mobile App

```bash
cd mobile
npm install
npx react-native start
```

### Docker Development

```bash
docker-compose up -d
```

## Code Style Guidelines

### JavaScript/TypeScript

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write meaningful variable and function names
- Include JSDoc comments for public APIs

### Testing

- Write unit tests for utilities and services
- Write integration tests for APIs
- Aim for good test coverage

## Git Workflow

- Use feature branches for all changes
- Keep commits focused and atomic
- Write clear commit messages
- Rebase your branch before submitting a pull request

## Review Process

- All pull requests require at least one reviewer
- Address all review comments before merging
- Make sure CI passes before merging

Thank you for contributing! 