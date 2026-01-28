import {Login, TwLogin} from '@/components/login/login'
import {TechStackCarousel} from '@/components/tech-stack-carousel/tech-stack-carousel'
import {Suspense} from 'react'
import Loading from './loading'

export default async function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <TwLogin>
        <Login />
        <TechStackCarousel />
      </TwLogin>
    </Suspense>
  )
}
