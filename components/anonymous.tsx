'use client'

import {Hero} from 'react-daisyui'
import tw from 'tailwind-styled-components'
import {EmailLogin} from './login/email-login/email-login'
import {ProviderLogin} from './login/provider-login'
import {TechStackCarousel} from './tech-stack-carousel/tech-stack-carousel'

const TwAnonymous = tw.div`
  flex
  flex-col
  gap-2
`

export const Anonymous = () => {
  return (
    <TwAnonymous>
      <HeroLogin />
      <TechStackCarousel />
    </TwAnonymous>
  )
}

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

const HeroLogin = () => {
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
