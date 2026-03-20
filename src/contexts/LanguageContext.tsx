"use client";

import { createContext, useContext, useEffect, useState } from "react";

type LanguageCode = "en" | "ru";

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
    "hero.headline": "I see problems. I build solutions.",
    "hero.subtitle": "A phone had 26 backdoor connections — I built a security scanner with Suricata IDS.\nGovernment broke the internet — I built VPN infrastructure for 100+ clients.\nSomeone needed a crypto wallet — I shipped it to the App Store.",
    "hero.punchline": "20+ products. 6 years. Every time a new field.",
    "hero.viewProjects": "View Projects",
    "hero.exploreCode": "Explore My Code with AI",
    "hero.getInTouch": "Get in touch ↓",

    // Projects
    "projects.accu.title": "ACCU",
    "projects.accu.description": "Automated Claude Code agent updater. Monitors GitHub releases, auto-updates binary, notification system. Self-hosted on VPS.",
    "projects.aviawallet.title": "AviaWallet",
    "projects.aviawallet.description": "iOS app for managing aviation wallet points. Built with Flutter, shipped to App Store. Features offline sync, push notifications, analytics.",
    "projects.ghost.title": "GHOST",
    "projects.ghost.description": "AI assistant with invisible overlay for interviews, meetings, and coding. Multi-provider LLM support (Claude, GPT-4, Gemini), real-time voice transcription.",
    "projects.translator.title": "Hebrew Translator Bot",
    "projects.translator.description": "Telegram bot for document translation with OCR support. Handles images, PDFs, text. Translation memory for consistency.",

    // New projects
    "projects.lifehub.title": "Creatman Life Hub",
    "projects.lifehub.description": "AI-powered life management system with goal visualization, natural language input, and intelligent activity classification. Track progress through plant growth metaphor.",

    "projects.vpn.title": "VPN Infrastructure",
    "projects.vpn.description": "Production VPN infrastructure with WebSocket transport and DPI bypass serving business clients. Custom protocol implementation with automated monitoring.",

    "projects.datn.title": "DATN",
    "projects.datn.description": "Multi-agent trading AI system with complex decision-making architecture. Concept phase exploring autonomous trading strategies with AI coordination.",

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

    // Contact Form
    "contact.title": "Let's Work Together",
    "contact.name": "Your Name",
    "contact.namePlaceholder": "John Doe",
    "contact.contact": "Email or Telegram",
    "contact.contactPlaceholder": "@username or email@example.com",
    "contact.purpose": "What brings you here?",
    "contact.purpose.collaborate": "Let's collaborate",
    "contact.purpose.project": "Order a project",
    "contact.purpose.hire": "Hire for a position",
    "contact.message": "Message (optional)",
    "contact.messagePlaceholder": "Tell me about your project or opportunity...",
    "contact.submit": "Send Message",
    "contact.sending": "Sending...",
    "contact.success": "Thanks! I'll get back to you soon.",
    "contact.error": "Failed to send. Please try again or contact me directly.",
    "contact.orReach": "Or reach me directly:",

    // AI Analyst Welcome
    "aiAnalyst.welcome.title": "Welcome to AI Code Analyst",
    "aiAnalyst.welcome.subtitle": "Analyze any code instantly using Gemini AI",
    "aiAnalyst.welcome.howTo": "How to use:",
    "aiAnalyst.welcome.step1": "Select files from file tree (left)",
    "aiAnalyst.welcome.step2": "OR paste your code in the editor (center)",
    "aiAnalyst.welcome.step3": "Choose language (top right)",
    "aiAnalyst.welcome.step4": "Click \"Analyze Code\" → get instant review",
    "aiAnalyst.welcome.features": "Features:",
    "aiAnalyst.welcome.feature1": "Code quality assessment",
    "aiAnalyst.welcome.feature2": "Bug detection",
    "aiAnalyst.welcome.feature3": "Improvement suggestions",
    "aiAnalyst.welcome.feature4": "Best practices check",
    "aiAnalyst.welcome.feature5": "Multi-language support (EN, RU)",
    "aiAnalyst.welcome.gotIt": "Got it, let's start",
    "aiAnalyst.welcome.showEveryTime": "Show every time",
  },
  ru: {
    // Navigation
    "nav.home": "Главная",
    "nav.projects": "Проекты",
    "nav.aiAnalyst": "AI Аналитик",

    // Hero
    "hero.headline": "Вижу проблемы. Строю решения.",
    "hero.subtitle": "У телефона было 26 бэкдор-соединений — я построил сканер безопасности с Suricata IDS.\nПравительство сломало интернет — я построил VPN-инфраструктуру для 100+ клиентов.\nКому-то понадобился крипто-кошелёк — я выпустил его в App Store.",
    "hero.punchline": "20+ продуктов. 6 лет. Каждый раз новая область.",
    "hero.viewProjects": "Смотреть проекты",
    "hero.exploreCode": "Исследовать код с AI",
    "hero.getInTouch": "Связаться ↓",

    // Projects
    "projects.accu.title": "ACCU",
    "projects.accu.description": "Автоматизированный обновлятель агента Claude Code. Мониторинг релизов GitHub, автообновление бинарных файлов, система уведомлений. Размещён на собственном VPS.",
    "projects.aviawallet.title": "AviaWallet",
    "projects.aviawallet.description": "iOS приложение для управления баллами авиа кошелька. Разработано на Flutter, опубликовано в App Store. Функции: оффлайн синхронизация, push-уведомления, аналитика.",
    "projects.ghost.title": "GHOST",
    "projects.ghost.description": "AI-ассистент с невидимым оверлеем для интервью, встреч и программирования. Поддержка нескольких LLM провайдеров (Claude, GPT-4, Gemini), транскрипция голоса в реальном времени.",
    "projects.translator.title": "Бот-переводчик иврита",
    "projects.translator.description": "Telegram бот для перевода документов с поддержкой OCR. Обрабатывает изображения, PDF, текст. Память переводов для согласованности.",

    // New projects
    "projects.lifehub.title": "Creatman Life Hub",
    "projects.lifehub.description": "AI-система управления жизнью с визуализацией целей, вводом на естественном языке и интеллектуальной классификацией активностей. Отслеживание прогресса через метафору роста растений.",

    "projects.vpn.title": "VPN-инфраструктура",
    "projects.vpn.description": "Продакшн VPN-инфраструктура с WebSocket-транспортом и обходом DPI для бизнес-клиентов. Реализация собственного протокола с автоматизированным мониторингом.",

    "projects.datn.title": "DATN",
    "projects.datn.description": "Мультиагентная торговая AI-система со сложной архитектурой принятия решений. Концептуальная фаза исследования автономных торговых стратегий с координацией ИИ.",

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

    // Contact Form
    "contact.title": "Давайте работать вместе",
    "contact.name": "Ваше имя",
    "contact.namePlaceholder": "Иван Иванов",
    "contact.contact": "Email или Telegram",
    "contact.contactPlaceholder": "@username или email@example.com",
    "contact.purpose": "Что вас привело?",
    "contact.purpose.collaborate": "Давайте сотрудничать",
    "contact.purpose.project": "Заказать проект",
    "contact.purpose.hire": "Нанять на должность",
    "contact.message": "Сообщение (необязательно)",
    "contact.messagePlaceholder": "Расскажите о вашем проекте или возможности...",
    "contact.submit": "Отправить сообщение",
    "contact.sending": "Отправка...",
    "contact.success": "Спасибо! Я скоро свяжусь с вами.",
    "contact.error": "Не удалось отправить. Попробуйте снова или свяжитесь со мной напрямую.",
    "contact.orReach": "Или свяжитесь со мной напрямую:",

    // AI Analyst Welcome
    "aiAnalyst.welcome.title": "Добро пожаловать в AI Code Analyst",
    "aiAnalyst.welcome.subtitle": "Анализируйте любой код мгновенно с помощью Gemini AI",
    "aiAnalyst.welcome.howTo": "Как использовать:",
    "aiAnalyst.welcome.step1": "Выберите файлы из дерева файлов (слева)",
    "aiAnalyst.welcome.step2": "ИЛИ вставьте код в редактор (в центре)",
    "aiAnalyst.welcome.step3": "Выберите язык (справа вверху)",
    "aiAnalyst.welcome.step4": "Нажмите \"Analyze Code\" → получите мгновенный обзор",
    "aiAnalyst.welcome.features": "Возможности:",
    "aiAnalyst.welcome.feature1": "Оценка качества кода",
    "aiAnalyst.welcome.feature2": "Обнаружение ошибок",
    "aiAnalyst.welcome.feature3": "Предложения по улучшению",
    "aiAnalyst.welcome.feature4": "Проверка лучших практик",
    "aiAnalyst.welcome.feature5": "Поддержка нескольких языков (EN, RU)",
    "aiAnalyst.welcome.gotIt": "Понятно, начнём",
    "aiAnalyst.welcome.showEveryTime": "Показывать каждый раз",
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
      const supportedLang: LanguageCode = browserLang === "ru" ? "ru" : "en";
      setLanguageState(supportedLang);
    }
  }, []);

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
