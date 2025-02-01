import {Theme} from '@/components/global/types'
import {setCookie} from 'cookies-next'

export const implementTheme = (theme: Theme): void => {
  document.body.setAttribute('data-theme', theme)
  void setCookie('theme', theme)
}
