import {Load} from '@/components/common/load'
import {Login, TwLogin} from '@/components/login/login'
import {TechStackCarousel} from '@/components/tech-stack-carousel/tech-stack-carousel'
import {ClientRedirect} from '@/hooks/use-client-redirect'
import {getServerUser} from '@/utils/supabase-utils/get-server-user'
import {headers} from 'next/headers'
import {Suspense} from 'react'

export default async function Page() {
  const heads = await headers()
  const pathname = heads.get('x-invoke-path') ?? ''

  const user = await getServerUser()

  if (user && pathname !== '/posts') {
    return <ClientRedirect href="/posts" />
  } else {
    return (
      <Suspense fallback={<Load center />}>
        <TwLogin>
          <Login />
          <TechStackCarousel />
        </TwLogin>
      </Suspense>
    )
  }
}
