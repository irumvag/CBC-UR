import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from '@/locales/en.json'
import rw from '@/locales/rw.json'

const resources = {
  en: { translation: en },
  rw: { translation: rw },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'rw'],

    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'cbc-ur-language',
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    react: {
      useSuspense: false,
    },
  })

export default i18n

// Helper to get current language
export const getCurrentLanguage = (): string => {
  return i18n.language || 'en'
}

// Helper to change language
export const changeLanguage = (lng: 'en' | 'rw'): void => {
  i18n.changeLanguage(lng)
  localStorage.setItem('cbc-ur-language', lng)
}

// Available languages
export const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
] as const
