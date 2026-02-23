'use client'

import {Hero} from '@/components/daisyui/hero'
import EmailLoginProvider from '@/components/login/email-login/email-login-provider'
import {LoginProviders} from '@/components/login/login-provider'
import tw from 'tailwind-styled-components'
import {AuthView} from '../global-provider/types'
import {EmailLoginCard} from './email-login/email-login-card'

export const TwLogin = tw.div`
  flex
  flex-col
  gap-4
`

const TwHeroContent = tw(Hero.Content)`
  flex-col 
  gap-8 
  lg:flex-row
`

const TwProviderLogin = tw.div`
  flex
  flex-col
  gap-8
  lg:flex-row
`

const TwOr = tw.p`
  flex 
  items-center 
  justify-center
`

export const Login = ({cookieAuthView}: {cookieAuthView: AuthView}) => {
  return (
    <Hero>
      <TwHeroContent>
        <EmailLoginProvider cookieAuthView={cookieAuthView}>
          <EmailLoginCard />
        </EmailLoginProvider>
        <TwProviderLogin>
          <TwOr>OR</TwOr>
          <LoginProviders />
        </TwProviderLogin>
      </TwHeroContent>
    </Hero>
  )
}
