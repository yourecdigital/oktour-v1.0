import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ICU from 'i18next-icu';
import resourcesToBackend from 'i18next-resources-to-backend';

// RTL languages
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur', 'ku', 'dv'];

// Available locales (30+ languages)
export const SUPPORTED_LOCALES = [
  'en', 'ru', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'sv', 'no', 'da', 'fi',
  'pl', 'cs', 'hu', 'ro', 'bg', 'hr', 'sk', 'sl', 'et', 'lv', 'lt',
  'ar', 'he', 'fa', 'ur', 'hi', 'bn', 'ta', 'te', 'ml', 'kn', 'gu',
  'th', 'vi', 'ko', 'ja', 'zh', 'tr', 'el', 'uk', 'be', 'ka', 'hy',
  'az', 'kk', 'ky', 'uz', 'mn', 'lo', 'km', 'my', 'ne', 'si', 'dz'
];

// Dynamic locale loading
const loadLocale = (language: string, namespace: string) => {
  return import(`../public/locales/${language}/${namespace}.json`);
};

export const i18n = i18next
  .use(ICU())
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(resourcesToBackend(loadLocale))
  .init({
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LOCALES,
    ns: ['common'],
    defaultNS: 'common',
    debug: import.meta.env.DEV,
    interpolation: { 
      escapeValue: false 
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
  });

// RTL detection utility
export const isRTL = (language: string): boolean => {
  return RTL_LANGUAGES.includes(language);
};

// Get current language direction
export const getLanguageDirection = (language?: string): 'ltr' | 'rtl' => {
  const lang = language || i18n.language;
  return isRTL(lang) ? 'rtl' : 'ltr';
};

// Set document direction
export const setDocumentDirection = (language: string) => {
  const direction = getLanguageDirection(language);
  document.documentElement.dir = direction;
  document.documentElement.lang = language;
};

// Listen for language changes
i18n.on('languageChanged', (lng) => {
  setDocumentDirection(lng);
});

// Set initial direction
setDocumentDirection(i18n.language);




