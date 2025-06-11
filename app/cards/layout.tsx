import {Load} from '@/components/common/load'
import {getServerSession} from '@/utils/supabase-utils/get-server-session'
import {headers} from 'next/headers'
import {redirect} from 'next/navigation'
import {Suspense} from 'react'

export default async function CardsLayout({
  children
}: {
  children: React.ReactNode
}) {
  const heads = await headers()
  const pathname = heads.get('x-invoke-path') ?? ''

  const session = await getServerSession()

  if (!session && pathname !== '/login') {
    redirect('/login')
  }

  return (
    <Suspense fallback={<Load center />}>
      <section>{children}</section>
    </Suspense>
  )
}
