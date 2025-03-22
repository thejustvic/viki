'use client'

import {useCardHandlers} from '@/components/cards/cards-handlers'
import {getSearchCard} from '@/components/cards/get-search-card'
import {Loader} from '@/components/common/loader'
import {UserImage} from '@/components/common/user-image'
import {Menu} from '@/components/daisyui/menu'
import {Textarea} from '@/components/daisyui/textarea'
import {useDebouncedValue} from '@/hooks/use-debounced-value'
import {useInput} from '@/hooks/use-input'
import {useMemoOne} from '@/hooks/use-memo-one'
import {format} from 'date-fns'
import {observer} from 'mobx-react-lite'
import {ReactNode, useEffect} from 'react'
import tw from 'tailwind-styled-components'
import {
  CardInfoStore,
  CardInfoStoreContext,
  useCardInfoStore
} from './card-info-store'
import {useCardListener} from './fetch/use-card-listener'

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

export const CardInfo = () => {
  const store = useMemoOne(() => new CardInfoStore(), [])

  return (
    <CardInfoStoreContext.Provider value={store}>
      <CardInfoBase />
    </CardInfoStoreContext.Provider>
  )
}

export const CardInfoBase = observer(() => {
  const [state] = useCardInfoStore()
  const cardId = getSearchCard()

  useCardListener({cardId, authorId: state.card.data?.author_id})

  return (
    <TwMenu>
      <ModalBody />
    </TwMenu>
  )
})

const ModalBody = () => (
  <div className="flex flex-col gap-2">
    <Time />
    <Creator />
    <Text />
  </div>
)

const Time = () => {
  const [state] = useCardInfoStore()

  return (
    <ShowData
      loading={state.card.loading}
      error={state.card.error?.message}
      data={<TimeData />}
      prefix={'time:'}
    />
  )
}

const TimeData = observer(() => {
  const [state] = useCardInfoStore()

  if (!state.card.data) {
    return null
  }

  const time = state.card.data.created_at

  const timeDistance = format(new Date(time), 'hh:mm:ss, PPPP')

  return <div>{timeDistance}</div>
})

const Text = observer(() => {
  const [state] = useCardInfoStore()
  return (
    <ShowData
      loading={state.card.loading}
      error={state.card.error?.message}
      data={<TextData />}
      prefix={'content:'}
      stopSpinner
    />
  )
})

const TextData = observer(() => {
  const {updateCard} = useCardHandlers()
  const [state] = useCardInfoStore()
  const [text, onChange] = useInput(state.card.data?.text ?? '')
  const debounced = useDebouncedValue(text, 500)

  useEffect(() => {
    const text = state.card.data?.text
    const id = state.card.data?.id
    if (id && text !== debounced && debounced.length > 0) {
      void updateCard(debounced, id)
    }
  }, [debounced])

  if (state.card.loading) {
    return (
      <div className="relative w-full">
        <Textarea
          size="md"
          value={''}
          className="w-full border-none"
          onChange={() => {}}
        />
        <TwLoading className="absolute transform -translate-x-1/2 -translate-y-2/3 top-1/2 left-1/2" />
      </div>
    )
  }

  return (
    <div className="w-full">
      <Textarea
        size="md"
        value={text}
        onChange={onChange}
        className="w-full border-none"
      />
    </div>
  )
})

const CreatorData = observer(() => {
  const [state] = useCardInfoStore()

  if (!state.cardCreator.data) {
    return null
  }

  const src = state.cardCreator.data.user_metadata?.avatar_url

  return (
    <div className="flex gap-2 items-center truncate">
      <UserImage src={src} />
      <div className="truncate">{state.cardCreator.data.email}</div>
    </div>
  )
})

const Creator = observer(() => {
  const [modalState] = useCardInfoStore()

  return (
    <ShowData
      loading={modalState.cardCreator.loading}
      error={modalState.cardCreator.error?.message}
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
