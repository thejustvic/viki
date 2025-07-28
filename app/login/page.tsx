import {Load} from '@/components/common/load'
import {Login, TwLogin} from '@/components/login/login'
import {TechStackCarousel} from '@/components/tech-stack-carousel/tech-stack-carousel'
import {Suspense} from 'react'

export default async function Page() {
  return (
    <Suspense fallback={<Load center />}>
      <TwLogin>
        <Login />
        <TechStackCarousel />
      </TwLogin>
    </Suspense>
  )
}
