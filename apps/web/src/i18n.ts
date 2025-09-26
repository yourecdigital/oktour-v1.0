import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import ICU from 'i18next-icu';
import resourcesToBackend from 'i18next-resources-to-backend';

export const i18n = i18next
  .use(ICU())
  .use(initReactI18next)
  .use(resourcesToBackend((lng: string, ns: string) => import(`../public/locales/${lng}/${ns}.json`)))
  .init({
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: ['en','es','de','fr','ar','zh'],
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  });




