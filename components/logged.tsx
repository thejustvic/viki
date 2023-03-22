import 'server-only'

import {Load} from '@/common/load'
import {Suspense} from 'react'
import MyPosts from '../app/posts/page'

export const Logged = () => {
  return (
    <Suspense fallback={<Load />}>
      {/* @ts-expect-error Server Component */}
      <MyPosts />
    </Suspense>
  )
}
