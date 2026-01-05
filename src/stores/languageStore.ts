import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'pt' | 'ru' | 'hi' | 'ko' | 'th' | 'vi' | 'ar';

interface LanguageState {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  getLanguage: () => Language;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      currentLanguage: 'en',
      setLanguage: (language: Language) => set({ currentLanguage: language }),
      getLanguage: () => get().currentLanguage,
    }),
    {
      name: 'language-store',
    }
  )
);
