import assert from 'node:assert/strict'
import { readFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from 'playwright'
const base = process.env.CFO_BASE_URL || 'http://127.0.0.1:5174'
const output = resolve('.playwright-mcp/virtual-cfo')
await mkdir(output, { recursive: true })
const site = JSON.parse(await readFile('src/seo/site.json', 'utf8'))
const validRoutes = new Set(site.routes.map(route => route.path))
const assets = ['india_saudi_corridor', 'cfo_challenges', 'cfo_risks', 'cfo_num20', 'cfo_num21', 'cfo_num22', 'cfo_infographic1', 'cfo_infographic2', 'cfo_infographic3', 'cfo_infographic4', 'cfo_infographic5']
const frameworkIds = ['fundamentals', 'ecosystem', 'execution', 'methodology', 'coverage']
const browser = await chromium.launch({ executablePath: process.env.PRERENDER_CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
const errors = []
try {
  for (const width of [375, 768, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
    page.on('pageerror', e => errors.push(e.message))
    await page.goto(base + '/virtual-cfo')
    await page.locator('.vcfo-page').waitFor()
    await page.evaluate(() => document.fonts.ready)
    assert.equal(await page.locator('h1').count(), 1)
    assert.equal(await page.locator('iframe').count(), 0)
    assert.equal(await page.locator('footer').count(), 1)
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width)
    for (const asset of assets) assert.ok(await page.locator(`.vcfo-page img[src*="${asset}"]`).count(), asset + ' must be retained')
    assert.equal(await page.getByRole('tab').count(), 0)
    let previousBottom = -Infinity
    for (const id of frameworkIds) {
      const panel = page.locator('#cfo-framework-' + id)
      await panel.scrollIntoViewIfNeeded()
      await panel.locator('img').evaluate(image => image.decode())
      const box = await panel.evaluate(e => ({ top: e.getBoundingClientRect().top + scrollY, bottom: e.getBoundingClientRect().bottom + scrollY }))
      assert.ok(box.top >= previousBottom - 1, 'Framework sections appear one after another')
      previousBottom = box.bottom
      const image = await panel.locator('img').evaluate(image => ({ loaded: image.naturalWidth > 0, fit: getComputedStyle(image).objectFit }))
      assert.ok(image.loaded)
      assert.equal(image.fit, 'contain')
      assert.equal(await panel.locator('.vcfo-framework-copy').evaluate(e => getComputedStyle(e).opacity), '1', 'Reduced motion shows content immediately')
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width)
    }
    for (const href of await page.locator('.vcfo-page a[href^="/"]').evaluateAll(links => links.map(link => link.getAttribute('href')))) {
      if (href.startsWith('/assets/') || href.startsWith('/src/assets/')) continue
      assert.ok(validRoutes.has(href), 'Invalid destination: ' + href)
    }
    await page.locator('.vcfo-faq summary').first().click()
    assert.equal(await page.locator('.vcfo-faq details').first().getAttribute('open'), '')
    await page.evaluate(() => scrollTo(0, 0))
    await page.getByRole('link', { name: 'Explore our capabilities', exact: true }).click()
    await page.waitForTimeout(150)
    const top = await page.locator('#cfo-capabilities').evaluate(e => e.getBoundingClientRect().top)
    assert.ok(top >= 76 && top < 130, 'Anchor respects the fixed header: ' + top)
    assert.ok(await page.evaluate(() => scrollY > 100))
    const nested = await page.locator('.vcfo-page').evaluate(root => [...root.querySelectorAll('*')].filter(e => ['auto', 'scroll'].includes(getComputedStyle(e).overflowY) && e.scrollHeight > e.clientHeight + 2).length)
    assert.equal(nested, 0, 'No nested vertical scrolling')
    assert.equal(await page.locator('.ob-shine').evaluate(e => getComputedStyle(e).animationName), 'none')
    await page.evaluate(() => scrollTo(0, 0))
    await page.screenshot({ path: resolve(output, 'hero-' + width + '.png'), animations: 'disabled' })
    await page.locator('.vcfo-framework').screenshot({ path: resolve(output, 'framework-' + width + '.png'), animations: 'disabled' })
    console.log(`PASS ${width}px: original assets, all five stacked framework sections, FAQ, links, anchors, one scroll area, one footer, and reduced motion`)
    await page.close()
  }
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  page.on('pageerror', e => errors.push(e.message))
  await page.goto(base + '/virtual-cfo')
  await page.locator('.vcfo-page').waitFor()
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(900)
  await page.mouse.move(550, 360)
  await page.waitForTimeout(100)
  assert.equal(await page.locator('.vcfo-hero .ob-cell').count(), 0, 'Hero grid stays static on hover')
  assert.equal(await page.locator('.ob-shine').evaluate(e => getComputedStyle(e).animationName), 'ob-shine')
  assert.equal(await page.locator('.vcfo-photo-caption').evaluate(e => getComputedStyle(e, '::after').animationName), 'ob-card-shine')
  await page.locator('.vcfo-reason').first().scrollIntoViewIfNeeded()
  await page.waitForTimeout(700)
  const card = page.locator('.vcfo-reason').first()
  const before = await card.evaluate(e => getComputedStyle(e).transform)
  await card.hover()
  await page.waitForTimeout(600)
  assert.notEqual(await card.evaluate(e => getComputedStyle(e).transform), before, 'Card lifts on hover')
  for (const id of frameworkIds) {
    assert.equal(await page.locator('#cfo-framework-' + id + ' .vcfo-framework-copy').evaluate(e => getComputedStyle(e).opacity), '0', 'Section waits for scrolling before revealing')
  }
  for (const id of frameworkIds) {
    const section = page.locator('#cfo-framework-' + id)
    await section.scrollIntoViewIfNeeded()
    await page.waitForFunction(id => {
      const section = document.getElementById('cfo-framework-' + id)
      return ['.vcfo-framework-copy', '.vcfo-framework-media'].every(selector => Number(getComputedStyle(section.querySelector(selector)).opacity) > 0.99)
    }, id)
  }
  await page.getByRole('link', { name: 'Speak with our team', exact: true }).click()
  await page.waitForURL('**/contact')
  assert.deepEqual(errors, [])
  console.log('PASS static hero grid, headline and card sheen, hover motion, five independent scroll reveals, contact CTA, and no runtime errors')
  await page.close()
} finally { await browser.close() }
