import { describe, it, expect } from 'vitest'

// Integration test for the homepage structure.
// We verify the page composition and data contracts without rendering React
// (which would require complex mocking of Next.js server components).

describe('Homepage integration', () => {
  it('should import all section components referenced in page.tsx', async () => {
    const fs = await import('fs')
    const pageSource = fs.readFileSync('src/app/page.tsx', 'utf-8')

    // Verify all 4 main sections are imported and used
    expect(pageSource).toContain("import Hero from")
    expect(pageSource).toContain("import AboutMe from")
    expect(pageSource).toContain("import TechStack from")
    expect(pageSource).toContain("import ContactForm from")

    // Verify they are rendered in the JSX
    expect(pageSource).toContain('<Hero')
    expect(pageSource).toContain('<AboutMe')
    expect(pageSource).toContain('<TechStack')
    expect(pageSource).toContain('<ContactForm')
  })

  it('should have exactly 4 contact purpose options in ContactForm', async () => {
    const fs = await import('fs')
    const source = fs.readFileSync('src/components/ContactForm.tsx', 'utf-8')

    // Count <option value="..."> elements
    const optionMatches = source.match(/<option\s+value="/g)
    expect(optionMatches).not.toBeNull()
    expect(optionMatches!.length).toBe(4)

    // Verify the 4 purpose values
    expect(source).toContain('value="hire"')
    expect(source).toContain('value="discuss"')
    expect(source).toContain('value="consulting"')
    expect(source).toContain('value="connect"')
  })

  it('should define exactly 4 quick facts in AboutMe', async () => {
    const fs = await import('fs')
    const source = fs.readFileSync('src/components/AboutMe.tsx', 'utf-8')

    // The quickFacts array should have 4 items
    const factMatches = source.match(/\{\s*icon:\s*"[^"]+",\s*key:\s*"about\.fact\d+"\s*\}/g)
    expect(factMatches).not.toBeNull()
    expect(factMatches!.length).toBe(4)

    // Verify the keys
    expect(source).toContain('"about.fact1"')
    expect(source).toContain('"about.fact2"')
    expect(source).toContain('"about.fact3"')
    expect(source).toContain('"about.fact4"')
  })

  it('should include JsonLd structured data on homepage', async () => {
    const fs = await import('fs')
    const source = fs.readFileSync('src/app/page.tsx', 'utf-8')

    expect(source).toContain('import JsonLd from')
    expect(source).toContain('<JsonLd')
    expect(source).toContain('"@context": "https://schema.org"')
    expect(source).toContain('"@type": "Person"')
    expect(source).toContain('name: "Creatman"')
  })

  it('should render Footer on the homepage', async () => {
    const fs = await import('fs')
    const source = fs.readFileSync('src/app/page.tsx', 'utf-8')

    expect(source).toContain("import Footer from")
    expect(source).toContain('<Footer')
  })

  it('should have TechStack with primary and secondary stacks', async () => {
    const fs = await import('fs')
    const source = fs.readFileSync('src/components/TechStack.tsx', 'utf-8')

    // Verify primary stack has 7 items
    const primaryMatch = source.match(/const primaryStack\s*=\s*\[([\s\S]*?)\]/)
    expect(primaryMatch).not.toBeNull()
    const primaryItems = primaryMatch![1].match(/"[^"]+"/g)
    expect(primaryItems).not.toBeNull()
    expect(primaryItems!.length).toBe(7)

    // Verify secondary stack has 12 items
    const secondaryMatch = source.match(/const secondaryStack\s*=\s*\[([\s\S]*?)\]/)
    expect(secondaryMatch).not.toBeNull()
    const secondaryItems = secondaryMatch![1].match(/"[^"]+"/g)
    expect(secondaryItems).not.toBeNull()
    expect(secondaryItems!.length).toBe(12)
  })
})
