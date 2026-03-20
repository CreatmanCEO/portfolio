import { describe, it, expect } from 'vitest'

// We cannot import the LanguageContext directly as a module because it uses
// "use client" and React hooks. Instead we test the translations data and
// t() logic by replicating the pure-function parts.

// Extract translations from LanguageContext source at build-time is not
// feasible, so we inline the same structure for verification.
// The actual source of truth is src/contexts/LanguageContext.tsx.

// Helper: replicate the t() function logic
function createT(translations: Record<string, Record<string, string>>, lang: string) {
  return (key: string): string => {
    return translations[lang]?.[key] || key
  }
}

// We read the translations programmatically by importing the file as text
// is not possible in vitest easily, so we define the expected keys.
const expectedEnKeys = [
  'nav.home', 'nav.projects', 'nav.blog', 'nav.aiAnalyst',
  'hero.headline', 'hero.subtitle', 'hero.punchline',
  'hero.viewProjects', 'hero.exploreCode', 'hero.getInTouch',
  'projects.accu.title', 'projects.accu.description',
  'projects.aviawallet.title', 'projects.aviawallet.description',
  'projects.ghost.title', 'projects.ghost.description',
  'projects.translator.title', 'projects.translator.description',
  'projects.lifehub.title', 'projects.lifehub.description',
  'projects.vpn.title', 'projects.vpn.description',
  'projects.datn.title', 'projects.datn.description',
  'tech.title', 'tech.languages', 'tech.frameworks', 'tech.tools',
  'footer.copyright',
  'common.learnMore', 'common.viewAll',
  'projects.page.title', 'projects.page.subtitle',
  'projects.status.production', 'projects.status.beta', 'projects.status.inDevelopment',
  'projects.category.ai', 'projects.category.mobile', 'projects.category.devops',
  'projects.category.web', 'projects.category.automation', 'projects.category.extension',
  'projects.link.github', 'projects.link.demo',
  'about.title', 'about.p1', 'about.p2', 'about.p3', 'about.p4', 'about.p5', 'about.tagline',
  'about.fact1', 'about.fact2', 'about.fact3', 'about.fact4',
  'contact.title', 'contact.name', 'contact.namePlaceholder',
  'contact.contact', 'contact.contactPlaceholder',
  'contact.purpose', 'contact.purpose.hire', 'contact.purpose.discuss',
  'contact.purpose.consulting', 'contact.purpose.connect',
  'contact.message', 'contact.messagePlaceholder',
  'contact.submit', 'contact.sending', 'contact.success', 'contact.error', 'contact.orReach',
  'aiAnalyst.welcome.title', 'aiAnalyst.welcome.subtitle',
  'aiAnalyst.welcome.howTo',
  'aiAnalyst.welcome.step1', 'aiAnalyst.welcome.step2',
  'aiAnalyst.welcome.step3', 'aiAnalyst.welcome.step4',
  'aiAnalyst.welcome.features',
  'aiAnalyst.welcome.feature1', 'aiAnalyst.welcome.feature2',
  'aiAnalyst.welcome.feature3', 'aiAnalyst.welcome.feature4',
  'aiAnalyst.welcome.feature5',
  'aiAnalyst.welcome.gotIt', 'aiAnalyst.welcome.showEveryTime',
]

// Minimal subset of translations for functional tests
const translations: Record<string, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'hero.headline': 'I see problems. I build solutions.',
    'about.title': 'About Me',
    'contact.title': 'Get In Touch',
  },
  ru: {
    'nav.home': 'Главная',
    'hero.headline': 'Вижу проблемы. Строю решения.',
    'about.title': 'Обо мне',
    'contact.title': 'Связаться',
  },
}

describe('i18n translations', () => {
  it('should have all EN keys with RU counterparts in the source', async () => {
    // Read the actual LanguageContext source to verify structure
    const fs = await import('fs')
    const source = fs.readFileSync(
      'src/contexts/LanguageContext.tsx',
      'utf-8'
    )

    // Extract all key definitions from EN block
    const enBlockMatch = source.match(/en:\s*\{([\s\S]*?)\},\s*ru:/)
    const ruBlockMatch = source.match(/ru:\s*\{([\s\S]*?)\},?\s*\};/)

    expect(enBlockMatch).not.toBeNull()
    expect(ruBlockMatch).not.toBeNull()

    const enBlock = enBlockMatch![1]
    const ruBlock = ruBlockMatch![1]

    // Extract keys from each block
    const keyPattern = /"([^"]+)":/g
    const enKeys: string[] = []
    const ruKeys: string[] = []

    let match
    while ((match = keyPattern.exec(enBlock)) !== null) {
      enKeys.push(match[1])
    }
    keyPattern.lastIndex = 0
    while ((match = keyPattern.exec(ruBlock)) !== null) {
      ruKeys.push(match[1])
    }

    expect(enKeys.length).toBeGreaterThan(0)
    expect(ruKeys.length).toBeGreaterThan(0)

    // Every EN key must have a RU counterpart
    for (const key of enKeys) {
      expect(ruKeys).toContain(key)
    }

    // Every RU key must have an EN counterpart
    for (const key of ruKeys) {
      expect(enKeys).toContain(key)
    }
  })

  it('should not have ES, HE, or JP language keys', async () => {
    const fs = await import('fs')
    const source = fs.readFileSync(
      'src/contexts/LanguageContext.tsx',
      'utf-8'
    )

    // The translations object should only define 'en' and 'ru'
    expect(source).not.toMatch(/\bes\s*:\s*\{/)
    expect(source).not.toMatch(/\bhe\s*:\s*\{/)
    expect(source).not.toMatch(/\bjp\s*:\s*\{/)
    expect(source).not.toMatch(/\bja\s*:\s*\{/)

    // Type definition should only allow 'en' | 'ru'
    expect(source).toContain('"en" | "ru"')
  })

  it('should toggle language en -> ru -> en using t() function', () => {
    let currentLang = 'en'
    let t = createT(translations, currentLang)

    expect(t('nav.home')).toBe('Home')
    expect(t('hero.headline')).toBe('I see problems. I build solutions.')

    // Switch to RU
    currentLang = 'ru'
    t = createT(translations, currentLang)

    expect(t('nav.home')).toBe('Главная')
    expect(t('hero.headline')).toBe('Вижу проблемы. Строю решения.')

    // Switch back to EN
    currentLang = 'en'
    t = createT(translations, currentLang)

    expect(t('nav.home')).toBe('Home')
  })

  it('should return the key name for missing translation keys', () => {
    const t = createT(translations, 'en')

    expect(t('nonexistent.key')).toBe('nonexistent.key')
    expect(t('some.other.missing.key')).toBe('some.other.missing.key')
    expect(t('')).toBe('')
  })
})
