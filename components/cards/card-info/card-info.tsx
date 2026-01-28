'use client'

import {useCardHandlers} from '@/components/cards/cards-handlers'
import {getSearchCard} from '@/components/cards/get-search-card'
import {Loader} from '@/components/common/loader'
import {UserImage} from '@/components/common/user-image'
import {Input} from '@/components/daisyui/input'
import {Menu} from '@/components/daisyui/menu'
import {Textarea} from '@/components/daisyui/textarea'
import {useDebouncedValue} from '@/hooks/use-debounced-value'
import {useInput} from '@/hooks/use-input'
import {useMemoOne} from '@/hooks/use-memo-one'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {format} from 'date-fns'
import {observer} from 'mobx-react-lite'
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

export const CardInfoProvider = observer(({children}: PropsWithChildren) => {
  const [cardsState] = useCardsStore()
  const {supabase, user} = useSupabase()
  const store = useMemoOne(() => new CardInfoStore(), [user])

  const cardId = getSearchCard()

  const authorId = cardsState.cards.data?.find(
    card => card.id === cardId
  )?.author_id

  useCardInfoListener({cardId, authorId, store, supabase, user})

  return (
    <CardInfoStoreContext.Provider value={store}>
      <>{children}</>
    </CardInfoStoreContext.Provider>
  )
})

export const CardInfo = () => {
  return (
    <TwMenu>
      <CardInfoBody />
    </TwMenu>
  )
}

const CardInfoBody = () => (
  <div className="flex flex-col gap-2">
    <Time />
    <Creator />
    <Text />
    <Cover />
    <ChooseBaubleColor />
  </div>
)

const ChooseBaubleColor = observer(() => {
  const [state] = useCardInfoStore()

  return (
    <div className="mt-4 flex flex-col gap-2">
      <ShowData
        loading={state.card.loading}
        error={state.card.error?.message}
        data={<ChooseBaubleColorData />}
        prefix={'bauble color:'}
      />
      <ShowData
        loading={state.card.loading}
        error={state.card.error?.message}
        data={<ChooseBaubleTextColorData />}
        prefix={'text color on bauble:'}
      />
    </div>
  )
})

const ChooseBaubleColorData = observer(() => {
  const [state] = useCardInfoStore()
  const {updateCardBaubleColorCompleted, updateCardBaubleColorNotCompleted} =
    useCardHandlers()
  const id = String(getSearchCard())

  if (!state.card.data) {
    return null
  }
  if (
    !state.card.data.bauble_color_not_completed ||
    !state.card.data.bauble_color_completed
  ) {
    return null
  }
  return (
    <div className="flex gap-2">
      <ColorPicker
        color={state.card.data.bauble_color_not_completed}
        label="not checked"
        onChange={e => {
          const color = e.target.value
          updateCardBaubleColorNotCompleted(color, id)
        }}
      />
      <ColorPicker
        color={state.card.data.bauble_color_completed}
        label="checked"
        onChange={e => {
          const color = e.target.value
          updateCardBaubleColorCompleted(color, id)
        }}
      />
    </div>
  )
})

const ChooseBaubleTextColorData = observer(() => {
  const [state] = useCardInfoStore()
  const {
    updateCardBaubleTextColorCompleted,
    updateCardBaubleTextColorNotCompleted
  } = useCardHandlers()
  const id = String(getSearchCard())

  if (!state.card.data) {
    return null
  }
  if (
    !state.card.data.bauble_text_color_not_completed ||
    !state.card.data.bauble_text_color_completed
  ) {
    return null
  }
  return (
    <div className="flex gap-2">
      <ColorPicker
        color={state.card.data.bauble_text_color_not_completed}
        label="not checked"
        onChange={e => {
          const color = e.target.value
          updateCardBaubleTextColorNotCompleted(color, id)
        }}
      />
      <ColorPicker
        color={state.card.data.bauble_text_color_completed}
        label="checked"
        onChange={e => {
          const color = e.target.value
          updateCardBaubleTextColorCompleted(color, id)
        }}
      />
    </div>
  )
})

const ColorPicker = ({
  color = '#ff0000',
  label = 'Color',
  onChange
}: {
  color?: string
  label?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  return (
    <Input
      type="color"
      defaultValue={color}
      inputClassName="p-0 h-10 w-25 cursor-pointer"
      label={label}
      onChange={onChange}
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

const TwRadio = tw.div`flex gap-1 items-center justify-between w-[120px] bg-base-300 p-2 rounded cursor-pointer`
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
              name="radio-1"
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
    <div className="flex-1">
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
      <span className="w-28 pr-2">{prefix}</span>
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
