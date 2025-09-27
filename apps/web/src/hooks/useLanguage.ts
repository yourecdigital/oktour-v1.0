import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { i18n, SUPPORTED_LOCALES, isRTL, getLanguageDirection } from '../i18n';

export const useLanguage = () => {
  const { i18n: t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [isRTLMode, setIsRTLMode] = useState(isRTL(i18n.language));
  const [direction, setDirection] = useState(getLanguageDirection(i18n.language));

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng);
      setIsRTLMode(isRTL(lng));
      setDirection(getLanguageDirection(lng));
    };

    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const changeLanguage = async (lng: string) => {
    if (SUPPORTED_LOCALES.includes(lng)) {
      await i18n.changeLanguage(lng);
    }
  };

  const getLanguageName = (code: string): string => {
    const names: Record<string, string> = {
      en: 'English',
      ru: 'Русский',
      es: 'Español',
      fr: 'Français',
      de: 'Deutsch',
      it: 'Italiano',
      pt: 'Português',
      nl: 'Nederlands',
      sv: 'Svenska',
      no: 'Norsk',
      da: 'Dansk',
      fi: 'Suomi',
      pl: 'Polski',
      cs: 'Čeština',
      hu: 'Magyar',
      ro: 'Română',
      bg: 'Български',
      hr: 'Hrvatski',
      sk: 'Slovenčina',
      sl: 'Slovenščina',
      et: 'Eesti',
      lv: 'Latviešu',
      lt: 'Lietuvių',
      ar: 'العربية',
      he: 'עברית',
      fa: 'فارسی',
      ur: 'اردو',
      hi: 'हिन्दी',
      bn: 'বাংলা',
      ta: 'தமிழ்',
      te: 'తెలుగు',
      ml: 'മലയാളം',
      kn: 'ಕನ್ನಡ',
      gu: 'ગુજરાતી',
      th: 'ไทย',
      vi: 'Tiếng Việt',
      ko: '한국어',
      ja: '日本語',
      zh: '中文',
      tr: 'Türkçe',
      el: 'Ελληνικά',
      uk: 'Українська',
      be: 'Беларуская',
      ka: 'ქართული',
      hy: 'Հայերեն',
      az: 'Azərbaycan',
      kk: 'Қазақ',
      ky: 'Кыргызча',
      uz: 'Oʻzbek',
      mn: 'Монгол',
      lo: 'ລາວ',
      km: 'ខ្មែរ',
      my: 'မြန်မာ',
      ne: 'नेपाली',
      si: 'සිංහල',
      dz: 'རྫོང་ཁ',
    };
    
    return names[code] || code;
  };

  const getLanguageFlag = (code: string): string => {
    const flags: Record<string, string> = {
      en: '🇺🇸',
      ru: '🇷🇺',
      es: '🇪🇸',
      fr: '🇫🇷',
      de: '🇩🇪',
      it: '🇮🇹',
      pt: '🇵🇹',
      nl: '🇳🇱',
      sv: '🇸🇪',
      no: '🇳🇴',
      da: '🇩🇰',
      fi: '🇫🇮',
      pl: '🇵🇱',
      cs: '🇨🇿',
      hu: '🇭🇺',
      ro: '🇷🇴',
      bg: '🇧🇬',
      hr: '🇭🇷',
      sk: '🇸🇰',
      sl: '🇸🇮',
      et: '🇪🇪',
      lv: '🇱🇻',
      lt: '🇱🇹',
      ar: '🇸🇦',
      he: '🇮🇱',
      fa: '🇮🇷',
      ur: '🇵🇰',
      hi: '🇮🇳',
      bn: '🇧🇩',
      ta: '🇮🇳',
      te: '🇮🇳',
      ml: '🇮🇳',
      kn: '🇮🇳',
      gu: '🇮🇳',
      th: '🇹🇭',
      vi: '🇻🇳',
      ko: '🇰🇷',
      ja: '🇯🇵',
      zh: '🇨🇳',
      tr: '🇹🇷',
      el: '🇬🇷',
      uk: '🇺🇦',
      be: '🇧🇾',
      ka: '🇬🇪',
      hy: '🇦🇲',
      az: '🇦🇿',
      kk: '🇰🇿',
      ky: '🇰🇬',
      uz: '🇺🇿',
      mn: '🇲🇳',
      lo: '🇱🇦',
      km: '🇰🇭',
      my: '🇲🇲',
      ne: '🇳🇵',
      si: '🇱🇰',
      dz: '🇧🇹',
    };
    
    return flags[code] || '🌐';
  };

  return {
    language: currentLanguage,
    isRTL: isRTLMode,
    direction,
    changeLanguage,
    getLanguageName,
    getLanguageFlag,
    supportedLanguages: SUPPORTED_LOCALES,
  };
};

