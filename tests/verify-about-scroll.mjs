// Run against a dev server, or set ABOUT_BASE_URL to a production preview.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const base = process.env.ABOUT_BASE_URL || 'http://127.0.0.1:5174';
const browser = await chromium.launch({ executablePath: process.env.PRERENDER_CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--enable-unsafe-swiftshader'] });
try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 375, height: 812 }]) {
    const page = await browser.newPage({ viewport });
    await page.goto(base + '/about/founders');
    const iframe = page.locator('iframe[title="About the Founders"]');
    const frame = await iframe.elementHandle().then(e => e.contentFrame());
    await frame.waitForFunction(() => window.__lenis && window.ScrollTrigger);
    const parent = await page.evaluate(() => ({ scrollHeight: document.documentElement.scrollHeight, viewport: innerHeight, footers: document.querySelectorAll('footer').length, frame: document.querySelector('iframe').getBoundingClientRect().toJSON() }));
    assert.ok(parent.scrollHeight <= parent.viewport, JSON.stringify(parent));
    assert.equal(parent.footers, 0, 'No second footer outside the imported page');
    assert.equal(parent.frame.y, 0);
    assert.equal(parent.frame.height, viewport.height);
    assert.equal(await frame.locator('footer').count(), 1);
    await page.mouse.move(viewport.width / 2, viewport.height / 2);
    await page.mouse.wheel(0, 650);
    await page.waitForTimeout(900);
    assert.ok(await frame.evaluate(() => scrollY > 100), 'Wheel scrolls the imported page');
    assert.equal(await page.evaluate(() => scrollY), 0, 'Outer page stays still');
    await frame.evaluate(() => { window.__lenis.scrollTo(document.documentElement.scrollHeight, { immediate: true }); ScrollTrigger.update(); });
    await page.waitForTimeout(1500);
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(500);
    assert.equal(await page.evaluate(() => scrollY), 0, 'No outer scroll or extra footer at the bottom');
    const footerHeight = await frame.locator('footer').evaluate(e => e.getBoundingClientRect().height);
    assert.ok(footerHeight < viewport.height / 2, 'Imported footer remains compact: ' + footerHeight);
    await frame.locator('#obNext').click();
    await page.waitForURL('**/about/company');
    await page.locator('.ob').waitFor();
    assert.equal(await page.locator('iframe').count(), 0);
    assert.equal(await page.locator('footer').count(), 1);
    await page.mouse.move(viewport.width / 2, viewport.height / 2);
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(500);
    assert.ok(await page.evaluate(() => scrollY > 100), 'Company page uses normal document scrolling');
    assert.ok(await page.locator('footer').evaluate(e => e.getBoundingClientRect().height) < viewport.height / 2, 'Company footer remains compact');
    console.log(`PASS ${viewport.width}x${viewport.height}: one scroll area, one compact footer, bottom boundary, and company navigation`);
    await page.close();
  }
} finally { await browser.close(); }
