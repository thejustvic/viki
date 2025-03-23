import {Theme} from '@/components/global-provider/types'
import {setCookie} from 'cookies-next'

export const implementTheme = (theme: Theme): void => {
  if (!theme) {
    return
  }
  document.body.setAttribute('data-theme', theme)
  void setCookie('theme', theme)
}
