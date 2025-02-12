import 'server-only'

import {Load} from '@/components/common/load'
import {TechStackCarousel} from '@/components/tech-stack-carousel/tech-stack-carousel'
import {ClientRedirect} from '@/hooks/use-client-redirect'
import {createClient} from '@/utils/supabase-utils/supabase-server'
import {headers} from 'next/headers'
import {Suspense} from 'react'
import {HeroLogin, TwAnonymous} from './components/hero-login'

const getUser = async () => {
  const supabase = await createClient()
  const {
    data: {user}
  } = await supabase.auth.getUser()
  return user
}

export default async function Page() {
  const heads = await headers()
  const pathname = heads.get('x-invoke-path') || ''

  const user = await getUser()

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
