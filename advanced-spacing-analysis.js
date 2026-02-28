const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('=== ADVANCED SPACING ANALYSIS ===\n');

  // Homepage analysis
  await page.goto('https://creatman.site/', { waitUntil: 'networkidle' });

  const spacingData = await page.evaluate(() => {
    const results = {
      hero: {},
      featuredProjects: {},
      projectCards: [],
      techStack: {},
      computedStyles: {}
    };

    // Hero section analysis
    const heroSection = document.querySelector('section');
    if (heroSection) {
      const heroStyles = window.getComputedStyle(heroSection);
      results.hero = {
        element: 'Hero section',
        paddingTop: heroStyles.paddingTop,
        paddingBottom: heroStyles.paddingBottom,
        marginBottom: heroStyles.marginBottom,
        classes: heroSection.className
      };

      // Hero children - detailed spacing
      const heroDiv = heroSection.querySelector('div');
      if (heroDiv) {
        const heroDivStyles = window.getComputedStyle(heroDiv);
        results.hero.firstDiv = {
          marginBottom: heroDivStyles.marginBottom,
          classes: heroDiv.className
        };

        // Check each child element spacing
        Array.from(heroDiv.children).forEach((child, idx) => {
          const styles = window.getComputedStyle(child);
          results.hero[`child_${idx}_${child.tagName}`] = {
            marginBottom: styles.marginBottom,
            marginTop: styles.marginTop,
            paddingBottom: styles.paddingBottom,
            paddingTop: styles.paddingTop,
            classes: child.className,
            text: child.textContent?.substring(0, 50)
          };
        });
      }
    }

    // Featured Projects section
    const featuredHeading = Array.from(document.querySelectorAll('h2')).find(h =>
      h.textContent.includes('ИЗБРАННЫЕ') || h.textContent.includes('FEATURED')
    );
    if (featuredHeading) {
      const styles = window.getComputedStyle(featuredHeading);
      results.featuredProjects = {
        marginBottom: styles.marginBottom,
        marginTop: styles.marginTop,
        classes: featuredHeading.className
      };
    }

    // Project cards - detailed analysis
    const cards = document.querySelectorAll('a[class*="rounded-lg"]');
    cards.forEach((card, idx) => {
      if (idx < 2) { // First 2 cards
        const cardStyles = window.getComputedStyle(card);
        const cardData = {
          index: idx,
          padding: cardStyles.padding,
          classes: card.className,
          children: []
        };

        // Analyze card children spacing
        Array.from(card.children).forEach((child, childIdx) => {
          const childStyles = window.getComputedStyle(child);
          cardData.children.push({
            index: childIdx,
            tag: child.tagName,
            marginBottom: childStyles.marginBottom,
            marginTop: childStyles.marginTop,
            paddingBottom: childStyles.paddingBottom,
            classes: child.className,
            text: child.textContent?.substring(0, 40)
          });
        });

        results.projectCards.push(cardData);
      }
    });

    // Tech stack section
    const techStackHeading = Array.from(document.querySelectorAll('h2')).find(h =>
      h.textContent.includes('ТЕХНОЛОГИЧЕСКИЙ') || h.textContent.includes('TECH STACK')
    );
    if (techStackHeading) {
      const parentDiv = techStackHeading.parentElement;
      const parentStyles = window.getComputedStyle(parentDiv);
      results.techStack = {
        marginTop: parentStyles.marginTop,
        marginBottom: parentStyles.marginBottom,
        paddingTop: parentStyles.paddingTop,
        classes: parentDiv.className
      };
    }

    // Get computed CSS values
    const testDiv = document.createElement('div');
    testDiv.className = 'mb-4';
    document.body.appendChild(testDiv);
    results.computedStyles.mb4 = window.getComputedStyle(testDiv).marginBottom;
    testDiv.className = 'mb-6';
    results.computedStyles.mb6 = window.getComputedStyle(testDiv).marginBottom;
    testDiv.className = 'mb-10';
    results.computedStyles.mb10 = window.getComputedStyle(testDiv).marginBottom;
    testDiv.className = 'mb-24';
    results.computedStyles.mb24 = window.getComputedStyle(testDiv).marginBottom;
    testDiv.className = 'mb-32';
    results.computedStyles.mb32 = window.getComputedStyle(testDiv).marginBottom;
    document.body.removeChild(testDiv);

    return results;
  });

  console.log('SPACING DATA:');
  console.log(JSON.stringify(spacingData, null, 2));

  // Screenshot with annotations
  await page.screenshot({
    path: 'screenshots/homepage-annotated.png',
    fullPage: false
  });

  // Projects page
  await page.goto('https://creatman.site/projects', { waitUntil: 'networkidle' });

  const projectsSpacing = await page.evaluate(() => {
    const results = {
      header: {},
      cards: []
    };

    // Header spacing
    const header = document.querySelector('main > div');
    if (header) {
      const headerStyles = window.getComputedStyle(header);
      results.header = {
        marginBottom: headerStyles.marginBottom,
        classes: header.className
      };
    }

    // Card internal spacing
    const cards = document.querySelectorAll('div[class*="rounded-2xl"]');
    cards.forEach((card, idx) => {
      if (idx < 2) {
        const cardData = {
          index: idx,
          children: []
        };

        Array.from(card.children).forEach((child, childIdx) => {
          const styles = window.getComputedStyle(child);
          cardData.children.push({
            index: childIdx,
            tag: child.tagName,
            marginBottom: styles.marginBottom,
            marginTop: styles.marginTop,
            classes: child.className,
            hasText: child.textContent?.length > 0
          });
        });

        results.cards.push(cardData);
      }
    });

    return results;
  });

  console.log('\nPROJECTS PAGE SPACING:');
  console.log(JSON.stringify(projectsSpacing, null, 2));

  await page.screenshot({
    path: 'screenshots/projects-annotated.png',
    fullPage: false
  });

  await browser.close();
  console.log('\nScreenshots saved to screenshots/');
})();
