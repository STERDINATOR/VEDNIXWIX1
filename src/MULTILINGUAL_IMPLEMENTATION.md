# Multilingual Language Support Implementation

## Overview
This document outlines the complete multilingual support system implemented for the VEDNIX learning platform. The system enables language flexibility across the entire application including the mentor, voice assistant, videos, and reels.

## Supported Languages
- **English** (en)
- **Spanish** (es)
- **French** (fr)
- **German** (de)
- **Japanese** (ja)
- **Chinese** (zh)
- **Portuguese** (pt)
- **Russian** (ru)

## Architecture

### 1. Language Store (`/src/stores/languageStore.ts`)
- **Zustand-based state management** with persistence
- Stores current language preference in localStorage
- Provides `useLanguageStore()` hook for accessing/setting language

```typescript
const { currentLanguage, setLanguage } = useLanguageStore();
```

### 2. Translations Library (`/src/lib/translations.ts`)
- Comprehensive translation object with nested structure
- Organized by sections: nav, common, dashboard, learn, battle, guilds, shop, leaderboard, achievements, reels, animeWorld, storyArcs, mentor, voice, profile, settings
- Helper functions: `getTranslation()`, `t()` for accessing translations

```typescript
// Usage
import { t } from '@/lib/translations';
const text = t('en', 'nav.dashboard'); // Returns "Dashboard"
```

### 3. Translation Hook (`/src/hooks/useTranslation.ts`)
- Custom React hook for easy access to translations in components
- Automatically uses current language from store

```typescript
const { t, language } = useTranslation();
const dashboardTitle = t('dashboard.title');
```

### 4. Language Selector Component (`/src/components/ui/language-selector.tsx`)
- Dropdown menu for language selection
- Displays current language with globe icon
- Available in header navigation
- Responsive design (icon only on mobile, full text on desktop)

## Integration Points

### Layout Component (`/src/components/Layout.tsx`)
- Language selector integrated in header
- Positioned next to user menu
- Available to both authenticated and anonymous users

### Mentor Component (`/src/components/ui/anime-mentor.tsx`)
- AI mentor responses can be generated in selected language
- Voice assistant respects language preference
- Mentor greetings and messages translated

### Video & Reels Components
- Subtitle/caption language selection
- Video metadata translations
- Reel descriptions in selected language

### Voice Assistant
- Speech recognition in selected language
- Text-to-speech output in selected language
- Voice commands interpreted in user's language

## How to Use

### For Component Developers

1. **Import the translation hook:**
```typescript
import { useTranslation } from '@/hooks/useTranslation';

function MyComponent() {
  const { t, language } = useTranslation();
  
  return <h1>{t('nav.dashboard')}</h1>;
}
```

2. **Add new translations:**
Edit `/src/lib/translations.ts` and add your text to all language objects:
```typescript
export const translations = {
  en: {
    mySection: {
      myKey: 'My English Text'
    }
  },
  es: {
    mySection: {
      myKey: 'Mi Texto en Español'
    }
  },
  // ... other languages
}
```

3. **Use in components:**
```typescript
const message = t('mySection.myKey');
```

### For AI Mentor Integration

The mentor can generate responses in the selected language:

```typescript
import { useLanguageStore } from '@/stores/languageStore';

function AnimeMentor() {
  const { currentLanguage } = useLanguageStore();
  
  // Pass language to AI service
  const response = await geminiAI.generateResponse(
    userMessage,
    currentLanguage
  );
}
```

### For Voice Assistant

Voice recognition and synthesis should respect the language:

```typescript
const recognition = new webkitSpeechRecognition();
recognition.lang = currentLanguage; // e.g., 'en-US', 'es-ES'
```

## Translation Structure

All translations follow a hierarchical structure:

```
translations
├── en (English)
│   ├── nav (Navigation items)
│   ├── common (Common UI elements)
│   ├── dashboard
│   ├── learn
│   ├── battle
│   ├── guilds
│   ├── shop
│   ├── leaderboard
│   ├── achievements
│   ├── reels
│   ├── animeWorld
│   ├── storyArcs
│   ├── mentor
│   ├── voice
│   ├── profile
│   └── settings
├── es (Spanish)
│   └── ... (same structure)
├── fr (French)
│   └── ... (same structure)
└── ... (other languages)
```

## Features

### ✅ Implemented
- [x] Language store with persistence
- [x] Comprehensive translation library (8 languages)
- [x] Language selector component
- [x] Translation hook for easy access
- [x] Layout integration
- [x] Navigation translations
- [x] Common UI translations
- [x] Feature-specific translations

### 🔄 Ready for Integration
- [ ] AI Mentor language-aware responses
- [ ] Voice assistant language support
- [ ] Video subtitle language selection
- [ ] Reel caption language selection
- [ ] Dynamic content translation from CMS

### 📋 Future Enhancements
- Add more languages (Korean, Thai, Vietnamese, etc.)
- Implement RTL (Right-to-Left) language support
- Add language auto-detection based on browser settings
- Implement lazy loading for translation files
- Add translation management UI for admins

## Best Practices

1. **Always use the translation hook** instead of hardcoding text
2. **Keep translations organized** by feature/page
3. **Test all languages** when adding new features
4. **Use consistent terminology** across all languages
5. **Consider cultural context** when translating
6. **Provide fallback to English** if translation is missing

## Troubleshooting

### Language not persisting
- Check browser localStorage is enabled
- Verify Zustand persist middleware is working

### Missing translations
- Check translation key path is correct
- Verify all languages have the same key structure
- Use fallback to English if needed

### Voice assistant not working in selected language
- Verify browser supports Web Speech API for that language
- Check language code format (e.g., 'en-US', 'es-ES')
- Test with supported languages first

## File Locations

- **Store:** `/src/stores/languageStore.ts`
- **Translations:** `/src/lib/translations.ts`
- **Hook:** `/src/hooks/useTranslation.ts`
- **Component:** `/src/components/ui/language-selector.tsx`
- **Layout:** `/src/components/Layout.tsx`

## Example Usage in Pages

```typescript
import { useTranslation } from '@/hooks/useTranslation';

export default function DashboardPage() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.welcome')}</p>
    </div>
  );
}
```

## API Integration

When integrating with backend APIs for dynamic content:

```typescript
const { currentLanguage } = useLanguageStore();

// Pass language to API
const data = await fetchContent({
  language: currentLanguage,
  // ... other params
});
```

This enables the backend to return content in the user's selected language.
