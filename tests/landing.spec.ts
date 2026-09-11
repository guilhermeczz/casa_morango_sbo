import { test, expect } from '@playwright/test'

test('esteira inicia sozinha, pausa no hover e mantém ciclo contínuo', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  const ribbon = page.locator('.brand-ribbon')
  await ribbon.scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)
  const track = page.locator('.ribbon-track')
  const x = () =>
    track.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41)
  const before = await x()
  await page.waitForTimeout(700)
  expect((await x()) - before).toBeGreaterThan(20)
  await ribbon.hover()
  await page.waitForTimeout(100)
  const hovered = await x()
  await page.waitForTimeout(500)
  expect(await x()).toBeCloseTo(hovered, 1)
  await page.mouse.move(0, 0)
  await page.waitForTimeout(500)
  expect((await x()) - hovered).toBeGreaterThan(10)
  await expect(ribbon.getByRole('button')).toHaveCount(0)
  await ribbon.focus()
  await page.waitForTimeout(100)
  const stopped = await x()
  await page.waitForTimeout(300)
  expect(await x()).toBeCloseTo(stopped, 1)
  await ribbon.evaluate((element) => (element as HTMLElement).blur())
  await page.waitForTimeout(300)
  expect(await x()).toBeGreaterThan(stopped)

  const seam = await track.evaluate((el) => {
    const animation = el.getAnimations()[0]
    animation.pause()
    const duration = Number(animation.effect!.getTiming().duration)
    const groups = el.querySelectorAll('.ribbon-group')
    animation.currentTime = duration - 1
    const last = groups[0].firstElementChild!.getBoundingClientRect().x
    animation.currentTime = duration + 1
    const first = groups[1].firstElementChild!.getBoundingClientRect().x
    return Math.abs(first - last)
  })
  expect(seam).toBeLessThan(1)
  const order = await page
    .locator('main > *')
    .evaluateAll((elements) => elements.map((el) => el.id || el.className))
  expect(order.slice(0, 3)).toEqual(['inicio', 'brand-ribbon', 'avaliacoes'])
})

test('conteúdo, conversão, comparação e navegação', async ({
  page,
}, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  await page.waitForSelector('.real-fruit-photo', { state: 'attached' })
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.locator('.review')).toHaveCount(3)
  await expect(page.locator('.benefit')).toHaveCount(7)
  await expect(page.locator('.brand-ribbon')).toHaveCount(1)
  const links = await page
    .locator('a[href*="wa.me/"]')
    .evaluateAll((elements) =>
      elements.map((element) => (element as HTMLAnchorElement).href),
    )
  expect(links.length).toBeGreaterThanOrEqual(5)
  expect(new Set(links).size).toBe(1)
  expect(decodeURIComponent(links[0])).toContain(
    '5519994474588?text=Olá! Vim pelo site',
  )
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true)
  await expect(page.locator('.mobile-order')).toBeHidden()
  await page.screenshot({ path: `.cache/${testInfo.project.name}-hero.png` })

  await page.locator('.comparison-showcase').scrollIntoViewIfNeeded()
  await expect(page.locator('.prime-choice')).toContainText('SELEÇÃO PRIME')
  await expect(page.locator('.prime-choice li')).toHaveCount(3)
  await expect(page.locator('.variable-choice')).toContainText(
    'SELEÇÃO VARIÁVEL',
  )
  await page.screenshot({
    path: `.cache/${testInfo.project.name}-comparison.png`,
  })

  for (const section of ['#cuidado', '#avaliacoes', '#localizacao']) {
    await page.locator(section).scrollIntoViewIfNeeded()
    await expect(page.locator(`${section} h2`)).toBeVisible()
  }
  await expect(page.locator('.final-copy')).toHaveCSS('opacity', '1')
  await expect(
    page.getByTitle('Localização da Casa do Morango Prime'),
  ).toBeVisible()
  await page.waitForTimeout(800)
  await page.screenshot({ path: `.cache/${testInfo.project.name}-final.png` })
  if (testInfo.project.name === 'mobile') {
    await expect(page.locator('.mobile-order')).toBeVisible()
    await page.getByRole('button', { name: 'Abrir menu' }).click()
    await expect(
      page.getByRole('navigation', { name: 'Navegação para celular' }),
    ).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(
      page.getByRole('navigation', { name: 'Navegação para celular' }),
    ).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeFocused()
  }
  expect(errors).toEqual([])
})

test('imagem Prime e animação automática', async ({ page }) => {
  await page.goto('/')
  const fruit = page.locator('.hero-art .real-fruit-photo')
  await expect(fruit).toBeVisible()
  await expect(page.locator('canvas')).toHaveCount(0)
  await expect(page.locator('.fruit-interaction')).toHaveCount(0)
  const before = await fruit.evaluate(
    (element) => getComputedStyle(element).transform,
  )
  await page.waitForTimeout(1400)
  expect(
    await fruit.evaluate((element) => getComputedStyle(element).transform),
  ).not.toBe(before)
  await page.locator('.story-fruit-space').scrollIntoViewIfNeeded()
  await expect(
    page.locator('.story-fruit-space .real-fruit-photo'),
  ).toBeVisible()
})

test('movimento reduzido mantém conteúdo e dispensa animações', async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const modelRequests: string[] = []
  page.on('request', (request) => {
    if (request.url().endsWith('.glb')) modelRequests.push(request.url())
  })
  await page.goto('/')
  await expect(page.locator('.hero-art .real-fruit-photo')).toBeVisible()
  await expect(page.locator('canvas')).toHaveCount(0)
  await page.locator('#avaliacoes').scrollIntoViewIfNeeded()
  await expect(page.locator('.review').first()).toBeVisible()
  expect(modelRequests).toEqual([])
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true)
  await page.screenshot({
    path: `.cache/${testInfo.project.name}-reduced.png`,
  })
})

test('falha na imagem preserva conteúdo e conversão', async ({ page }) => {
  await page.route('**/hero-inspiration.webp', (route) => route.abort())
  await page.goto('/')
  await expect(page.locator('.hero-copy a.button')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
