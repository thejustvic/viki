import 'server-only'

import {Load} from '@/components/common/load'
import {Suspense} from 'react'
import MyPosts from '../app/posts/page'

export const Logged = () => {
  return (
    <Suspense fallback={<Load center />}>
      {/* @ts-expect-error Server Component */}
      <MyPosts />
    </Suspense>
  )
}
