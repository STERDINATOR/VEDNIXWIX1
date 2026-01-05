import { useLanguageStore } from '@/stores/languageStore';
import { t } from '@/lib/translations';

export function useTranslation() {
  const { currentLanguage } = useLanguageStore();

  return {
    t: (path: string) => t(currentLanguage, path),
    language: currentLanguage,
  };
}
