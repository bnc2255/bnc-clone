// Compare against the running BNC_Partners app, with both servers using the same viewport.
// ABOUT_BASE_URL=http://127.0.0.1:5174 PARTNER_REFERENCE_URL=http://127.0.0.1:5175 node tests/verify-about-parity.mjs
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile, readdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { chromium } from 'playwright';

const local = process.env.ABOUT_BASE_URL || 'http://127.0.0.1:5174';
const reference = process.env.PARTNER_REFERENCE_URL || 'http://127.0.0.1:5175';
const partnerRoot = resolve(process.env.PARTNER_SOURCE_DIR || '../BNC_Partners');
const output = resolve('.playwright-mcp/about-parity');
await mkdir(output, { recursive: true });
const report = { source: partnerRoot, reference, local, checks: [] };
const checked = (message) => { console.log('PASS:', message); report.checks.push(message); };

async function sameFile(source, destination) {
  assert.deepEqual(await readFile(destination), await readFile(source), destination + ' must equal partner source');
}
for (const folder of ['assets', 'vendor']) {
  for (const name of await readdir(join(partnerRoot, 'public/about-founders', folder))) {
    await sameFile(join(partnerRoot, 'public/about-founders', folder, name), resolve('public/about-founders', folder, name));
  }
}
await sameFile(join(partnerRoot, 'public/about-founders/index.html'), resolve('public/about-founders/index.html'));
await sameFile(join(partnerRoot, 'src/pages/about/onboarding-styles.css'), resolve('src/pages/about/onboarding-styles.css'));
checked('Complete founders HTML, eight images, five vendor scripts, and company stylesheet match source bytes');
for (const name of ['summit-goyal.png', 'gurvinder-singh.png', 'bnc-logo-white.png']) {
  await sameFile(join(partnerRoot, 'src/pages/about/company/assets', name), resolve('public/about-company/assets', name));
}
for (const name of ['AboutCompany.jsx', 'content.js', ...(await readdir(join(partnerRoot, 'src/pages/about/company/components'))).map(n => 'components/' + n)]) {
  const source = (await readFile(join(partnerRoot, 'src/pages/about/company', name), 'utf8'))
    .replace("import summitPhoto from './assets/summit-goyal.png';", "const summitPhoto = '/about-company/assets/summit-goyal.png';")
    .replace("import gurvinderPhoto from './assets/gurvinder-singh.png';", "const gurvinderPhoto = '/about-company/assets/gurvinder-singh.png';")
    .replace("import logoWhite from '../assets/bnc-logo-white.png';", "const logoWhite = '/about-company/assets/bnc-logo-white.png';");
  assert.equal((await readFile(resolve('src/pages/about/company', name), 'utf8')).replace(/\r\n/g, '\n'), source.replace(/\r\n/g, '\n'), name + ' must preserve the full source implementation');
}
checked('All company sections, content, components, and three images match source; only public asset paths change');


const properties = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'color', 'backgroundColor', 'backgroundImage', 'borderRadius', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginBottom', 'gap', 'display', 'gridTemplateColumns', 'boxShadow', 'animationName', 'animationDuration', 'animationTimingFunction'];
async function snapshot(root) {
  return root.evaluate((root, properties) => {
    const base = root.getBoundingClientRect();
    const round = n => Math.round(n * 1000) / 1000;
    return [root, ...root.querySelectorAll('*')].filter(e => !['STYLE', 'SCRIPT', 'I'].includes(e.tagName)).map(e => {
      const s = getComputedStyle(e), r = e.getBoundingClientRect();
      return { tag: e.tagName, text: e.children.length ? '' : e.textContent, class: e.getAttribute('class'),
        width: round(r.width), height: round(r.height), x: round(r.x - base.x), y: round(r.y - base.y),
        style: Object.fromEntries(properties.map(p => [p, s[p]])) };
    });
  }, properties);
}
function compare(a, b, label) {
  const differences = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) differences.push({ index: i, reference: a[i], local: b[i] });
  }
  if (differences.length) return writeFile(join(output, label + '-differences.json'), JSON.stringify(differences, null, 2)).then(() => assert.fail(label + ': ' + differences.length + ' elements differ'));
  checked(label + ': all ' + a.length + ' elements have identical text, geometry, styles, and CSS animation settings');
}

const browser = await chromium.launch({ executablePath: process.env.PRERENDER_CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--enable-unsafe-swiftshader'] });
const errors = [];
async function pageAt(url, width, motion = 'reduce') {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: motion });
  page.on('pageerror', e => errors.push(url + ': ' + e.message));
  // Dismiss the source site's unrelated timed signup overlay without disabling page animations.
  await page.addInitScript(() => { window.__PRERENDER__ = true; });
  await page.goto(url, { waitUntil: 'load' });
  return page;
}
async function company(url, width, motion) {
  const page = await pageAt(url + '/about/company', width, motion);
  await page.locator('.ob').waitFor();
  await page.evaluate(() => document.fonts.ready);
  return page;
}
async function founders(url, path, width, motion) {
  const page = await pageAt(url + path, width, motion);
  const frame = await page.locator('iframe[title="About the Founders"]').elementHandle().then(e => e.contentFrame());
  await frame.locator('#hero').waitFor();
  await frame.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1000);
  return { page, frame };
}
try {
  for (const width of [1440, 768, 375]) {
    const pages = await Promise.all([company(reference, width), company(local, width)]);
    await compare(...await Promise.all(pages.map(p => snapshot(p.locator('.ob')))), 'company-' + width);
    for (const [i, p] of pages.entries()) {
      assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'company overflow');
      assert.equal(await p.locator('.ob img').evaluateAll(images => images.filter(i => i.complete && !i.naturalWidth).length), 0);
      await p.locator('.ob').screenshot({ path: join(output, `company-${width}-${i ? 'local' : 'reference'}.png`), animations: 'disabled' });
    }
    if (width === 1440) {
      for (const tab of ['Finance & CFO', 'Audit & Risk', 'Privacy & Cyber', 'ESG & Climate', 'Technology', 'Hiring & Growth']) {
        for (const p of pages) { await p.getByRole('tab', { name: tab, exact: true }).click(); await p.mouse.move(0, 0); }
        await pages[0].waitForTimeout(600);
        await compare(...await Promise.all(pages.map(p => snapshot(p.locator('#what-we-do')))), 'company-tab-' + tab.replace(/\W/g, '-'));
      }
    }
    await Promise.all(pages.map(p => p.close()));
  }
  for (const width of [1440, 375]) {
    const pair = await Promise.all([founders(reference, '/about', width), founders(local, '/about/founders', width)]);
    const snapshots = await Promise.all(pair.map(({ frame }) => snapshot(frame.locator('main'))));
    await compare(...snapshots, 'founders-' + width);
    for (const [i, { page, frame }] of pair.entries()) {
      assert.equal(await frame.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'founders overflow');
      assert.equal(await frame.locator('img').evaluateAll(images => images.filter(i => i.complete && !i.naturalWidth).length), 0);
      await frame.locator('#hero').screenshot({ path: join(output, `founders-${width}-${i ? 'local' : 'reference'}.png`), animations: 'disabled' });
      await page.close();
    }
  }
  const animations = [];
  for (const [url, path] of [[reference, '/about'], [local, '/about/founders']]) {
    const { page, frame } = await founders(url, path, 1440, 'no-preference');
    await frame.waitForFunction(() => window.__lenis && window.ScrollTrigger);
    const state = await frame.evaluate(() => ({ sections: [...document.querySelectorAll('main>section')].map(s => s.id), triggers: ScrollTrigger.getAll().length, gsap: gsap.version, three: THREE.REVISION, lenis: !!window.__lenis, canvases: [...document.querySelectorAll('canvas')].map(c => [c.width, c.height]) }));
    animations.push(state);
    const headline = await frame.locator('.fw').allTextContents();
    await page.waitForTimeout(5000);
    assert.notDeepEqual(await frame.locator('.fw').allTextContents(), headline, 'headline must rotate');
    await frame.evaluate(() => { window.__lenis.scrollTo('#summit', { immediate: true }); ScrollTrigger.update(); });
    await page.waitForTimeout(1900);
    assert.equal(await frame.locator('#summit .portrait').evaluate(e => getComputedStyle(e).clipPath), 'inset(0% round 18px)');
    await frame.evaluate(() => { window.__lenis.scrollTo('#partners', { immediate: true }); ScrollTrigger.update(); });
    await page.waitForTimeout(1500);
    await frame.getByRole('tab', { name: 'Technology', exact: true }).click();
    assert.equal(await frame.locator('#tab-technology').getAttribute('aria-selected'), 'true');
    await frame.getByRole('tab', { name: 'Technology', exact: true }).press('ArrowRight');
    assert.equal(await frame.locator('#tab-sales').getAttribute('aria-selected'), 'true');
    await frame.evaluate(() => { window.__lenis.scrollTo('#contact', { immediate: true }); ScrollTrigger.update(); });
    await page.waitForTimeout(1500);
    await frame.locator('#obNext').click();
    await page.waitForURL('**/about/company');
    await page.close();
  }
  assert.deepEqual(animations[0], animations[1]);
  checked('Founders: all 11 sections, 108 scroll triggers, GSAP/Three/Lenis, canvas sizes, rotating headline, portrait reveal, mouse/keyboard partner tabs, and Continue navigation verified against partner');
  report.animations = animations[1];
  for (const url of [reference, local]) {
    const page = await company(url, 1440, 'no-preference');
    await page.waitForTimeout(1200);
    await page.mouse.move(650, 400);
    await page.waitForTimeout(100);
    assert.ok(await page.locator('.ob-cell.is-on').count(), 'pointer grid must illuminate');
    assert.equal(await page.locator('.ob-arrow-bob').evaluate(e => getComputedStyle(e).animationName), 'ob-arrow-bob');
    await page.getByRole('button', { name: 'Begin', exact: true }).click();
    await page.waitForTimeout(1200);
    assert.ok(await page.evaluate(() => scrollY > 700), 'Begin must scroll to overview');
    await page.close();
  }
  checked('Company: live pointer grid, arrow animation, and Begin smooth scroll verified on both sites');
  assert.deepEqual(errors, []);
  checked('No browser runtime errors');
  await writeFile(join(output, 'report.json'), JSON.stringify(report, null, 2));
} finally { await browser.close(); }
