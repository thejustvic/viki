'use client'

import {Hero} from '@/components/daisyui/hero'
import {EmailLogin} from '@/components/login/email-login/email-login'
import {ProviderLogin} from '@/components/login/provider-login'
import tw from 'tailwind-styled-components'

export const TwAnonymous = tw.div`
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

export const HeroLogin = () => {
  return (
    <Hero>
      <TwHeroContent>
        <EmailLogin />
        <TwProviderLogin>
          <TwOr>OR</TwOr>
          <ProviderLogin />
        </TwProviderLogin>
      </TwHeroContent>
    </Hero>
  )
}
