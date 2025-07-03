# Developer Documentation

This folder contains comprehensive documentation for the genealogy-astro application development and architecture.

## 📁 Documentation Files

### [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md)

Complete overview of the major component refactoring that transformed the application from a monolithic structure into a clean, modular, event-driven architecture.

**Contents:**

- Component architecture overview
- Event-driven communication patterns
- Initialization sequences
- Technical implementation details
- Benefits achieved

### [LANGUAGE_SWITCHER_SUMMARY.md](./LANGUAGE_SWITCHER_SUMMARY.md)

Detailed documentation of the LanguageSwitcher component that handles internationalization (i18n) functionality.

**Contents:**

- Component structure and props
- User interaction flow
- Event integration
- Styling and responsive design
- Integration points

### [PERSON_INFO_FEATURE_SUMMARY.md](./PERSON_INFO_FEATURE_SUMMARY.md)

Documentation of the person info field feature that allows users to add biographical information displayed as a second line in genealogy graph nodes.

**Contents:**

- Implementation changes across data structure, backend, and UI
- User experience improvements
- Technical implementation details
- Testing verification

## 🎯 Purpose

These documents serve as:

- **Architecture Reference**: Understanding the modular component design
- **Development Guide**: How components interact and communicate
- **Feature Documentation**: Detailed explanation of specific features
- **Maintenance Aid**: Making future changes and debugging easier

## 📝 Maintenance

When making significant changes to the application:

1. Update relevant documentation files
2. Keep architecture diagrams current
3. Document new event patterns or APIs
4. Update testing verification sections

## 🔗 Related Files

- **Source Code**: `../src/components/`
- **Tests**: `../test/`
- **Configuration**: `../astro.config.mjs`, `../tsconfig.json`
- **Utilities**: `../public/utility/`
