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
    "hero.label": "Full-Stack Product Developer",
    "hero.headline": "Solo-shipped to Production",
    "hero.description": "✓ Published in App Store & Production\n✓ VPN Infrastructure for Business Clients\n✓ AI-powered Automation Tools",
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

    // About Me
    "about.title": "About Me",
    "about.bio.p1": "I'm a Python developer and automation engineer with 5 years of experience building and shipping products end-to-end. Before tech, I worked as an engineering geologist — mapping subsurface structures and modeling complex data taught me to think in systems and solve problems with precision. Now I apply that mindset to software: from AI-powered tools to production infrastructure.",
    "about.bio.p2": "I solo-ship. My projects include an AI desktop assistant with real-time screen analysis and multi-LLM support, production VPN infrastructure with DPI bypass serving business clients, mobile apps published in the App Store, and 15+ Telegram bots and automation workflows in production. My core stack is Python, but I work across the full cycle — backend, infrastructure, deployment, and when needed, frontend.",
    "about.bio.p3": "Currently based in Russia and actively looking for opportunities abroad — remote or relocation, anywhere in the world. If you need a developer who can own a product from architecture to production, let's talk.",
    "about.location": "Based in Russia",
    "about.status": "Open to remote & relocation",
    "about.experience": "5 years experience",
    "about.background": "Engineering geologist → Developer",
  },
  es: {
    // Navigation
    "nav.home": "Inicio",
    "nav.projects": "Proyectos",
    "nav.aiAnalyst": "Analista AI",

    // Hero
    "hero.label": "Desarrollador de Producto Full-Stack",
    "hero.headline": "Lanzado a Producción en Solitario",
    "hero.description": "✓ Publicado en App Store y Producción\n✓ Infraestructura VPN para Clientes Empresariales\n✓ Herramientas de Automatización con IA",
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

    // About Me
    "about.title": "Sobre Mí",
    "about.bio.p1": "Soy un desarrollador de Python e ingeniero de automatización con 5 años de experiencia construyendo y lanzando productos de extremo a extremo. Antes de la tecnología, trabajé como geólogo de ingeniería: el mapeo de estructuras subterráneas y el modelado de datos complejos me enseñaron a pensar en sistemas y resolver problemas con precisión. Ahora aplico esa mentalidad al software: desde herramientas impulsadas por IA hasta infraestructura de producción.",
    "about.bio.p2": "Lanzo proyectos en solitario. Mis proyectos incluyen un asistente de escritorio de IA con análisis de pantalla en tiempo real y soporte multi-LLM, infraestructura VPN de producción con bypass DPI sirviendo clientes empresariales, aplicaciones móviles publicadas en App Store, y más de 15 bots de Telegram y flujos de automatización en producción. Mi stack principal es Python, pero trabajo en todo el ciclo: backend, infraestructura, despliegue y, cuando es necesario, frontend.",
    "about.bio.p3": "Actualmente ubicado en Rusia y buscando activamente oportunidades en el extranjero: remoto o reubicación, en cualquier parte del mundo. Si necesitas un desarrollador que pueda ser dueño de un producto desde la arquitectura hasta la producción, hablemos.",
    "about.location": "Ubicado en Rusia",
    "about.status": "Abierto a remoto y reubicación",
    "about.experience": "5 años de experiencia",
    "about.background": "Geólogo de ingeniería → Desarrollador",
  },
  ru: {
    // Navigation
    "nav.home": "Главная",
    "nav.projects": "Проекты",
    "nav.aiAnalyst": "AI Аналитик",

    // Hero
    "hero.label": "Full-Stack Product Developer",
    "hero.headline": "Solo-shipped to Production",
    "hero.description": "✓ Опубликовано в App Store и Production\n✓ VPN-инфраструктура для бизнес-клиентов\n✓ AI-инструменты автоматизации",
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

    // About Me
    "about.title": "Обо мне",
    "about.bio.p1": "Я Python-разработчик и инженер по автоматизации с 5-летним опытом создания и запуска продуктов от начала до конца. До технологий я работал инженером-геологом — картирование подземных структур и моделирование сложных данных научили меня мыслить системно и решать проблемы с точностью. Теперь я применяю этот подход к разработке ПО: от AI-инструментов до продакшн-инфраструктуры.",
    "about.bio.p2": "Я запускаю проекты самостоятельно. Мои проекты включают AI-ассистент для desktop с анализом экрана в реальном времени и поддержкой нескольких LLM, продакшн VPN-инфраструктуру с обходом DPI для бизнес-клиентов, мобильные приложения в App Store и 15+ Telegram-ботов и автоматизаций в продакшене. Мой основной стек — Python, но я работаю на всех этапах: backend, инфраструктура, деплой и, при необходимости, frontend.",
    "about.bio.p3": "Сейчас нахожусь в России и активно ищу возможности за рубежом — удаленная работа или релокация, в любую точку мира. Если вам нужен разработчик, который может вести продукт от архитектуры до продакшена — давайте поговорим.",
    "about.location": "Нахожусь в России",
    "about.status": "Открыт к удаленке и релокации",
    "about.experience": "5 лет опыта",
    "about.background": "Инженер-геолог → Разработчик",
  },
  he: {
    // Navigation
    "nav.home": "בית",
    "nav.projects": "פרויקטים",
    "nav.aiAnalyst": "אנליסט AI",

    // Hero
    "hero.label": "מפתח מוצר Full-Stack",
    "hero.headline": "שוחרר לייצור באופן עצמאי",
    "hero.description": "✓ פורסם ב-App Store וב-Production\n✓ תשתית VPN עבור לקוחות עסקיים\n✓ כלי אוטומציה מבוססי AI",
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

    // About Me
    "about.title": "אודותיי",
    "about.bio.p1": "אני מפתח Python ומהנדס אוטומציה עם 5 שנות ניסיון בבנייה ושיגור מוצרים מקצה לקצה. לפני עולם הטכנולוגיה, עבדתי כגאולוג הנדסי — מיפוי מבנים תת-קרקעיים ומידול נתונים מורכבים לימדו אותי לחשוב במערכות ולפתור בעיות בדיוק. כעת אני מיישם חשיבה זו בפיתוח תוכנה: מכלי AI ועד תשתית ייצור.",
    "about.bio.p2": "אני משגר פרויקטים לבד. הפרויקטים שלי כוללים עוזר AI לשולחן עבודה עם ניתוח מסך בזמן אמת ותמיכה במספר LLM, תשתית VPN ייצורית עם מעקף DPI המשרתת לקוחות עסקיים, אפליקציות מובייל שפורסמו ב-App Store, ויותר מ-15 בוטים של Telegram ותהליכי אוטומציה בייצור. הסטאק העיקרי שלי הוא Python, אבל אני עובד על כל המחזור — backend, תשתית, פריסה, וכשצריך, frontend.",
    "about.bio.p3": "כרגע מבוסס ברוסיה ומחפש באופן אקטיבי הזדמנויות בחו״ל — עבודה מרחוק או רילוקיישן, לכל מקום בעולם. אם אתה צריך מפתח שיכול לנהל מוצר מארכיטקטורה ועד ייצור, בוא נדבר.",
    "about.location": "מבוסס ברוסיה",
    "about.status": "פתוח לעבודה מרחוק ורילוקיישן",
    "about.experience": "5 שנות ניסיון",
    "about.background": "גאולוג הנדסי → מפתח",
  },
  jp: {
    // Navigation
    "nav.home": "ホーム",
    "nav.projects": "プロジェクト",
    "nav.aiAnalyst": "AIアナリスト",

    // Hero
    "hero.label": "フルスタックプロダクト開発者",
    "hero.headline": "単独でプロダクションにリリース",
    "hero.description": "✓ App StoreとProductionで公開\n✓ ビジネスクライアント向けVPNインフラ\n✓ AI搭載自動化ツール",
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

    // About Me
    "about.title": "私について",
    "about.bio.p1": "私は5年の経験を持つPython開発者および自動化エンジニアで、製品のエンドツーエンドの構築と出荷を行っています。テクノロジー業界に入る前は、エンジニアリング地質学者として働いていました。地下構造のマッピングと複雑なデータのモデリングを通じて、システム思考と精密な問題解決を学びました。現在はその考え方をソフトウェアに適用しています：AI搭載ツールから本番インフラまで。",
    "about.bio.p2": "私は単独で製品を出荷します。私のプロジェクトには、リアルタイム画面分析とマルチLLMサポートを備えたAIデスクトップアシスタント、ビジネスクライアントにサービスを提供するDPIバイパス付き本番VPNインフラ、App Storeで公開されたモバイルアプリ、本番環境で稼働する15以上のTelegramボットと自動化ワークフローが含まれます。コアスタックはPythonですが、バックエンド、インフラ、デプロイメント、必要に応じてフロントエンドまで、フルサイクルで作業します。",
    "about.bio.p3": "現在ロシアを拠点としており、海外での機会を積極的に探しています。リモートまたはリロケーション、世界中どこでも対応可能です。アーキテクチャから本番環境まで製品を所有できる開発者が必要な場合は、ぜひお話ししましょう。",
    "about.location": "ロシア在住",
    "about.status": "リモート・リロケーション可",
    "about.experience": "5年の経験",
    "about.background": "エンジニアリング地質学者 → 開発者",
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
