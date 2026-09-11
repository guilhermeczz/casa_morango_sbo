import { test, expect } from '@playwright/test'

test('conteúdo, conversão, comparação e navegação', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  await page.waitForSelector('.scene-ready canvas', { state: 'attached' })
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.locator('.review')).toHaveCount(3)
  const links = await page.locator('a[href*="wa.me/"]').evaluateAll((elements) => elements.map((element) => (element as HTMLAnchorElement).href))
  expect(links.length).toBeGreaterThanOrEqual(5)
  expect(new Set(links).size).toBe(1)
  expect(decodeURIComponent(links[0])).toContain('5519994474588?text=Olá! Vim pelo site')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await expect(page.locator('.mobile-order')).toBeHidden()
  await page.screenshot({ path: `.cache/${testInfo.project.name}-hero.png` })

  const slider = page.getByRole('slider')
  await slider.scrollIntoViewIfNeeded()
  await slider.fill('75')
  await expect(slider).toHaveValue('75')
  await expect(page.locator('.prime-side')).toHaveAttribute('style', /25%/)
  await expect(page.locator('.comparison-visual')).toHaveCSS('opacity', '1')
  await page.screenshot({ path: `.cache/${testInfo.project.name}-comparison.png` })

  for (const section of ['#cuidado', '#avaliacoes', '#localizacao']) {
    await page.locator(section).scrollIntoViewIfNeeded()
    await expect(page.locator(`${section} h2`)).toBeVisible()
  }
  await expect(page.locator('.final-copy')).toHaveCSS('opacity', '1')
  await page.waitForTimeout(800)
  await page.screenshot({ path: `.cache/${testInfo.project.name}-final.png` })
  if (testInfo.project.name === 'mobile') {
    await expect(page.locator('.mobile-order')).toBeVisible()
    await page.getByRole('button', { name: 'Abrir menu' }).click()
    await expect(page.getByRole('navigation', { name: 'Navegação para celular' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('navigation', { name: 'Navegação para celular' })).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeFocused()
  }
  expect(errors).toEqual([])
})

test('cena única, resposta ao toque e deslocamento por scroll', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('.scene-ready canvas', { state: 'attached' })
  await expect(page.locator('canvas')).toHaveCount(1)
  await page.locator('.fruit-interaction').scrollIntoViewIfNeeded()
  const before = await page.locator('canvas').screenshot()
  await page.getByRole('button', { name: 'Girar o morango 3D e descobrir um detalhe' }).click()
  await expect(page.locator('.fruit-caption')).toContainText('Frescor em cada detalhe.')
  await page.waitForTimeout(1300)
  expect((await page.locator('canvas').screenshot()).equals(before)).toBe(false)
  await page.locator('.story-fruit-space').scrollIntoViewIfNeeded()
  await page.waitForTimeout(900)
  await expect(page.locator('canvas')).toHaveCount(1)
})

test('movimento reduzido mantém conteúdo e dispensa WebGL', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const modelRequests: string[] = []
  page.on('request', (request) => { if (request.url().endsWith('.glb')) modelRequests.push(request.url()) })
  await page.goto('/')
  await expect(page.locator('.fallback-fruit')).toBeVisible()
  await expect(page.locator('canvas')).toHaveCount(0)
  await page.locator('#avaliacoes').scrollIntoViewIfNeeded()
  await expect(page.locator('.review').first()).toBeVisible()
  expect(modelRequests).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: `.cache/${testInfo.project.name}-reduced.png` })
})

test('falha no modelo preserva página e fallback', async ({ page }) => {
  await page.route('**/*.glb', (route) => route.abort())
  await page.goto('/')
  await expect(page.locator('.fallback-fruit')).toBeVisible()
  await expect(page.locator('.hero-copy a.button')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
