const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport to desktop size
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('Taking screenshots of https://creatman.site/');

  // Homepage
  await page.goto('https://creatman.site/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'screenshots/homepage-full.png', fullPage: true });
  console.log('✓ Homepage screenshot saved');

  // Projects page
  await page.goto('https://creatman.site/projects', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'screenshots/projects-full.png', fullPage: true });
  console.log('✓ Projects page screenshot saved');

  // Analyze spacing using DevTools
  const spacingAnalysis = await page.evaluate(() => {
    const results = [];

    // Check Hero section spacing
    const hero = document.querySelector('section');
    if (hero) {
      const styles = window.getComputedStyle(hero);
      results.push({
        element: 'Hero section',
        paddingTop: styles.paddingTop,
        paddingBottom: styles.paddingBottom,
        marginBottom: styles.marginBottom
      });

      // Check children spacing
      const children = hero.children;
      for (let i = 0; i < Math.min(5, children.length); i++) {
        const child = children[i];
        const childStyles = window.getComputedStyle(child);
        results.push({
          element: `Hero child ${i} (${child.tagName})`,
          marginBottom: childStyles.marginBottom,
          marginTop: childStyles.marginTop
        });
      }
    }

    // Check project cards
    const cards = document.querySelectorAll('[class*="rounded-2xl"]');
    if (cards.length > 0) {
      const firstCard = cards[0];
      const cardStyles = window.getComputedStyle(firstCard);
      results.push({
        element: 'Project card',
        padding: cardStyles.padding,
        marginBottom: cardStyles.marginBottom,
        gap: cardStyles.gap
      });

      // Check card children
      const cardChildren = firstCard.children;
      for (let i = 0; i < cardChildren.length; i++) {
        const child = cardChildren[i];
        const childStyles = window.getComputedStyle(child);
        results.push({
          element: `Card child ${i} (${child.className})`,
          marginBottom: childStyles.marginBottom,
          marginTop: childStyles.marginTop
        });
      }
    }

    return results;
  });

  console.log('\n=== SPACING ANALYSIS ===');
  console.log(JSON.stringify(spacingAnalysis, null, 2));

  await browser.close();
  console.log('\nScreenshots saved to screenshots/');
})();
