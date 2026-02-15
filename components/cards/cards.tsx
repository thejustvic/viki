'use client'

import {CardChecklistProgress} from '@/components/cards/card-checklist/card-checklist-progress'
import {useCardChecklistStore} from '@/components/cards/card-checklist/card-checklist-store'
import {useCheckboxHandlers} from '@/components/checklist/checkbox/checkbox-handlers'
import {ParallaxCardContainer} from '@/components/common/parallax-card-container'
import {Button} from '@/components/daisyui/button'
import {Card as CardUI} from '@/components/daisyui/card'
import {useBoolean} from '@/hooks/use-boolean'
import {useLoggingOff} from '@/hooks/use-logging-off'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {IconTrash} from '@tabler/icons-react'
import {observer, useLocalObservable} from 'mobx-react-lite'
import {PropsWithChildren, useMemo} from 'react'
import {isMobile} from 'react-device-detect'
import {twJoin} from 'tailwind-merge'
import tw from 'tailwind-styled-components'
import {useTeamStore} from '../team/team-store'
import {AddNewCard} from './add-new-card'
import {useCardChecklistListener} from './card-checklist/use-card-checklist-listener'
import {CardsContext, CardsStore, useCardsStore} from './cards-store'
import {getSearchCard} from './get-search-card'
import {Card as CardType} from './types'
import {
  useCardsListener,
  useCheckCardExistInCurrentTeam
} from './use-cards-listener'

const TwContainer = tw.div`
  flex
  gap-8
  p-8
  flex-wrap
  justify-center
  md:justify-start
`

export default function CardsProvider({children}: PropsWithChildren) {
  const store = useLocalObservable(() => new CardsStore())

  return <CardsContext.Provider value={store}>{children}</CardsContext.Provider>
}

export const CardsList = observer(() => {
  const {supabase, user} = useSupabase()
  const [, store] = useCardsStore()
  const [teamState] = useTeamStore()

  useCardsListener({supabase, user, store, teamState})

  useCheckCardExistInCurrentTeam()
  useLoggingOff()

  return (
    <TwContainer>
      <Cards />
    </TwContainer>
  )
})

const Cards = observer(() => {
  const {supabase, user} = useSupabase()
  const [state, store] = useCardsStore()
  const cardId = getSearchCard()

  const [, cardChecklistStore] = useCardChecklistStore()

  const cards = state.cards.data
  const cardsCount = cards?.length

  const cardIds = useMemo(() => {
    const cards = state.cards.data
    if (!cards || cards.length === 0) {
      return null
    }

    return cards.map(card => card.id)
  }, [cards, cardsCount])

  useCardChecklistListener({
    cardIds,
    supabase,
    store: cardChecklistStore,
    user
  })

  if (state.cards.loading) {
    return Array(3)
      .fill(null)
      .map((_el, inx) => (
        <div key={inx} className="skeleton w-[288px] h-[142px] md:w-[190px]" />
      ))
  }

  if (state.cards.error) {
    return <div className="text-error">{state.cards.error.message}</div>
  }

  return (
    <>
      {store.searchedCards().map(card => (
        <Card card={card} key={card.id} active={cardId === card.id} />
      ))}
      {state.cards?.data && state.cards.data.length >= 0 ? (
        <AddNewCard />
      ) : null}
    </>
  )
})

const Card = observer(({card, active}: {card: CardType; active: boolean}) => {
  const {user} = useSupabase()
  const [, store] = useCardsStore()
  const updateSearchParams = useUpdateSearchParams()

  const remove = () => {
    store.setIdCardToDelete(card.id)
    updateSearchParams('delete-card', 'true')
  }

  return (
    <ParallaxCardContainer
      bgImage={card.bg_image}
      active={active}
      my={user?.id === card.author_id}
      cardNodeBody={<CardBody card={card} remove={remove} />}
    />
  )
})

const TwText = tw.div`
  line-clamp-3
  text-base-content/90
  drop-shadow-[var(--text-shadow)]
`

interface CardProps {
  card: CardType
  remove: () => void
}

const CardBody = observer(({card, remove}: CardProps) => {
  const updateSearchParams = useUpdateSearchParams()
  const hovered = useBoolean(false)

  const onClickHandler = () => {
    updateSearchParams('card', card.id)
  }

  return (
    <div
      className="flex flex-col flex-1 justify-between"
      onMouseEnter={hovered.turnOn}
      onMouseLeave={hovered.turnOff}
    >
      <CardUI.Title className="flex justify-between">
        <TwText>{card.text}</TwText>
        {isMobile ? (
          <DeleteCardButton remove={remove} />
        ) : (
          <DeleteCardButton remove={remove} visible={hovered.value} />
        )}
      </CardUI.Title>
      <CardUI.Actions className="justify-center">
        <Button
          soft
          color="primary"
          className="w-full"
          onClick={onClickHandler}
        >
          <CardChecklistProgress id={card.id} />
        </Button>
      </CardUI.Actions>
    </div>
  )
})

interface DeleteCardButtonProps {
  remove: () => void
  visible?: boolean
}

const DeleteCardButton = ({remove, visible = true}: DeleteCardButtonProps) => {
  return (
    <Button
      soft
      shape="circle"
      size="sm"
      onClick={remove}
      className={twJoin(visible ? 'opacity-100' : 'opacity-0', 'self-start')}
    >
      <IconTrash size={16} />
    </Button>
  )
}

export const CheckAllCheckboxes = observer(() => {
  const id = String(getSearchCard())
  const [state] = useCardChecklistStore()
  const {updateAllCheckboxIsCompleted} = useCheckboxHandlers()
  const isAllCompleted = state.progress.get(id) === 100
  const checkboxIds = state.checklists.data?.get(id)?.map(c => c.id)

  return (
    <div className="tooltip tooltip-info" data-tip="all">
      <input
        type="checkbox"
        checked={isAllCompleted}
        className="checkbox text-success"
        onChange={() => {
          if (checkboxIds) {
            updateAllCheckboxIsCompleted(!isAllCompleted, checkboxIds)
          } else {
            console.error('checkboxIds is undefined')
          }
        }}
      />
    </div>
  )
})
