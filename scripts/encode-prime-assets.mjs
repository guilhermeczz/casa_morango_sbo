import { chromium } from '@playwright/test'
import { readFile, writeFile } from 'node:fs/promises'

// Format conversion only: preserve the generated pixels and transparent alpha.
const browser = await chromium.launch({ channel: 'chrome' })
try {
  const page = await browser.newPage()
  for (const name of process.argv.slice(2).length
    ? process.argv.slice(2)
    : ['strawberry-prime', 'hero-inspiration']) {
    const source = await readFile(`.cache/${name}.png`)
    const encoded = await page.evaluate(
      async (data) => {
        const image = new Image()
        image.src = data
        await image.decode()
        const canvas = document.createElement('canvas')
        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight
        canvas.getContext('2d').drawImage(image, 0, 0)
        return {
          url: canvas.toDataURL('image/webp', 0.91),
          width: canvas.width,
          height: canvas.height,
          cornerAlpha: canvas.getContext('2d').getImageData(0, 0, 1, 1).data[3],
        }
      },
      `data:image/png;base64,${source.toString('base64')}`,
    )
    const bytes = Buffer.from(encoded.url.split(',')[1], 'base64')
    await writeFile(`public/images/${name}.webp`, bytes)
    console.log(
      `${name}: ${encoded.width}x${encoded.height}, ${bytes.length} bytes, corner alpha ${encoded.cornerAlpha}`,
    )
  }
} finally {
  await browser.close()
}
