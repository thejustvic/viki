'use client'

import {Modal} from '@/components/common/modal'
import {useMemoOne} from '@/hooks/use-memo-one'
import {observer} from 'mobx-react-lite'
import {useRouter, useSearchParams} from 'next/navigation'
import tw from 'tailwind-styled-components'
import {usePostListener} from './fetch/use-get-post-by-id'

import {Loader} from '@/components/common/loader'
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
      text={modalState.post.data?.text}
      prefix={'content:'}
    />
  )
})

const Creator = observer(() => {
  const [modalState] = useModalPostStore()
  return (
    <ShowData
      loading={modalState.postCreator.loading}
      error={modalState.postCreator.error?.message}
      text={modalState.postCreator.data?.email}
      prefix={'creator:'}
    />
  )
})

const ShowData = ({
  loading,
  error,
  text,
  prefix
}: {
  loading: boolean
  error: string | undefined
  text: string | undefined | null
  prefix: string
}) => {
  return (
    <div className="flex">
      <span className="pr-2">{prefix}</span>
      {loading && <TwLoading />}
      {error && <div>{error}</div>}
      {text && <div>{text}</div>}
    </div>
  )
}
