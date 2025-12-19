
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';
import { GoogleGenAI } from "@google/genai";

type Locale = string;

interface LanguageContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('app_locale');
    if (saved && translations[saved]) return saved;
    // Default to Thai or browser language
    const browserLang = navigator.language.split('-')[0];
    return translations[browserLang] ? browserLang : 'th';
  });

  const [aiTranslations, setAiTranslations] = useState<Record<string, Record<string, string>>>(() => {
    const saved = localStorage.getItem('ai_translations');
    return saved ? JSON.parse(saved) : {};
  });

  const setLocale = (l: Locale) => {
    if (translations[l]) {
      setLocaleState(l);
      localStorage.setItem('app_locale', l);
    }
  };

  const translateWithAI = async (key: string, targetLocale: string) => {
    if (aiTranslations[targetLocale]?.[key]) return;
    if (!process.env.API_KEY) return;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const baseText = translations['th'][key] || key;
      const prompt = `Translate this UI text from Thai to ${targetLocale}: "${baseText}". Return ONLY the translation.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const translatedText = response.text?.trim();
      if (translatedText) {
        setAiTranslations(prev => {
          const newState = {
            ...prev,
            [targetLocale]: {
              ...(prev[targetLocale] || {}),
              [key]: translatedText
            }
          };
          localStorage.setItem('ai_translations', JSON.stringify(newState));
          return newState;
        });
      }
    } catch (e) {
      console.debug('AI Translation delayed or unavailable', e);
    }
  };

  const t = (key: string): string => {
    // 1. Static Dictionary Check
    if (translations[locale]?.[key]) return translations[locale][key];

    // 2. AI Cache Check
    if (aiTranslations[locale]?.[key]) return aiTranslations[locale][key];

    // 3. Fallback to Thai
    const fallback = translations['th'][key] || key;
    
    // 4. Trigger Background Translation if locale is not Thai or English and not in static
    if (locale !== 'th' && locale !== 'en') {
      translateWithAI(key, locale);
    }
    
    return fallback;
  };

  return (
    <div className="contents">
      <LanguageContext.Provider value={{ locale, setLocale, t }}>
        {children}
      </LanguageContext.Provider>
    </div>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
