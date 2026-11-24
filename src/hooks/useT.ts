import { ui } from '../i18n/ui'
import { usePlanStore } from '../store/planStore'

export const useT = () => ui[usePlanStore((s) => s.uiLang)]
