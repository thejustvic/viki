import {AuthView} from '@/components/global-provider/types'
import {Login, TwLogin} from '@/components/login/login'
import {TechStackCarousel} from '@/components/tech-stack-carousel/tech-stack-carousel'
import {cookies} from 'next/headers'
import {Suspense} from 'react'
import Loading from './loading'

export default async function Page() {
  const cookieStore = await cookies()
  const cookieAuthView = cookieStore.get('auth-view')?.value ?? 'register'

  return (
    <Suspense fallback={<Loading />}>
      <TwLogin>
        <Login cookieAuthView={cookieAuthView as AuthView} />
        <TechStackCarousel />
      </TwLogin>
    </Suspense>
  )
}
