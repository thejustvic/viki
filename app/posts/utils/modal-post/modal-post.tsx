'use client'

import {useMemoOne} from '@/hooks/use-memo-one'
import {observer} from 'mobx-react-lite'
import {useSearchParams} from 'next/navigation'
import tw from 'tailwind-styled-components'
import {usePostListener} from './fetch/use-get-post-by-id'

import {Loader} from '@/components/common/loader'
import {UserImage} from '@/components/common/user-image'
import {useGlobalStore} from '@/components/global/global-store'
import {useBoolean} from '@/hooks/use-boolean'
import {useDebouncedValue} from '@/hooks/use-debounced-value'
import {useInput} from '@/hooks/use-input'
import {ReactNode, useCallback, useEffect, useState} from 'react'
import {Menu, Textarea} from 'react-daisyui'
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
  border
  border-base-300
  bg-base-100
  text-base-content
  overflow-y-auto
  p-2
  flex-nowrap
  relative
`

const TwDrag = tw.div`
  absolute
  -left-2
  top-1/2
  p-2
  cursor-col-resize
`

const TwDragRow = tw.div`
  w-1
  h-6
  bg-slate-300
  rounded-2xl
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
  const [globalStore] = useGlobalStore()
  const [state] = useModalPostStore()
  const searchParams = useSearchParams()
  const postId = searchParams.get('post')

  usePostListener(postId)
  usePostCreatorListener(state.post.data?.by)

  return (
    <TwMenu style={{width: globalStore.rightDrawerWidth}}>
      <Drag />
      <ModalHeader />
      <ModalBody />
    </TwMenu>
  )
})

const Drag = observer(() => {
  const [state, store] = useGlobalStore()
  const mouseDown = useBoolean(false)
  const [mouseX, setMouseX] = useState({
    start: 0,
    move: 0,
    startWidth: state.rightDrawerWidth
  })

  useEffect(() => {
    if (!mouseDown.value) {
      return
    }
    const width = mouseX.startWidth + mouseX.move
    store.setRightDrawerWidth(width)
  }, [mouseX.move])

  const handleMouseDown = (event: React.MouseEvent) => {
    mouseDown.turnOn()
    setMouseX({
      start: event.screenX,
      move: 0,
      startWidth: state.rightDrawerWidth
    })

    const body = document.getElementsByTagName('body')[0]
    body.style.userSelect = 'none'
    body.style.cursor = 'col-resize'
  }

  const handleMouseUp = () => {
    if (!mouseDown.value) {
      return
    }
    mouseDown.turnOff()
    setMouseX({start: 0, move: 0, startWidth: state.rightDrawerWidth})

    const body = document.getElementsByTagName('body')[0]
    body.style.userSelect = 'auto'
    body.style.cursor = 'auto'
  }

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!mouseDown.value) {
        return
      }
      setMouseX(prev => ({...prev, move: mouseX.start - event.screenX}))
    },
    [mouseDown.value]
  )

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return (
    <TwDrag onMouseDown={handleMouseDown}>
      <TwDragRow />
    </TwDrag>
  )
})

const ModalHeader = () => {
  return <div>Card</div>
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
