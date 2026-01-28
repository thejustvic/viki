import {Load} from '@/components/common/load'
import {getServerSession} from '@/utils/supabase-utils/get-server-session'
import {redirect} from 'next/navigation'
import {Suspense} from 'react'

export default async function LoginLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  if (session) {
    redirect('/cards')
  }

  return (
    <Suspense fallback={<Load center />}>
      <section>{children}</section>
    </Suspense>
  )
}
