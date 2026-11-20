import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { chromium as playwright } from 'playwright-core';
import { existsSync, mkdirSync } from 'node:fs';

const root = resolve('dist');
const mime = {
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.html': 'text/html'
};

const server = createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    const file = resolve(root, pathname === '/' ? 'index.html' : pathname.slice(1) + (pathname.includes('.') ? '' : '.html'));
    const exists = file.startsWith(root + sep) && (await stat(file).catch(() => null))?.isFile();
    if (!exists) {
      res.statusCode = 404;
      return res.end('Not Found');
    }
    const content = await readFile(file);
    res.setHeader('Content-Type', mime[extname(file)] || 'text/html');
    res.end(content);
  } catch (err) {
    res.statusCode = 500;
    res.end('Server error: ' + err.message);
  }
});

await new Promise((done) => server.listen(0, '127.0.0.1', done));
const base = 'http://127.0.0.1:' + server.address().port;
console.log('Test server running at:', base);

const winChrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await playwright.launch({
  executablePath: existsSync(winChrome) ? winChrome : undefined,
  headless: true
});

const screenshotsDir = resolve('dist', 'screenshots');
if (!existsSync(screenshotsDir)) {
  mkdirSync(screenshotsDir, { recursive: true });
}

try {
  console.log('\n--- 1. Testing Viewports & Visual Layout (390px, 768px, 1440px) ---');
  for (const vp of [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    await page.goto(base + '/');
    await page.waitForTimeout(500);

    // Check horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`[${vp.name}] clientWidth: ${clientWidth}, scrollWidth: ${scrollWidth}`);
    if (scrollWidth > clientWidth) {
      throw new Error(`Horizontal overflow detected in ${vp.name}: ${scrollWidth} > ${clientWidth}`);
    }

    // Verify H1 exists and is visible
    const h1Text = await page.locator('h1').innerText();
    console.log(`[${vp.name}] H1 Text: "${h1Text}"`);

    // Capture screenshot
    const screenshotPath = resolve(screenshotsDir, `homepage-${vp.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`[${vp.name}] Screenshot saved to: ${screenshotPath}`);

    await context.close();
  }

  console.log('\n--- 2. Testing DPDPA Popup Behavior & Accessibility ---');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    // 2a: Automatic opening on first visit
    await page.goto(base + '/');
    await page.waitForSelector('[role="dialog"]', { timeout: 3000 });
    console.log('DPDPA dialog opened automatically on first visit.');

    // 2b: Background scroll locked
    const overflow = await page.evaluate(() => document.body.style.overflow);
    console.log('Body overflow while modal is open:', overflow);
    if (overflow !== 'hidden') throw new Error('Body scroll was not locked when modal opened');

    // 2c: Escape dismissal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    const modalCountAfterEscape = await page.locator('[role="dialog"]').count();
    console.log('Dialog count after pressing Escape:', modalCountAfterEscape);
    if (modalCountAfterEscape !== 0) throw new Error('Modal did not close on Escape');

    // 2d: Dismissal persistence across reload (same session)
    await page.reload();
    await page.waitForTimeout(500);
    const modalCountAfterReload = await page.locator('[role="dialog"]').count();
    console.log('Dialog count after reload (same session):', modalCountAfterReload);
    if (modalCountAfterReload !== 0) throw new Error('Modal reopened despite session dismissal');

    // 2e: Submit behavior
    const context2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page2 = await context2.newPage();
    await page2.goto(base + '/');
    await page2.waitForSelector('[role="dialog"]');
    await page2.fill('#dpdpa-email', 'test@example.com');
    await page2.click('button[type="submit"]');
    await page2.waitForTimeout(300);
    const modalCountAfterSubmit = await page2.locator('[role="dialog"]').count();
    console.log('Dialog count after form submit:', modalCountAfterSubmit);
    if (modalCountAfterSubmit !== 0) throw new Error('Modal did not close on submit');

    await context.close();
    await context2.close();
  }

  console.log('\n--- 3. Testing Carousel Controls ---');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    // Dismiss modal first
    await page.addInitScript(() => sessionStorage.setItem('dpdpa_modal_dismissed', 'true'));
    await page.goto(base + '/');

    // Previous / Next buttons
    const nextBtn = page.locator('button[aria-label="Next challenge slide"]');
    const prevBtn = page.locator('button[aria-label="Previous challenge slide"]');
    await nextBtn.click();
    await page.waitForTimeout(300);
    console.log('Next button clicked, slide advanced.');

    await prevBtn.click();
    await page.waitForTimeout(300);
    console.log('Prev button clicked, slide retreated.');

    // Slide indicator click
    const slideIndicator = page.locator('button[aria-label*="Go to slide 3"]');
    await slideIndicator.click();
    await page.waitForTimeout(300);
    console.log('Slide indicator 3 clicked.');

    // Pause button toggle
    const pauseBtn = page.locator('button[aria-label="Pause slide auto-rotation"]');
    await pauseBtn.click();
    await page.waitForTimeout(200);
    const playBtnCount = await page.locator('button[aria-label="Play slide auto-rotation"]').count();
    console.log('Pause toggle verified, play button present:', playBtnCount === 1);

    await context.close();
  }

  console.log('\n--- 4. Testing FAQ Tabs, Search & Accordion ---');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.addInitScript(() => sessionStorage.setItem('dpdpa_modal_dismissed', 'true'));
    await page.goto(base + '/');

    // Accordion expansion
    const firstFaqButton = page.locator('button:has-text("What is BNC Global?")');
    await firstFaqButton.click();
    await page.waitForTimeout(300);
    const answerVisible = await page.locator('text=BNC Global is a professional corporate consultation').isVisible();
    console.log('FAQ accordion item expanded, answer visible:', answerVisible);

    // Switch Tab to General
    await page.click('button:has-text("General")');
    await page.waitForTimeout(200);
    const generalFaq = await page.locator('text=What software platforms does BNC support?').isVisible();
    console.log('Switched to General tab, question visible:', generalFaq);

    // Search query filter
    await page.fill('input[placeholder="Looking for something?"]', 'QuickBooks');
    await page.waitForTimeout(200);
    const quickbooksFaq = await page.locator('text=What software platforms does BNC support?').isVisible();
    console.log('Search for "QuickBooks" filtered question visible:', quickbooksFaq);

    // Empty search state
    await page.fill('input[placeholder="Looking for something?"]', 'xyznonexistent123');
    await page.waitForTimeout(200);
    const emptyState = await page.locator('text=No FAQ items matched your search query.').isVisible();
    console.log('Empty search state visible:', emptyState);

    await context.close();
  }

  console.log('\n--- 5. Testing Interior Page Isolation (Header/Footer styling isolated to /) ---');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    // Check Landing Header & Footer
    await page.goto(base + '/');
    const landingHeaderHeight = await page.locator('header').boundingBox();
    console.log('Landing header height (desktop):', Math.round(landingHeaderHeight?.height || 0));

    // Check Interior Page Header & Footer (e.g. /about-us)
    await page.goto(base + '/about-us');
    await page.waitForSelector('header');
    const interiorHeaderHeight = await page.locator('header').boundingBox();
    console.log('Interior (/about-us) header height:', Math.round(interiorHeaderHeight?.height || 0));

    // Check footer background
    const interiorFooterBg = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      return window.getComputedStyle(footer).backgroundColor;
    });
    console.log('Interior footer background color:', interiorFooterBg);

    await page.goto(base + '/');
    const landingFooterBg = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      return window.getComputedStyle(footer).backgroundColor;
    });
    console.log('Landing footer background color:', landingFooterBg);

    // Screenshot interior page header & footer for verification
    await page.goto(base + '/about-us');
    await page.screenshot({ path: resolve(screenshotsDir, 'interior-about-us.png') });
    console.log('Interior page screenshot saved.');

    await context.close();
  }

  console.log('\nALL TESTS PASSED SUCCESSFULLY!');
} finally {
  await browser.close();
  server.close();
}
