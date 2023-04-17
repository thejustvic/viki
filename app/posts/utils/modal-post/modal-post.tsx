'use client'

import {Modal} from '@/components/common/modal'
import {useMemoOne} from '@/hooks/use-memo-one'
import {observer} from 'mobx-react-lite'
import {useRouter, useSearchParams} from 'next/navigation'
import tw from 'tailwind-styled-components'
import {usePostListener} from './fetch/use-get-post-by-id'

import {Loader} from '@/components/common/loader'
import {UserImage} from '@/components/common/user-image'
import {ReactNode} from 'react'
import {usePostCreatorListener} from './fetch/use-get-post-creator-by-id'
import {
  ModalPostStore,
  ModalPostStoreContext,
  useModalPostStore
} from './modal-post-store'

const TwLoading = tw(Loader)`
  p-0
  flex
  items-start
  w-6
  h-6
`

export const ModalPost = () => {
  const store = useMemoOne(() => new ModalPostStore(), [])

  return (
    <ModalPostStoreContext.Provider value={store}>
      <ModalPostBase />
    </ModalPostStoreContext.Provider>
  )
}

export const ModalPostBase = observer(() => {
  const [state] = useModalPostStore()
  const searchParams = useSearchParams()
  const postId = searchParams.get('post')
  const router = useRouter()
  const goBack = () => router.push('/')

  usePostListener(postId)
  usePostCreatorListener(state.post.data?.by)

  return (
    <Modal
      open={Boolean(postId)}
      goBack={goBack}
      header={<ModalHeader />}
      body={<ModalBody />}
    />
  )
})

const ModalHeader = () => {
  return <div>Card</div>
}

const ModalBody = () => (
  <>
    <Text />
    <Creator />
  </>
)

const Text = observer(() => {
  const [modalState] = useModalPostStore()
  return (
    <ShowData
      loading={modalState.post.loading}
      error={modalState.post.error?.message}
      data={modalState.post.data?.text}
      prefix={'content:'}
    />
  )
})

const CreatorData = observer(() => {
  const [modalState] = useModalPostStore()

  if (!modalState.postCreator.data) {
    return null
  }

  const src = modalState.postCreator.data.user_metadata?.avatar_url

  return (
    <div className="flex gap-2">
      <UserImage src={src} size={24} />
      {modalState.postCreator.data.email}
    </div>
  )
})

const Creator = observer(() => {
  const [modalState] = useModalPostStore()
  return (
    <ShowData
      loading={modalState.postCreator.loading}
      error={modalState.postCreator.error?.message}
      data={<CreatorData />}
      prefix={'creator:'}
    />
  )
})

const ShowData = ({
  loading,
  error,
  data,
  prefix
}: {
  loading: boolean
  error: string | undefined
  data: ReactNode
  prefix: string
}) => {
  return (
    <div className="flex">
      <span className="w-20 pr-2 truncate shrink-0">{prefix}</span>
      {loading && <TwLoading />}
      {error && <p>{error}</p>}
      {data}
    </div>
  )
}
