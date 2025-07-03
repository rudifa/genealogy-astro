# LanguageSwitcher Component Summary

## Overview

The `LanguageSwitcher.astro` component provides internationalization (i18n) functionality for the genealogy application, allowing users to dynamically switch between supported languages.

## Component Structure

### Props Interface

```typescript
export interface Props {
  currentLanguage: Language;
  translations: any;
}
```

### Key Features

- **Dynamic Language Selection**: Dropdown menu populated with all supported languages
- **Visual Language Indicators**: Displays language flags and native names
- **Persistent Language Preference**: Stores user's language choice in localStorage
- **URL State Management**: Updates URL parameters to reflect current language
- **Event-Driven Communication**: Dispatches and listens for language change events

## Functionality

### Language Display

- Shows language flag emoji and native name for each option
- Automatically sets the current language as selected
- Responsive design with mobile-friendly styling

### User Interaction Flow

1. User selects a language from the dropdown
2. Component updates global `window.currentLanguage` variable
3. Stores preference in `localStorage` as "genealogy-language"
4. Calls global `window.updatePageLanguage()` function if available
5. Updates browser URL with new language parameter
6. Listens for external `languageChanged` events to sync dropdown state

### Event Integration

- **Listens for**: `languageChanged` events to update dropdown selection
- **Triggers**: Language updates through global functions and localStorage

## Styling Features

### Visual Design

- Modern gradient backgrounds and subtle shadows
- Smooth hover and focus transitions
- Clean, professional appearance with rounded corners
- Accessibility-focused design with proper focus indicators

### Responsive Behavior

- **Desktop**: Full-size dropdown with 150px minimum width
- **Tablet (≤768px)**: Slightly reduced padding and font size
- **Mobile (≤480px)**: Compact design with 120px minimum width

## Integration Points

### Global Dependencies

- `window.currentLanguage`: Global language state variable
- `window.updatePageLanguage()`: Global function for language updates
- `localStorage`: Persistent storage for user preferences
- `supportedLanguages`: Imported language configuration

### Event System

- Participates in the application's event-driven architecture
- Synchronizes with other components through custom events
- Maintains consistency across the application

## Technical Implementation

### Browser Compatibility

- Uses modern JavaScript features (addEventListener, localStorage)
- Implements proper event handling and state management
- Graceful degradation for missing global functions

### Performance Considerations

- Lightweight component with minimal JavaScript
- Efficient event listeners with proper cleanup
- CSS-based animations for smooth user experience

## Usage Context

This component is typically used in the main application layout or header, providing global language switching functionality that affects the entire genealogy application interface, including tooltips, labels, and dynamic content.

## Benefits

- **User Experience**: Seamless language switching without page reloads
- **Accessibility**: Proper keyboard navigation and focus management
- **Maintainability**: Clean separation of concerns with event-driven architecture
- **Persistence**: Remembers user preferences across sessions
- **Responsiveness**: Works well on all device sizes
