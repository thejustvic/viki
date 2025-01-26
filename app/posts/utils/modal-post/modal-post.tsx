'use client'

import {useMemoOne} from '@/hooks/use-memo-one'
import {observer} from 'mobx-react-lite'
import {useSearchParams} from 'next/navigation'
import tw from 'tailwind-styled-components'
import {usePostListener} from './fetch/use-get-post-by-id'

import {Loader} from '@/components/common/loader'
import {UserImage} from '@/components/common/user-image'
import {useDebouncedValue} from '@/hooks/use-debounced-value'
import {useInput} from '@/hooks/use-input'
import {ReactNode, useEffect} from 'react'
import {Divider, Menu, Textarea} from 'react-daisyui'
import {usePostHandlers} from '../posts-handlers'
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

const TwMenu = tw(Menu)`
  bg-base-100
  text-base-content
  overflow-y-auto
  p-2
  flex-nowrap
  relative
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

  usePostListener(postId)
  usePostCreatorListener(state.post.data?.user_id)

  return (
    <TwMenu>
      <ModalHeader />
      <ModalBody />
    </TwMenu>
  )
})

const ModalHeader = () => {
  return <Divider />
}

const ModalBody = () => (
  <div className="flex flex-col gap-2">
    <Creator />
    <Text />
  </div>
)

const Text = observer(() => {
  const [modalState] = useModalPostStore()
  return (
    <ShowData
      loading={modalState.post.loading}
      error={modalState.post.error?.message}
      data={<TextData />}
      prefix={'content:'}
    />
  )
})

const TextData = observer(() => {
  const {updatePost} = usePostHandlers()
  const [modalState] = useModalPostStore()
  const [text, onChange] = useInput(modalState.post.data?.text ?? '')
  const debounced = useDebouncedValue(text, 500)

  useEffect(() => {
    const text = modalState.post.data?.text
    const id = modalState.post.data?.id
    if (id && text !== debounced && debounced.length > 0) {
      void updatePost(debounced, id)
    }
  }, [debounced])

  return (
    <Textarea size="md" value={text} onChange={onChange} className="w-full" />
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
