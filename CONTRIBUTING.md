# Contributing to Resume AI Toolkit

Thank you for considering contributing to Resume AI Toolkit! 🎉

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Your environment (Node.js version, OS, etc.)

### Suggesting Features

We welcome feature suggestions! Please open an issue with:
- Clear description of the feature
- Use case / why it's needed
- Example of how it would work

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Add/update tests if applicable
5. Run tests: `npm test`
6. Commit with clear message: `git commit -m "Add: feature description"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

### Code Style

- Use TypeScript
- Follow existing code style
- Add JSDoc comments for public APIs
- Keep functions focused and testable

### Testing

- Add tests for new features
- Ensure all tests pass: `npm test`
- Maintain test coverage above 80%

### Commit Messages

Use clear, descriptive commit messages:
- `Add: new feature`
- `Fix: bug description`
- `Update: improvement description`
- `Docs: documentation update`

## Development Setup

```bash
# Clone repository
git clone https://github.com/ozsparkhub/resume-ai-toolkit.git
cd resume-ai-toolkit

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Watch mode for development
npm run dev
```

## Open Source vs Full Platform

This is the **open source version** with basic features. For advanced features (AI-enhanced scoring, 10,000+ keywords, Australian market analysis), see our [full platform](https://store.ozsparkhub.com.au/tools/resume-optimizer).

Contributions to the open source version are welcome, but please note:
- Core business logic and keyword databases remain proprietary
- Focus on improving parsing, basic scoring, and developer experience
- Features that require significant AI/data investment may be added to the full platform instead

## Questions?

Open an issue or contact us at hello@ozsparkhub.com.au

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
