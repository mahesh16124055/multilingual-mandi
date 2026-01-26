# Contributing to Multilingual Mandi 🇮🇳

Thank you for your interest in contributing to Multilingual Mandi! This project aims to bridge language barriers in Indian agricultural markets through AI-powered translation and smart pricing.

## 🌟 Vision

We're building technology for **Viksit Bharat 2047** - empowering small traders, farmers, and buyers with AI tools that respect India's linguistic diversity while promoting fair trade.

## 🤝 How to Contribute

### Types of Contributions

1. **Code Contributions**
   - Bug fixes
   - New features
   - Performance improvements
   - UI/UX enhancements

2. **Language Support**
   - Translation improvements
   - New language additions
   - Cultural localization

3. **Documentation**
   - API documentation
   - User guides
   - Deployment guides

4. **Testing**
   - Bug reports
   - Feature testing
   - Performance testing

5. **Design**
   - UI/UX improvements
   - Accessibility enhancements
   - Cultural design elements

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Supabase account (for database)
- Basic understanding of React/Next.js and Node.js

### Development Setup

1. **Fork and Clone**
```bash
git clone https://github.com/your-username/multilingual-mandi.git
cd multilingual-mandi
```

2. **Install Dependencies**
```bash
npm run install-all
```

3. **Environment Setup**
```bash
cp client/.env.local.example client/.env.local
cp server/.env.example server/.env
```

4. **Database Setup**
- Create Supabase project
- Run SQL from `database/schema.sql`
- Update environment variables

5. **Start Development**
```bash
npm run dev
```

## 📝 Development Guidelines

### Code Style

We use ESLint and Prettier for consistent code formatting:

```bash
# Run linting
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format code
npm run format
```

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add Tamil language support
fix: resolve price calculation bug
docs: update API documentation
style: improve mobile responsiveness
refactor: optimize translation service
test: add unit tests for price service
```

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Testing improvements

### Pull Request Process

1. **Create Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make Changes**
   - Write clean, documented code
   - Add tests for new functionality
   - Update documentation if needed

3. **Test Your Changes**
```bash
npm run test
npm run build
```

4. **Commit Changes**
```bash
git add .
git commit -m "feat: add your feature description"
```

5. **Push and Create PR**
```bash
git push origin feature/your-feature-name
```

6. **Create Pull Request**
   - Use descriptive title
   - Fill out PR template
   - Link related issues
   - Add screenshots for UI changes

## 🌐 Language Contributions

### Adding New Languages

1. **Update Language Lists**
   - `client/components/LanguageSelector.js`
   - `client/utils/translationService.js`
   - `server/services/translationService.js`

2. **Add Translations**
   - Common phrases in translation services
   - UI text translations
   - Error messages

3. **Font Support**
   - Add Google Fonts for the script
   - Update Tailwind config
   - Test rendering

4. **Cultural Considerations**
   - Right-to-left support if needed
   - Cultural color preferences
   - Local number formats

### Translation Guidelines

- **Accuracy**: Ensure translations are contextually correct
- **Cultural Sensitivity**: Respect local customs and terminology
- **Agricultural Terms**: Use proper agricultural vocabulary
- **Consistency**: Maintain consistent terminology across the app

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run client tests
cd client && npm test

# Run server tests
cd server && npm test

# Run with coverage
npm run test:coverage
```

### Writing Tests

1. **Unit Tests**: Test individual functions
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test complete user workflows

Example test structure:
```javascript
describe('PriceCalculator', () => {
  it('should calculate correct price for rice in Delhi', () => {
    const result = calculatePrice({
      crop: 'rice',
      location: 'delhi',
      quality: 'grade-a',
      quantity: 100
    })
    
    expect(result.finalPrice).toBeGreaterThan(0)
    expect(result.totalValue).toBe(result.finalPrice * 100)
  })
})
```

## 🎨 Design Guidelines

### UI/UX Principles

1. **Cultural Sensitivity**
   - Use tricolor theme respectfully
   - Include Indian cultural elements
   - Respect religious and cultural symbols

2. **Accessibility**
   - WCAG 2.1 AA compliance
   - Screen reader support
   - Keyboard navigation
   - High contrast mode

3. **Mobile-First**
   - Responsive design
   - Touch-friendly interfaces
   - Offline capabilities

4. **Performance**
   - Fast loading times
   - Optimized images
   - Efficient animations

### Design Assets

- Use Figma for design mockups
- Follow existing color palette
- Maintain consistent spacing
- Use appropriate typography

## 🐛 Bug Reports

### Before Reporting

1. Check existing issues
2. Test on latest version
3. Try different browsers/devices
4. Check console for errors

### Bug Report Template

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Device: [e.g. iPhone 12]
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Feature Description**
Clear description of the feature

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should it work?

**Alternatives Considered**
Other solutions you've thought about

**Additional Context**
Screenshots, mockups, etc.
```

## 📚 Documentation

### Documentation Standards

1. **Code Comments**
   - Explain complex logic
   - Document function parameters
   - Include usage examples

2. **API Documentation**
   - Use JSDoc format
   - Include request/response examples
   - Document error codes

3. **User Documentation**
   - Step-by-step guides
   - Screenshots
   - Troubleshooting sections

## 🏆 Recognition

### Contributors

We recognize contributors in:
- README.md contributors section
- Release notes
- Social media shoutouts
- Conference presentations

### Contribution Levels

- **First-time Contributors**: Welcome package
- **Regular Contributors**: Special recognition
- **Core Contributors**: Maintainer status consideration

## 📞 Getting Help

### Communication Channels

1. **GitHub Issues**: Bug reports and feature requests
2. **GitHub Discussions**: General questions and ideas
3. **Discord**: Real-time chat (link in README)
4. **Email**: For sensitive issues

### Code of Conduct

We follow the [Contributor Covenant](https://www.contributor-covenant.org/):

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Respect different viewpoints
- Help maintain a positive environment

## 🎯 Roadmap

### Current Priorities

1. **Language Expansion**
   - Add more Indian languages
   - Improve translation accuracy
   - Voice support for all languages

2. **AI Improvements**
   - Better price prediction
   - Smarter negotiation suggestions
   - Market trend analysis

3. **Mobile App**
   - React Native version
   - Offline functionality
   - Push notifications

4. **Integration**
   - Government APIs
   - Payment gateways
   - Logistics partners

### Future Vision

- **Scale**: Support 1M+ users
- **Languages**: All 22 official Indian languages
- **Features**: Video calls, AR crop quality assessment
- **Impact**: Measurable improvement in farmer incomes

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Multilingual Mandi!** 

Together, we're building technology that empowers India's agricultural community and supports the vision of Viksit Bharat 2047. 🇮🇳

*Made with ❤️ for Indian farmers and traders*