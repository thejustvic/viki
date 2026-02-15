'use client'

import {useCardHandlers} from '@/components/cards/cards-handlers'
import {getSearchCard} from '@/components/cards/get-search-card'
import {Loader} from '@/components/common/loader'
import {PerfectScrollbar} from '@/components/common/perfect-scrollbar'
import {UserImage} from '@/components/common/user-image'
import {Menu} from '@/components/daisyui/menu'
import {Textarea} from '@/components/daisyui/textarea'
import {useDebouncedValue} from '@/hooks/use-debounced-value'
import {useInput} from '@/hooks/use-input'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {format} from 'date-fns'
import {observer, useLocalObservable} from 'mobx-react-lite'
import {PropsWithChildren, ReactNode, useEffect} from 'react'
import tw from 'tailwind-styled-components'
import {useCardsStore} from '../cards-store'
import {CardBgImages} from '../types'
import {
  CardInfoStore,
  CardInfoStoreContext,
  useCardInfoStore
} from './card-info-store'
import {useCardInfoListener} from './fetch/use-card-info-listener'
import {VisualContent} from './visual-content/visual-content'

const TwLoading = tw(Loader)`
  p-0
  flex
  items-start
  w-6
  h-6
`

const TwMenu = tw(Menu)`
  p-2
  flex-nowrap
  relative
  w-full
`

export default function CardInfoProvider({children}: PropsWithChildren) {
  const store = useLocalObservable(() => new CardInfoStore())

  return (
    <CardInfoStoreContext.Provider value={store}>
      <>{children}</>
    </CardInfoStoreContext.Provider>
  )
}

export const CardInfo = observer(() => {
  const [cardsState] = useCardsStore()
  const {supabase, user} = useSupabase()
  const [, store] = useCardInfoStore()
  const cardId = getSearchCard()

  const authorId = cardsState.cards.data?.find(
    card => card.id === cardId
  )?.author_id

  useCardInfoListener({cardId, authorId, store, supabase, user})

  return (
    <TwMenu>
      <CardInfoBody />
    </TwMenu>
  )
})

const CardInfoBody = () => (
  <PerfectScrollbar>
    <div className="flex flex-col gap-2 h-[calc(100dvh-86px)]">
      <Creator />
      <Time />
      <Text />
      <Cover />
      <Visual />
    </div>
  </PerfectScrollbar>
)

const Visual = () => {
  const [state] = useCardInfoStore()

  return (
    <ShowData
      loading={state.card.loading}
      error={state.card.error?.message}
      data={<VisualContent />}
      prefix={'visual:'}
    />
  )
}

const Cover = observer(() => {
  const [state] = useCardInfoStore()

  return (
    <ShowData
      loading={state.card.loading}
      error={state.card.error?.message}
      data={<CoverData />}
      prefix={'cover:'}
    />
  )
})

const TwRadio = tw.div`flex gap-1 items-center justify-between w-[120px] bg-base-200 p-2 rounded cursor-pointer`
const bgImages: CardBgImages = ['none', 'cyborg', 'matrix', 'cyberpunk']

const CoverData = observer(() => {
  const [state] = useCardInfoStore()
  const {updateCardBgImage} = useCardHandlers()
  const id = String(getSearchCard())

  if (!state.card.data) {
    return null
  }

  return (
    <div className="flex flex-col gap-1">
      {bgImages.map(image => {
        return (
          <TwRadio key={image} onClick={() => updateCardBgImage(image, id)}>
            <div>{image}</div>
            <input
              type="radio"
              name="radio-cover"
              className="radio"
              checked={state?.card?.data?.bg_image === image}
              readOnly
            />
          </TwRadio>
        )
      })}
    </div>
  )
})

const Time = observer(() => {
  const [state] = useCardInfoStore()

  return (
    <ShowData
      loading={state.card.loading}
      error={state.card.error?.message}
      data={<TimeData />}
      prefix={'time:'}
    />
  )
})

const TimeData = observer(() => {
  const [state] = useCardInfoStore()

  if (!state.card.data) {
    return null
  }

  const time = state.card.data.created_at

  const timeDistance = format(new Date(time), 'hh:mm:ss, PPPP')

  return <div className="flex flex-1">{timeDistance}</div>
})

const Text = observer(() => {
  const [state] = useCardInfoStore()
  return (
    <ShowData
      loading={state.card.loading}
      error={state.card.error?.message}
      data={<TextData />}
      prefix={'content:'}
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
        <Textarea size="md" value={''} className="w-full" onChange={() => {}} />
        <TwLoading className="absolute transform -translate-x-1/2 -translate-y-2/3 top-1/2 left-1/2" />
      </div>
    )
  }

  return (
    <div className="flex-1">
      <Textarea size="md" value={text} onChange={onChange} className="w-full" />
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
  const [cardCreatorState] = useCardInfoStore()

  return (
    <ShowData
      loading={cardCreatorState.cardCreator.loading}
      error={cardCreatorState.cardCreator.error?.message}
      data={<CreatorData />}
      prefix={'creator:'}
    />
  )
})

export const ShowData = ({
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
      <span className="w-20 pr-2">{prefix}</span>
      {loading ? (
        <div className="flex justify-center w-full">
          <TwLoading />
        </div>
      ) : (
        <>
          {error && <p>{error}</p>}
          {data}
        </>
      )}
    </div>
  )
}
