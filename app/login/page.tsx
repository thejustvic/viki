import 'server-only'

import {Load} from '@/components/common/load'
import {TechStackCarousel} from '@/components/tech-stack-carousel/tech-stack-carousel'
import {ClientRedirect} from '@/hooks/use-client-redirect'
import {getServerUser} from '@/utils/supabase-utils/get-server-user'
import {headers} from 'next/headers'
import {Suspense} from 'react'
import {HeroLogin, TwAnonymous} from './components/hero-login'

export default async function Page() {
  const heads = await headers()
  const pathname = heads.get('x-invoke-path') || ''

  const user = await getServerUser()

  if (user && pathname !== '/posts') {
    return <ClientRedirect href="/posts" />
  } else {
    return (
      <Suspense fallback={<Load center />}>
        <TwAnonymous>
          <HeroLogin />
          <TechStackCarousel />
        </TwAnonymous>
      </Suspense>
    )
  }
}
