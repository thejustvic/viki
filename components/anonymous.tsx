'use client'

import {Hero} from 'react-daisyui'
import {EmailLogin} from './login/email-login/email-login'
import {ProviderLogin} from './login/provider-login'
import {TechStackCarousel} from './tech-stack-carousel/tech-stack-carousel'

export const Anonymous = () => {
  return (
    <div className="flex flex-col gap-2">
      <HeroLogin />
      <TechStackCarousel />
    </div>
  )
}

const HeroLogin = () => {
  return (
    <Hero>
      <Hero.Content className="flex-col gap-8 lg:flex-row">
        <EmailLogin />
        <div className="flex flex-col gap-8 lg:flex-row">
          <p className="flex items-center justify-center">OR</p>
          <ProviderLogin />
        </div>
      </Hero.Content>
    </Hero>
  )
}
