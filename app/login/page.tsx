import {Load} from '@/components/common/load'
import {Login, TwLogin} from '@/components/login/login'
import {TechStackCarousel} from '@/components/tech-stack-carousel/tech-stack-carousel'
import {getServerSession} from '@/utils/supabase-utils/get-server-session'
import {getServerUser} from '@/utils/supabase-utils/get-server-user'
import {headers} from 'next/headers'
import {redirect} from 'next/navigation'
import {Suspense} from 'react'

export default async function Page() {
  const heads = await headers()
  const pathname = heads.get('x-invoke-path') ?? ''

  const session = await getServerSession()
  const user = await getServerUser()

  if (session && user && pathname !== '/cards') {
    redirect('/cards')
  }

  return (
    <Suspense fallback={<Load center />}>
      <TwLogin>
        <Login />
        <TechStackCarousel />
      </TwLogin>
    </Suspense>
  )
}
