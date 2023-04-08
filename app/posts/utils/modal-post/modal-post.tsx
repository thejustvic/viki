'use client'

import {Load} from '@/common/load'
import {Modal} from '@/common/modal'
import {useMemoOne} from '@/hooks/use-memo-one'
import {observer} from 'mobx-react-lite'
import {useRouter, useSearchParams} from 'next/navigation'
import tw from 'tailwind-styled-components'
import {usePostListener} from './fetch/use-get-post-by-id'

import {
  ModalPostStore,
  ModalPostStoreContext,
  useModalPostStore
} from './modal-post-store'

const TwLoading = tw(Load)`
  h-6 
  w-6 
  p-0 
  flex 
  items-start
`

export const ModalPost = () => {
  const store = useMemoOne(() => new ModalPostStore(), [])

  return (
    <ModalPostStoreContext.Provider value={store}>
      <ModalPostBase />
    </ModalPostStoreContext.Provider>
  )
}

export const ModalPostBase = () => {
  const searchParams = useSearchParams()
  const postId = searchParams.get('post')
  const router = useRouter()
  const goBack = () => router.push('/')

  usePostListener(postId)

  return (
    <Modal
      open={Boolean(postId)}
      goBack={goBack}
      header={<ModalHeader />}
      body={<ModalBody />}
    />
  )
}

const ModalHeader = () => {
  return <div>Post:</div>
}

const ModalBody = observer(() => {
  const [state] = useModalPostStore()
  return (
    <>
      {state.post.loading && <TwLoading />}
      {state.post.error && <div>{state.post.error.message}</div>}
      {state.post.data && <div>{state.post.data?.text}</div>}
    </>
  )
})
