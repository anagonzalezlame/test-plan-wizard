import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { usePlanStore } from './store/planStore'

beforeEach(() => {
  localStorage.clear()
  usePlanStore.setState({ ...usePlanStore.getInitialState(), uiLang: 'es', docLang: 'es' }, true)
})

describe('wizard', () => {
  it('blocks navigation until the mandatory start data is filled', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /siguiente/i }))
    expect(await screen.findAllByText('Este campo es obligatorio.')).toHaveLength(2)
    expect(screen.getByRole('heading', { level: 1, name: 'Inicio' })).toBeInTheDocument()

    await user.type(screen.getByLabelText(/nombre del proyecto/i), 'Checkout')
    await user.type(screen.getByLabelText(/autor/i), 'QA Team')
    await user.click(screen.getByRole('button', { name: /siguiente/i }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Contexto y alcance' })).toBeInTheDocument()
    expect(usePlanStore.getState().plan.meta).toMatchObject({ projectName: 'Checkout', author: 'QA Team' })
  })

  it('adds list items to the scope and reflects them in the store', async () => {
    const user = userEvent.setup()
    usePlanStore.getState().patch('meta', { projectName: 'X', author: 'Y' })
    usePlanStore.getState().setStep(1)
    render(<App />)

    const input = screen.getByRole('textbox', { name: /agregar: ítems de prueba/i })
    await user.type(input, 'API de pagos{Enter}')
    expect(usePlanStore.getState().plan.scope.testItems).toEqual(['API de pagos'])
    expect(input).toHaveValue('')
  })

  it('creates a risk from the matrix', async () => {
    const user = userEvent.setup()
    usePlanStore.getState().patch('meta', { projectName: 'X', author: 'Y' })
    usePlanStore.getState().setStep(3)
    render(<App />)

    await user.click(screen.getByRole('button', { name: /probabilidad muy alta, impacto crítico: 0 riesgos/i }))
    const form = screen.getByRole('form', { name: /nuevo riesgo/i })
    await user.type(within(form).getByLabelText(/descripción del riesgo/i), 'Caída de la pasarela')
    await user.click(within(form).getByRole('button', { name: /guardar riesgo/i }))

    expect(usePlanStore.getState().plan.risks).toMatchObject([
      { title: 'Caída de la pasarela', probability: 5, impact: 5, type: 'product' },
    ])
    expect(screen.getByRole('button', { name: /muy alta, impacto crítico: 1 riesgo$/i })).toBeInTheDocument()
  })

  it('shows 100% completeness for the sample plan and switches the document language', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getAllByRole('button', { name: /cargar ejemplo/i })[0])
    usePlanStore.getState().setStep(7)

    expect(await screen.findByRole('progressbar', { name: /completitud/i })).toHaveAttribute('aria-valuenow', '100')
    const doc = () => document.getElementById('plan-document')!
    expect(within(doc()).getByRole('heading', { name: /registro de riesgos/i })).toBeInTheDocument()

    const docLang = screen.getByRole('radiogroup', { name: /idioma del documento/i })
    await user.click(within(docLang).getByRole('radio', { name: 'English' }))
    expect(within(doc()).getByRole('heading', { name: /risk register/i })).toBeInTheDocument()
  })
})
