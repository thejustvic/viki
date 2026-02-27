import {AuthView} from '@/components/global-provider/types'
import {Login} from '@/components/login/login'
import {TechStackCarousel} from '@/components/tech-stack-carousel/tech-stack-carousel'
import {cookies} from 'next/headers'
import {Suspense} from 'react'
import Loading from './loading'

export default async function Page() {
  const cookieStore = await cookies()
  const cookieAuthView = cookieStore.get('auth-view')?.value ?? 'register'

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col gap-4">
        <Login cookieAuthView={cookieAuthView as AuthView} />
        <TechStackCarousel />
      </div>
    </Suspense>
  )
}
