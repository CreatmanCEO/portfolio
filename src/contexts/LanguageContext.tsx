"use client";

import { createContext, useContext, useEffect, useState } from "react";

type LanguageCode = "en" | "es" | "ru" | "he" | "jp";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Translation keys
const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.projects": "Projects",
    "nav.aiAnalyst": "AI Analyst",

    // Hero
    "hero.label": "FULL-STACK DEVELOPER & AUTOMATION ENGINEER",
    "hero.headline": "Building intelligent automation systems",
    "hero.description": "7+ projects | App Store | 100+ hours saved",
    "hero.viewProjects": "View Projects",
    "hero.tryAI": "Try AI Analyst",

    // Common
    "common.learnMore": "Learn More",
    "common.viewAll": "View All",
  },
  es: {
    // Navigation
    "nav.home": "Inicio",
    "nav.projects": "Proyectos",
    "nav.aiAnalyst": "Analista AI",

    // Hero
    "hero.label": "DESARROLLADOR FULL-STACK E INGENIERO DE AUTOMATIZACIÓN",
    "hero.headline": "Construyendo sistemas de automatización inteligentes",
    "hero.description": "7+ proyectos | App Store | 100+ horas ahorradas",
    "hero.viewProjects": "Ver Proyectos",
    "hero.tryAI": "Probar Analista AI",

    // Common
    "common.learnMore": "Más información",
    "common.viewAll": "Ver todo",
  },
  ru: {
    // Navigation
    "nav.home": "Главная",
    "nav.projects": "Проекты",
    "nav.aiAnalyst": "AI Аналитик",

    // Hero
    "hero.label": "FULL-STACK РАЗРАБОТЧИК И ИНЖЕНЕР ПО АВТОМАТИЗАЦИИ",
    "hero.headline": "Создаю интеллектуальные системы автоматизации",
    "hero.description": "7+ проектов | App Store | 100+ часов сэкономлено",
    "hero.viewProjects": "Смотреть проекты",
    "hero.tryAI": "Попробовать AI Аналитик",

    // Common
    "common.learnMore": "Подробнее",
    "common.viewAll": "Смотреть все",
  },
  he: {
    // Navigation
    "nav.home": "בית",
    "nav.projects": "פרויקטים",
    "nav.aiAnalyst": "אנליסט AI",

    // Hero
    "hero.label": "מפתח FULL-STACK ומהנדס אוטומציה",
    "hero.headline": "בונה מערכות אוטומציה חכמות",
    "hero.description": "7+ פרויקטים | App Store | 100+ שעות שנחסכו",
    "hero.viewProjects": "צפה בפרויקטים",
    "hero.tryAI": "נסה אנליסט AI",

    // Common
    "common.learnMore": "למד עוד",
    "common.viewAll": "צפה בהכל",
  },
  jp: {
    // Navigation
    "nav.home": "ホーム",
    "nav.projects": "プロジェクト",
    "nav.aiAnalyst": "AIアナリスト",

    // Hero
    "hero.label": "フルスタック開発者＆自動化エンジニア",
    "hero.headline": "インテリジェント自動化システムの構築",
    "hero.description": "7+プロジェクト | App Store | 100+時間節約",
    "hero.viewProjects": "プロジェクトを見る",
    "hero.tryAI": "AIアナリストを試す",

    // Common
    "common.learnMore": "詳しく見る",
    "common.viewAll": "すべて見る",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get language from localStorage or browser preference
    const savedLang = localStorage.getItem("language") as LanguageCode | null;
    if (savedLang && translations[savedLang]) {
      setLanguageState(savedLang);
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase().split("-")[0];
      const supportedLang = (
        ["en", "es", "ru", "he", "jp"].includes(browserLang)
          ? browserLang
          : "en"
      ) as LanguageCode;
      setLanguageState(supportedLang);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      // Apply RTL for Hebrew
      if (language === "he") {
        document.documentElement.setAttribute("dir", "rtl");
      } else {
        document.documentElement.setAttribute("dir", "ltr");
      }
    }
  }, [language, mounted]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // Return default values during SSR
    if (typeof window === "undefined") {
      return {
        language: "en" as const,
        setLanguage: () => {},
        t: (key: string) => key,
      };
    }
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
