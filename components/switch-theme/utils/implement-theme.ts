import type {GlobalStore} from '@/common/global/global-store'
import {setCookie} from 'cookies-next'

export const implementTheme = (store: GlobalStore, themeRes: string): void => {
  store.updateTheme(themeRes)
  document.body.setAttribute('data-theme', themeRes)
  setCookie('theme', themeRes)
}
