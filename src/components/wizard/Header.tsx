import { FileText, Moon, RotateCcw, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useT } from '../../hooks/useT'
import { usePlanStore } from '../../store/planStore'
import { Button, IconButton } from '../ui/Button'
import { LangSwitch } from '../ui/LangSwitch'

export function Header() {
  const t = useT()
  const uiLang = usePlanStore((s) => s.uiLang)
  const theme = usePlanStore((s) => s.theme)
  const { setUiLang, toggleTheme, loadSample, reset } = usePlanStore.getState()
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    if (!confirmReset) return
    const timer = setTimeout(() => setConfirmReset(false), 3500)
    return () => clearTimeout(timer)
  }, [confirmReset])

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-neutral-50/85 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/85 print:hidden">
      <div className="mx-auto flex h-14 max-w-[96rem] items-center gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900">
            <FileText aria-hidden="true" className="size-4" />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold">{t.appName}</p>
            <p className="hidden truncate font-mono text-[0.6875rem] text-neutral-500 sm:block dark:text-neutral-400">{t.appTagline}</p>
          </div>
        </div>

        <span className="hidden sm:block">
          <Button size="sm" variant="ghost" onClick={loadSample}>
            {t.loadSample}
          </Button>
        </span>
        <Button
          size="sm"
          variant={confirmReset ? 'primary' : 'ghost'}
          aria-label={confirmReset ? t.resetConfirm : t.reset}
          onClick={() => {
            if (confirmReset) {
              reset()
              setConfirmReset(false)
            } else setConfirmReset(true)
          }}
        >
          <RotateCcw aria-hidden="true" className="size-3.5" />
          <span className="hidden md:inline">{confirmReset ? t.resetConfirm : t.reset}</span>
        </Button>
        <LangSwitch value={uiLang} onChange={setUiLang} label={t.uiLang} />
        <IconButton label={theme === 'dark' ? t.themeLight : t.themeDark} onClick={toggleTheme}>
          {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </IconButton>
      </div>
    </header>
  )
}
