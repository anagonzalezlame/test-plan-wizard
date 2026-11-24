// Regenerates the README screenshots. Start the app first (npm run dev or npm run preview).
// Usage: BASE_URL=http://localhost:5173 npm run screenshots
import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:5173'
const OUT = 'docs/screenshots'

const browser = await chromium.launch()
await mkdir(OUT, { recursive: true })

async function open({ viewport, colorScheme = 'light', locale = 'es-UY' }) {
  const context = await browser.newContext({ viewport, colorScheme, locale, deviceScaleFactor: 1.5 })
  const page = await context.newPage()
  await page.goto(BASE_URL)
  await page.getByRole('button', { name: /Cargar ejemplo|Load example/ }).first().click()
  return { context, page }
}

const step = (page, name) => page.getByRole('navigation').getByRole('button', { name }).click()

// 1. Risk step with live preview (desktop, light)
{
  const { context, page } = await open({ viewport: { width: 1440, height: 900 } })
  await step(page, /Riesgos/)
  await page.getByRole('heading', { level: 1, name: 'Riesgos' }).waitFor()
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${OUT}/risks.png` })
  await context.close()
}

// 2. Review + export (desktop, dark, English UI)
{
  const { context, page } = await open({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark', locale: 'en-US' })
  await step(page, /Review/)
  await page.getByRole('heading', { level: 1, name: 'Review' }).waitFor()
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${OUT}/review-dark.png` })
  await context.close()
}

// 3. Strategy step on a phone
{
  const { context, page } = await open({ viewport: { width: 390, height: 844 } })
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: /^Siguiente/ }).click()
  await page.getByRole('heading', { level: 1, name: 'Estrategia' }).waitFor()
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${OUT}/mobile.png` })
  await context.close()
}

await browser.close()
console.log(`Screenshots saved in ${OUT}/`)
