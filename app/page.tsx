import {Load} from '@/common/load'
import Wrapper from '@/common/wrapper'
import {Suspense} from 'react'
import Login from '../components/main'

export default function Page() {
  return (
    <Wrapper>
      <Suspense fallback={<Load />}>
        {/* @ts-expect-error Server Component */}
        <Login />
      </Suspense>
    </Wrapper>
  )
}
