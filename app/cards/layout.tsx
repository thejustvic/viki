import {Load} from '@/components/common/load'

import {Suspense} from 'react'

export default async function CardsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<Load center />}>
      <section>{children}</section>
    </Suspense>
  )
}
