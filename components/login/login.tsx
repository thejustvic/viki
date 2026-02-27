'use client'

import {Hero} from '@/components/daisyui/hero'
import {LoginProviders} from '@/components/login/login-provider'
import {AuthView} from '../global-provider/types'
import {CaptchaProvider} from './captcha/captcha-provider'
import EmailLoginProvider from './email-login/email-login-provider'

export const Login = ({cookieAuthView}: {cookieAuthView: AuthView}) => {
  return (
    <Hero>
      <Hero.Content>
        <EmailLoginProvider cookieAuthView={cookieAuthView}>
          <CaptchaProvider>
            <LoginProviders />
          </CaptchaProvider>
        </EmailLoginProvider>
      </Hero.Content>
    </Hero>
  )
}
