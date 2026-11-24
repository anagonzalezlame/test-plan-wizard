import { expect, test, type Page } from '@playwright/test'
import { readFile } from 'node:fs/promises'

async function loadSampleAndOpenReview(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Cargar ejemplo' }).first().click()
  await page.getByRole('navigation').getByRole('button', { name: /Revisión/ }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Revisión' })).toBeVisible()
}

test.describe('desktop', () => {
  test('requires the mandatory start data before moving on', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Siguiente/ }).click()
    await expect(page.getByText('Este campo es obligatorio.')).toHaveCount(2)
    await expect(page.getByLabel('Nombre del proyecto')).toBeFocused()

    await page.getByLabel('Nombre del proyecto').fill('Portal de clientes')
    await page.getByLabel('Autor/a').fill('Equipo QA')
    await page.getByRole('button', { name: /Siguiente/ }).click()
    await expect(page.getByRole('heading', { level: 1, name: 'Contexto y alcance' })).toBeVisible()
  })

  test('keeps the plan after reloading the page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Cargar ejemplo' }).first().click()
    await page.reload()
    await expect(page.getByLabel('Nombre del proyecto')).toHaveValue('Nuevo checkout de la tienda online')
  })

  test('exports the sample plan as Markdown (clipboard and file) in both languages', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await loadSampleAndOpenReview(page)
    await expect(page.getByRole('progressbar', { name: 'Completitud' })).toHaveAttribute('aria-valuenow', '100')

    await page.getByRole('button', { name: 'Copiar Markdown' }).click()
    await expect(page.getByRole('status')).toHaveText('Copiado al portapapeles en formato Markdown.')
    // Windows' clipboard turns \n into \r\n; normalise before comparing with the file.
    const clipboard = (await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, '\n')
    expect(clipboard).toMatch(/^# Plan de pruebas: Nuevo checkout de la tienda online/)
    expect(clipboard).toContain('## 4. Registro de riesgos')

    const [es] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Descargar .md' }).click(),
    ])
    expect(es.suggestedFilename()).toBe('tp-checkout-001-es.md')
    expect(await readFile((await es.path())!, 'utf8')).toBe(clipboard)

    await page
      .getByRole('radiogroup', { name: 'Idioma del documento' })
      .getByRole('radio', { name: 'English' })
      .click()
    const [en] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Descargar .md' }).click(),
    ])
    expect(en.suggestedFilename()).toBe('tp-checkout-001-en.md')
    const english = await readFile((await en.path())!, 'utf8')
    expect(english).toContain('## 4. Risk register')
    expect(english).toContain('| R-01 | Cobros duplicados') // user content is never translated
  })

  test('prints only the document, in light colours, and produces a PDF', async ({ page }, testInfo) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await loadSampleAndOpenReview(page)
    await page.emulateMedia({ media: 'print', colorScheme: 'dark' })

    await expect(page.getByRole('banner')).toBeHidden()
    await expect(page.locator('#plan-document')).toBeHidden()
    const printed = page.locator('#plan-document-print')
    await expect(printed).toBeVisible()
    await expect(printed).toHaveCSS('background-color', 'rgb(255, 255, 255)')

    const pdf = await page.pdf({ path: testInfo.outputPath('test-plan.pdf'), format: 'A4' })
    expect(pdf.byteLength).toBeGreaterThan(20_000)
  })
})

test.describe('mobile', () => {
  test.use({ viewport: { width: 375, height: 740 }, hasTouch: true, isMobile: true })

  test('no step overflows horizontally', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Cargar ejemplo' }).first().click()

    for (let step = 1; step <= 8; step++) {
      await expect(page.getByText(`Paso ${step} de 8`)).toBeVisible()
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow, `step ${step}`).toBe(0)
      if (step < 8) await page.getByRole('button', { name: /^Siguiente/ }).click()
    }
  })
})
