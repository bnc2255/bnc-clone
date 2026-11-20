import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { chromium as playwright } from 'playwright-core';
import { existsSync, mkdirSync, copyFileSync } from 'node:fs';

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
    if (file.startsWith(root + sep) && (await stat(file).catch(() => null))?.isFile()) {
      res.setHeader('Content-Type', mime[extname(file)] || 'text/html');
      return res.end(await readFile(file));
    }
    res.statusCode = 404;
    res.end('Not found');
  } catch (err) {
    res.statusCode = 500;
    res.end('Err: ' + err.message);
  }
});

await new Promise((d) => server.listen(0, '127.0.0.1', d));
const base = 'http://127.0.0.1:' + server.address().port;

const winChrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await playwright.launch({ executablePath: winChrome, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(base + '/');
await page.waitForTimeout(500);

const screenshotsDir = resolve('dist', 'screenshots');
if (!existsSync(screenshotsDir)) mkdirSync(screenshotsDir, { recursive: true });

// 1. DPDPA modal screenshot
const modal = page.locator('[role="dialog"]');
await modal.screenshot({ path: resolve(screenshotsDir, 'section-dpdpa-modal.png') });
console.log('1. Captured section-dpdpa-modal.png');

// Dismiss modal
await page.keyboard.press('Escape');
await page.waitForTimeout(300);

// 2. Landing Header screenshot & metrics
const header = page.locator('header');
await header.screenshot({ path: resolve(screenshotsDir, 'section-landing-header.png') });
const headerBox = await header.boundingBox();
const headerBg = await page.evaluate(() => window.getComputedStyle(document.querySelector('header')).backgroundColor);
const headerBackdrop = await page.evaluate(() => window.getComputedStyle(document.querySelector('header')).backdropFilter);
console.log(`2. Captured section-landing-header.png | Height: ${headerBox.height}px | Background: ${headerBg} | Backdrop: ${headerBackdrop}`);

// 3. Hero section screenshot & H1 font-size
const hero = page.locator('section').first();
await hero.screenshot({ path: resolve(screenshotsDir, 'section-hero.png') });
const h1Size = await page.evaluate(() => window.getComputedStyle(document.querySelector('h1')).fontSize);
console.log(`3. Captured section-hero.png | H1 font size: ${h1Size}`);

// 4. Challenges Carousel
const carousel = page.locator('section[aria-roledescription="carousel"]');
await carousel.screenshot({ path: resolve(screenshotsDir, 'section-challenges-carousel.png') });
const carouselBg = await page.evaluate(() => window.getComputedStyle(document.querySelector('section[aria-roledescription="carousel"]')).backgroundColor);
console.log(`4. Captured section-challenges-carousel.png | Background: ${carouselBg}`);

// 5. What We Do
const whatWeDo = page.locator('section:has-text("What do we do?")');
await whatWeDo.screenshot({ path: resolve(screenshotsDir, 'section-what-we-do.png') });
console.log('5. Captured section-what-we-do.png');

// 6. FAQs with expanded accordion
const firstFaq = page.locator('button:has-text("What is BNC Global?")');
await firstFaq.click();
await page.waitForTimeout(250);
const faq = page.locator('section:has-text("Frequently Asked Questions")');
await faq.screenshot({ path: resolve(screenshotsDir, 'section-faq.png') });
console.log('6. Captured section-faq.png (with expanded accordion)');

// 7. Landing Footer
const footer = page.locator('footer');
await footer.screenshot({ path: resolve(screenshotsDir, 'section-landing-footer.png') });
const footerBg = await page.evaluate(() => window.getComputedStyle(document.querySelector('footer')).backgroundColor);
console.log(`7. Captured section-landing-footer.png | Background: ${footerBg}`);

// Also copy to artifact dir so user can see them
const artifactDir = 'C:\\Users\\rohan\\.gemini\\antigravity-cli\\brain\\4b46b8e0-2167-46de-b753-c2727ed58207';
const files = [
  'section-dpdpa-modal.png',
  'section-landing-header.png',
  'section-hero.png',
  'section-challenges-carousel.png',
  'section-what-we-do.png',
  'section-faq.png',
  'section-landing-footer.png'
];
for (const f of files) {
  copyFileSync(resolve(screenshotsDir, f), resolve(artifactDir, f));
}
console.log('All section screenshots copied to artifact directory.');

await browser.close();
server.close();
