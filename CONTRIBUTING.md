# Contributing to Deep Research Assistant

Thank you for your interest in contributing to the Deep Research Assistant! This document provides guidelines and instructions to help you get started.

## Code of Conduct

We expect all contributors to adhere to a respectful and inclusive environment. Please be kind, considerate, and constructive in all interactions.

## Development Environment Setup

### Prerequisites

- [Deno](https://deno.com/) 1.38 or higher
- A code editor (VS Code recommended with the Deno extension)
- Git

### Setting Up Your Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/ncolesummers/deep-researcher.git
   cd deep-researcher
   ```
3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Configure your environment variables in the `.env` file

## Development Workflow

### Branch Naming Convention

- `feature/short-description` - For new features
- `fix/issue-description` - For bug fixes
- `docs/description` - For documentation updates
- `refactor/description` - For code refactoring

### Development Process

1. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our coding standards

3. Run tests to ensure your changes don't break existing functionality:
   ```bash
   deno test
   ```

4. Commit your changes with a descriptive message:
   ```bash
   git commit -m "feat: add new research capability for academic sources"
   ```
   
   We follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

5. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Open a Pull Request to the main repository

## Pull Request Process

1. Update the README.md or documentation with details of changes to the interface, if applicable
2. Ensure all tests are passing
3. Add a clear description of the problem and solution in the PR description
4. Reference any related issues using GitHub's issue linking
5. Wait for review from maintainers

## Coding Standards

### TypeScript Style Guide

- Use TypeScript for all new code
- Follow the [Deno Style Guide](https://deno.land/manual/contributing/style_guide)
- Use explicit types rather than relying on type inference
- Document all public functions and classes with JSDoc comments

### Testing

- Write tests for all new features and bug fixes
- Aim for high test coverage
- Test both "happy path" and error conditions

## Documentation

### Code Documentation

- Document all functions, classes, and methods with JSDoc comments
- Include parameter types, return types, and descriptions
- Add examples where appropriate

### Project Documentation

- Keep README.md up to date
- Document new features in the appropriate location
- Create or update tutorials for significant features

## Review Process

Pull requests will be reviewed by maintainers. The review process checks for:

1. Code quality and adherence to style guidelines
2. Test coverage
3. Documentation
4. Overall design and architecture fit

## Getting Help

If you need help at any point, you can:

- Open an issue with a clear description of your question
- Contact the maintainers via [appropriate contact method]

Thank you for contributing to the Deep Research Assistant! 