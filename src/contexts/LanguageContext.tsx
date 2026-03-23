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
    "nav.blog": "Blog",
    "nav.aiAnalyst": "AI Analyst",

    // Hero
    "hero.headline": "I see problems. I build solutions.",
    "hero.subtitle": "A phone had 26 backdoor connections — I built a security scanner with Suricata IDS.\nGovernment broke the internet — I built VPN infrastructure for 100+ clients.\nSomeone needed a crypto wallet — I shipped it to the App Store.",
    "hero.punchline": "20+ products. 6 years. Every time a new field.",
    "hero.availability": "Open to full-time roles and select projects worldwide.",
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
    "projects.page.subtitle": "20+ shipped products across security, AI, fintech, infrastructure, and developer tools.",
    "projects.backToProjects": "\u2190 Back to Projects",

    // Blog Page
    "blog.title": "Blog",
    "blog.subtitle": "Articles about security, AI, infrastructure, and developer tools.",
    "blog.backToBlog": "\u2190 Back to Blog",
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
    "about.p1": "I build things that solve real problems. In whatever field the problem lives.",
    "about.p2": "A friend's phone was compromised — I'd never built a security scanner before. Two days later I had a working product with Suricata IDS, behavioral analysis, and AI-generated reports finding real threats on real devices.",
    "about.p3": "Government breaks the internet — I build VPN infrastructure that bypasses censorship for dozens of clients. Need a crypto wallet — I ship it to the App Store. Need a marketplace — I build it on Flutter and GCP. Need developer tools — I publish them on GitHub.",
    "about.p4": "Before software, I led geological field expeditions in Kolyma, Siberia — mapping subsurface structures in conditions where you can't afford to guess wrong.",
    "about.p5": "6 years running CREATMAN. 20+ shipped products. Security, AI, fintech, infrastructure, automation, developer tools, education.",
    "about.tagline": "I don't specialize. I solve.",
    "about.fact1": "20+ Products",
    "about.fact2": "6 Years Solo",
    "about.fact3": "Open Worldwide",
    "about.fact4": "Idea → Production",

    // Contact Form
    "contact.title": "Get In Touch",
    "contact.name": "Your Name",
    "contact.namePlaceholder": "John Doe",
    "contact.contact": "Email or Telegram",
    "contact.contactPlaceholder": "@username or email@example.com",
    "contact.purpose": "What brings you here?",
    "contact.purpose.hire": "Hire for a role",
    "contact.purpose.discuss": "Discuss a project",
    "contact.purpose.consulting": "Technical consulting",
    "contact.purpose.connect": "Just want to connect",
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
    "nav.blog": "Блог",
    "nav.aiAnalyst": "AI Аналитик",

    // Hero
    "hero.headline": "Вижу проблемы. Строю решения.",
    "hero.subtitle": "У телефона было 26 бэкдор-соединений — я построил сканер безопасности с Suricata IDS.\nПравительство сломало интернет — я построил VPN-инфраструктуру для 100+ клиентов.\nКому-то понадобился крипто-кошелёк — я выпустил его в App Store.",
    "hero.punchline": "20+ продуктов. 6 лет. Каждый раз новая область.",
    "hero.availability": "Открыт к штатным позициям и избранным проектам по всему миру.",
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
    "projects.page.subtitle": "20+ продуктов в безопасности, AI, финтехе, инфраструктуре и инструментах разработчика.",
    "projects.backToProjects": "\u2190 К проектам",

    // Blog Page
    "blog.title": "Блог",
    "blog.subtitle": "Статьи о безопасности, AI, инфраструктуре и инструментах разработчика.",
    "blog.backToBlog": "\u2190 К блогу",
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
    "about.p1": "Я строю вещи, которые решают реальные проблемы. В какой бы области эта проблема ни жила.",
    "about.p2": "Телефон друга был скомпрометирован — я никогда раньше не строил сканер безопасности. Через два дня у меня был рабочий продукт с Suricata IDS, поведенческим анализом и AI-отчётами, находящими реальные угрозы на реальных устройствах.",
    "about.p3": "Правительство ломает интернет — я строю VPN-инфраструктуру, обходящую цензуру для десятков клиентов. Нужен крипто-кошелёк — выпускаю в App Store. Нужен маркетплейс — строю на Flutter и GCP. Нужны developer tools — публикую на GitHub.",
    "about.p4": "До софтвера я руководил геологическими полевыми экспедициями на Колыме, в Сибири — картировал подземные структуры в условиях, где нельзя позволить себе ошибку.",
    "about.p5": "6 лет CREATMAN. 20+ shipped продуктов. Безопасность, AI, финтех, инфраструктура, автоматизация, developer tools, образование.",
    "about.tagline": "Я не специализируюсь. Я решаю.",
    "about.fact1": "20+ Продуктов",
    "about.fact2": "6 Лет Соло",
    "about.fact3": "Открыт миру",
    "about.fact4": "Идея → Продакшн",

    // Contact Form
    "contact.title": "Связаться",
    "contact.name": "Ваше имя",
    "contact.namePlaceholder": "Иван Иванов",
    "contact.contact": "Email или Telegram",
    "contact.contactPlaceholder": "@username или email@example.com",
    "contact.purpose": "Цель обращения",
    "contact.purpose.hire": "Нанять на позицию",
    "contact.purpose.discuss": "Обсудить проект",
    "contact.purpose.consulting": "Техническая консультация",
    "contact.purpose.connect": "Просто познакомиться",
    "contact.message": "Сообщение (необязательно)",
    "contact.messagePlaceholder": "Расскажите о проекте или возможности...",
    "contact.submit": "Отправить",
    "contact.sending": "Отправка...",
    "contact.success": "Спасибо! Я свяжусь с вами в ближайшее время.",
    "contact.error": "Не удалось отправить. Попробуйте ещё раз или свяжитесь напрямую.",
    "contact.orReach": "Или напрямую:",

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
  useEffect(() => {
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
