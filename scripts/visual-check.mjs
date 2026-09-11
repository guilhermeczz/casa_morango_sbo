import { chromium } from '@playwright/test'

// Local visual review; generated captures stay in the ignored .cache directory.
const browser = await chromium.launch({
  channel: 'chrome',
  args: ['--enable-unsafe-swiftshader'],
})
try {
  for (const width of [320, 390, 768, 1024, 1440]) {
    const page = await browser.newPage({
      viewport: { width, height: width < 600 ? 844 : 960 },
    })
    await page.goto('http://localhost:5173')
    await page.evaluate(() => document.fonts.ready)
    await page.waitForSelector('.real-fruit-photo')
    await page.screenshot({ path: `.cache/review-${width}-hero.png` })
    for (const selector of [
      '#qualidade',
      '#diferenca',
      '#cuidado',
      '#avaliacoes',
      '#localizacao',
    ]) {
      await page.locator(selector).scrollIntoViewIfNeeded()
      await page.waitForTimeout(900)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      )
      if (overflow) {
        console.log(
          await page.locator('main *, footer *').evaluateAll((elements) =>
            elements
              .map((element) => ({
                element: `${element.tagName}.${element.className}`,
                right: element.getBoundingClientRect().right,
              }))
              .filter((element) => element.right > innerWidth + 1)
              .slice(0, 20),
          ),
        )
        throw new Error(`Horizontal overflow at ${width}px in ${selector}`)
      }
      if (width === 390 || width === 1440) {
        await page.screenshot({
          path: `.cache/review-${width}-${selector.slice(1)}.png`,
        })
      }
    }
    console.log(`Visual captures and overflow checks complete: ${width}px`)
    await page.close()
  }
} finally {
  await browser.close()
}
