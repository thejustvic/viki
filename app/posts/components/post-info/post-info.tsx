'use client'

import {Loader} from '@/components/common/loader'
import {UserImage} from '@/components/common/user-image'
import {Menu} from '@/components/daisyui/menu'
import {Textarea} from '@/components/daisyui/textarea'
import {useDebouncedValue} from '@/hooks/use-debounced-value'
import {useInput} from '@/hooks/use-input'
import {useMemoOne} from '@/hooks/use-memo-one'
import {observer} from 'mobx-react-lite'
import {ReactNode, useEffect} from 'react'
import tw from 'tailwind-styled-components'
import {getSearchPost} from '../get-search-post'
import {usePostHandlers} from '../posts-handlers'
import {usePostListener} from './fetch/use-post-listener'
import {
  PostInfoStore,
  PostInfoStoreContext,
  usePostInfoStore
} from './post-info-store'

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
  w-full
`

export const PostInfo = () => {
  const store = useMemoOne(() => new PostInfoStore(), [])

  return (
    <PostInfoStoreContext.Provider value={store}>
      <PostInfoBase />
    </PostInfoStoreContext.Provider>
  )
}

export const PostInfoBase = observer(() => {
  const [state] = usePostInfoStore()
  const postId = getSearchPost()

  usePostListener({postId, authorId: state.post.data?.author_id})

  return (
    <TwMenu>
      <ModalBody />
    </TwMenu>
  )
})

const ModalBody = () => (
  <div className="flex flex-col gap-2">
    <Creator />
    <Text />
  </div>
)

const Text = observer(() => {
  const [modalState] = usePostInfoStore()
  return (
    <ShowData
      loading={modalState.post.loading}
      error={modalState.post.error?.message}
      data={<TextData />}
      prefix={'content:'}
      stopSpinner
    />
  )
})

const TextData = observer(() => {
  const {updatePost} = usePostHandlers()
  const [modalState] = usePostInfoStore()
  const [text, onChange] = useInput(modalState.post.data?.text ?? '')
  const debounced = useDebouncedValue(text, 500)

  useEffect(() => {
    const text = modalState.post.data?.text
    const id = modalState.post.data?.id
    if (id && text !== debounced && debounced.length > 0) {
      void updatePost(debounced, id)
    }
  }, [debounced])

  if (!modalState.post.data) {
    return (
      <div className="relative w-full">
        <Textarea size="md" value={''} className="w-full" onChange={() => {}} />
        <TwLoading className="absolute transform -translate-x-1/2 -translate-y-2/3 top-1/2 left-1/2" />
      </div>
    )
  }

  return (
    <div className="w-full">
      <Textarea size="md" value={text} onChange={onChange} className="w-full" />
    </div>
  )
})

const CreatorData = observer(() => {
  const [modalState] = usePostInfoStore()

  if (!modalState.postCreator.data) {
    return null
  }

  const src = modalState.postCreator.data.user_metadata?.avatar_url

  return (
    <div className="flex gap-2 items-center">
      <UserImage src={src} />
      {modalState.postCreator.data.email}
    </div>
  )
})

const Creator = observer(() => {
  const [modalState] = usePostInfoStore()

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
  prefix,
  stopSpinner = false
}: {
  loading: boolean
  error: string | undefined
  data: ReactNode
  prefix: string
  stopSpinner?: boolean
}) => {
  return (
    <div className="flex">
      <span className="w-20 pr-2 truncate shrink-0">{prefix}</span>
      {loading && !stopSpinner && (
        <div className="flex justify-center w-full">
          <TwLoading />
        </div>
      )}
      {error && <p>{error}</p>}
      {data}
    </div>
  )
}
