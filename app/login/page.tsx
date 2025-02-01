import 'server-only'

import {TechStackCarousel} from '@/components/tech-stack-carousel/tech-stack-carousel'
import {createClient} from '@/utils/supabase-utils/supabase-server'
import {redirect} from 'next/navigation'
import {HeroLogin, TwAnonymous} from './components/hero-login'

// do not cache this page
export const revalidate = 0

export default async function Page() {
  const supabase = await createClient()

  const {data} = await supabase.auth.getUser()

  if (data.user) redirect(`/posts`)

  return (
    <TwAnonymous>
      <HeroLogin />
      <TechStackCarousel />
    </TwAnonymous>
  )
}
