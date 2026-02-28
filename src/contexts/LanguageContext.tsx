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
    "hero.label": "Full-Stack Developer & Automation Engineer",
    "hero.headline": "Building intelligent automation systems",
    "hero.description": "7+ projects | App Store | 100+ hours saved",
    "hero.viewProjects": "View Projects",
    "hero.tryAI": "Try AI Analyst",
    "hero.featuredProjects": "Featured Projects",

    // Projects
    "projects.accu.title": "ACCU",
    "projects.accu.description": "Automated Claude Code agent updater. Monitors GitHub releases, auto-updates binary, notification system. Self-hosted on VPS.",
    "projects.aviawallet.title": "AviaWallet",
    "projects.aviawallet.description": "iOS app for managing aviation wallet points. Built with Flutter, shipped to App Store. Features offline sync, push notifications, analytics.",
    "projects.ghost.title": "GHOST",
    "projects.ghost.description": "AI assistant with invisible overlay for interviews, meetings, and coding. Multi-provider LLM support (Claude, GPT-4, Gemini), real-time voice transcription.",
    "projects.translator.title": "Hebrew Translator Bot",
    "projects.translator.description": "Telegram bot for document translation with OCR support. Handles images, PDFs, text. Translation memory for consistency.",

    // Tech Stack
    "tech.title": "Tech Stack",
    "tech.languages": "Languages",
    "tech.frameworks": "Frameworks & Libraries",
    "tech.tools": "Tools & Platforms",

    // Footer
    "footer.copyright": "Built with Next.js, TypeScript, and Tailwind CSS",

    // Common
    "common.learnMore": "Learn More",
    "common.viewAll": "View All",

    // Projects Page
    "projects.page.title": "Projects",
    "projects.page.subtitle": "Production-ready applications and automation systems",
    "projects.status.production": "Production",
    "projects.status.beta": "Beta",
    "projects.status.inDevelopment": "In Development",
    "projects.category.ai": "AI",
    "projects.category.mobile": "Mobile",
    "projects.category.devops": "DevOps",
    "projects.category.web": "Web",
    "projects.category.automation": "Automation",
    "projects.category.extension": "Extension",
    "projects.link.github": "GitHub",
    "projects.link.demo": "Live Demo",
  },
  es: {
    // Navigation
    "nav.home": "Inicio",
    "nav.projects": "Proyectos",
    "nav.aiAnalyst": "Analista AI",

    // Hero
    "hero.label": "Desarrollador Full-Stack e Ingeniero de Automatización",
    "hero.headline": "Construyendo sistemas de automatización inteligentes",
    "hero.description": "7+ proyectos | App Store | 100+ horas ahorradas",
    "hero.viewProjects": "Ver Proyectos",
    "hero.tryAI": "Probar Analista AI",
    "hero.featuredProjects": "Proyectos Destacados",

    // Projects
    "projects.accu.title": "ACCU",
    "projects.accu.description": "Actualizador automático del agente Claude Code. Monitorea lanzamientos de GitHub, actualiza binarios automáticamente, sistema de notificaciones. Auto-alojado en VPS.",
    "projects.aviawallet.title": "AviaWallet",
    "projects.aviawallet.description": "Aplicación iOS para administrar puntos de billeteras de aviación. Construido con Flutter, enviado a App Store. Características: sincronización offline, notificaciones push, análisis.",
    "projects.ghost.title": "GHOST",
    "projects.ghost.description": "Asistente AI con superposición invisible para entrevistas, reuniones y programación. Soporte multi-proveedor LLM (Claude, GPT-4, Gemini), transcripción de voz en tiempo real.",
    "projects.translator.title": "Bot Traductor de Hebreo",
    "projects.translator.description": "Bot de Telegram para traducción de documentos con soporte OCR. Maneja imágenes, PDFs, texto. Memoria de traducción para consistencia.",

    // Tech Stack
    "tech.title": "Stack Tecnológico",
    "tech.languages": "Lenguajes",
    "tech.frameworks": "Frameworks y Bibliotecas",
    "tech.tools": "Herramientas y Plataformas",

    // Footer
    "footer.copyright": "Construido con Next.js, TypeScript y Tailwind CSS",

    // Common
    "common.learnMore": "Más información",
    "common.viewAll": "Ver todo",

    // Projects Page
    "projects.page.title": "Proyectos",
    "projects.page.subtitle": "Aplicaciones listas para producción y sistemas de automatización",
    "projects.status.production": "Producción",
    "projects.status.beta": "Beta",
    "projects.status.inDevelopment": "En Desarrollo",
    "projects.category.ai": "IA",
    "projects.category.mobile": "Móvil",
    "projects.category.devops": "DevOps",
    "projects.category.web": "Web",
    "projects.category.automation": "Automatización",
    "projects.category.extension": "Extensión",
    "projects.link.github": "GitHub",
    "projects.link.demo": "Demo en Vivo",
  },
  ru: {
    // Navigation
    "nav.home": "Главная",
    "nav.projects": "Проекты",
    "nav.aiAnalyst": "AI Аналитик",

    // Hero
    "hero.label": "Full-Stack Разработчик и Инженер по Автоматизации",
    "hero.headline": "Создаю интеллектуальные системы автоматизации",
    "hero.description": "7+ проектов | App Store | 100+ часов сэкономлено",
    "hero.viewProjects": "Смотреть проекты",
    "hero.tryAI": "Попробовать AI Аналитик",
    "hero.featuredProjects": "Избранные Проекты",

    // Projects
    "projects.accu.title": "ACCU",
    "projects.accu.description": "Автоматизированный обновлятель агента Claude Code. Мониторинг релизов GitHub, автообновление бинарных файлов, система уведомлений. Размещён на собственном VPS.",
    "projects.aviawallet.title": "AviaWallet",
    "projects.aviawallet.description": "iOS приложение для управления баллами авиа кошелька. Разработано на Flutter, опубликовано в App Store. Функции: оффлайн синхронизация, push-уведомления, аналитика.",
    "projects.ghost.title": "GHOST",
    "projects.ghost.description": "AI-ассистент с невидимым оверлеем для интервью, встреч и программирования. Поддержка нескольких LLM провайдеров (Claude, GPT-4, Gemini), транскрипция голоса в реальном времени.",
    "projects.translator.title": "Бот-переводчик иврита",
    "projects.translator.description": "Telegram бот для перевода документов с поддержкой OCR. Обрабатывает изображения, PDF, текст. Память переводов для согласованности.",

    // Tech Stack
    "tech.title": "Технологический стек",
    "tech.languages": "Языки программирования",
    "tech.frameworks": "Фреймворки и библиотеки",
    "tech.tools": "Инструменты и платформы",

    // Footer
    "footer.copyright": "Создано с помощью Next.js, TypeScript и Tailwind CSS",

    // Common
    "common.learnMore": "Подробнее",
    "common.viewAll": "Смотреть все",

    // Projects Page
    "projects.page.title": "Проекты",
    "projects.page.subtitle": "Готовые к продакшену приложения и системы автоматизации",
    "projects.status.production": "Продакшен",
    "projects.status.beta": "Бета",
    "projects.status.inDevelopment": "В Разработке",
    "projects.category.ai": "ИИ",
    "projects.category.mobile": "Мобильные",
    "projects.category.devops": "DevOps",
    "projects.category.web": "Веб",
    "projects.category.automation": "Автоматизация",
    "projects.category.extension": "Расширение",
    "projects.link.github": "GitHub",
    "projects.link.demo": "Живое Демо",
  },
  he: {
    // Navigation
    "nav.home": "בית",
    "nav.projects": "פרויקטים",
    "nav.aiAnalyst": "אנליסט AI",

    // Hero
    "hero.label": "מפתח Full-Stack ומהנדס אוטומציה",
    "hero.headline": "בונה מערכות אוטומציה חכמות",
    "hero.description": "7+ פרויקטים | App Store | 100+ שעות שנחסכו",
    "hero.viewProjects": "צפה בפרויקטים",
    "hero.tryAI": "נסה אנליסט AI",
    "hero.featuredProjects": "פרויקטים נבחרים",

    // Projects
    "projects.accu.title": "ACCU",
    "projects.accu.description": "מעדכן אוטומטי של סוכן Claude Code. עוקב אחר שחרורי GitHub, מעדכן קובץ בינארי אוטומטית, מערכת התראות. מאוחסן על VPS.",
    "projects.aviawallet.title": "AviaWallet",
    "projects.aviawallet.description": "אפליקציית iOS לניהול נקודות ארנק תעופה. נבנתה עם Flutter, פורסמה ב-App Store. תכונות: סנכרון לא מקוון, התראות push, אנליטיקה.",
    "projects.ghost.title": "GHOST",
    "projects.ghost.description": "עוזר AI עם שכבת-על בלתי נראית לראיונות, פגישות וקידוד. תמיכה במספר ספקי LLM (Claude, GPT-4, Gemini), תמלול קולי בזמן אמת.",
    "projects.translator.title": "בוט תרגום עברית",
    "projects.translator.description": "בוט טלגרם לתרגום מסמכים עם תמיכה OCR. מטפל בתמונות, PDF, טקסט. זיכרון תרגום לעקביות.",

    // Tech Stack
    "tech.title": "סטק טכנולוגי",
    "tech.languages": "שפות תכנות",
    "tech.frameworks": "פריימוורקים וספריות",
    "tech.tools": "כלים ופלטפורמות",

    // Footer
    "footer.copyright": "נבנה עם Next.js, TypeScript ו-Tailwind CSS",

    // Common
    "common.learnMore": "למד עוד",
    "common.viewAll": "צפה בהכל",

    // Projects Page
    "projects.page.title": "פרויקטים",
    "projects.page.subtitle": "אפליקציות מוכנות לייצור ומערכות אוטומציה",
    "projects.status.production": "ייצור",
    "projects.status.beta": "בטא",
    "projects.status.inDevelopment": "בפיתוח",
    "projects.category.ai": "בינה מלאכותית",
    "projects.category.mobile": "מובייל",
    "projects.category.devops": "DevOps",
    "projects.category.web": "אינטרנט",
    "projects.category.automation": "אוטומציה",
    "projects.category.extension": "תוסף",
    "projects.link.github": "GitHub",
    "projects.link.demo": "דמו חי",
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
    "hero.featuredProjects": "おすすめプロジェクト",

    // Projects
    "projects.accu.title": "ACCU",
    "projects.accu.description": "Claude Codeエージェントの自動アップデーター。GitHubリリースを監視し、バイナリを自動更新、通知システム。VPSでセルフホスト。",
    "projects.aviawallet.title": "AviaWallet",
    "projects.aviawallet.description": "航空ウォレットポイント管理用のiOSアプリ。Flutterで構築、App Storeに配信。オフライン同期、プッシュ通知、分析機能を搭載。",
    "projects.ghost.title": "GHOST",
    "projects.ghost.description": "面接、会議、コーディング用の透明オーバーレイAIアシスタント。マルチプロバイダーLLMサポート（Claude、GPT-4、Gemini）、リアルタイム音声文字起こし。",
    "projects.translator.title": "ヘブライ語翻訳ボット",
    "projects.translator.description": "OCRサポート付きドキュメント翻訳用Telegramボット。画像、PDF、テキストを処理。一貫性のための翻訳メモリ。",

    // Tech Stack
    "tech.title": "技術スタック",
    "tech.languages": "プログラミング言語",
    "tech.frameworks": "フレームワークとライブラリ",
    "tech.tools": "ツールとプラットフォーム",

    // Footer
    "footer.copyright": "Next.js、TypeScript、Tailwind CSSで構築",

    // Common
    "common.learnMore": "詳しく見る",
    "common.viewAll": "すべて見る",

    // Projects Page
    "projects.page.title": "プロジェクト",
    "projects.page.subtitle": "本番環境対応アプリケーションと自動化システム",
    "projects.status.production": "本番稼働中",
    "projects.status.beta": "ベータ版",
    "projects.status.inDevelopment": "開発中",
    "projects.category.ai": "AI",
    "projects.category.mobile": "モバイル",
    "projects.category.devops": "DevOps",
    "projects.category.web": "ウェブ",
    "projects.category.automation": "自動化",
    "projects.category.extension": "拡張機能",
    "projects.link.github": "GitHub",
    "projects.link.demo": "ライブデモ",
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
