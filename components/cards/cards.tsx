'use client'

import {CardChecklistProgress} from '@/components/cards/card-checklist/card-checklist-progress'
import {useCardChecklistStore} from '@/components/cards/card-checklist/card-checklist-store'
import {useCheckboxHandlers} from '@/components/checklist/checkbox/checkbox-handlers'
import {ParallaxCardContainer} from '@/components/common/parallax-card-container'
import {Button} from '@/components/daisyui/button'
import {Card as CardUI} from '@/components/daisyui/card'
import {useTeamStore} from '@/components/team/team-store'
import {useLoggingOff} from '@/hooks/use-logging-off'
import {useMemoOne} from '@/hooks/use-memo-one'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {IconTrash} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {PropsWithChildren} from 'react'
import tw from 'tailwind-styled-components'
import {AddNewCard} from './add-new-card'
import {useCardHandlers} from './cards-handlers'
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
  m-8
  flex-wrap
  justify-center
  md:justify-start
`

export const CardsProvider = observer(({children}: PropsWithChildren) => {
  const store = useMemoOne(() => new CardsStore(), [])
  const {supabase, user} = useSupabase()
  const [state] = useTeamStore()

  useCardsListener({supabase, user, store, currentTeamId: state.currentTeamId})

  return <CardsContext.Provider value={store}>{children}</CardsContext.Provider>
})

export const CardsBase = () => <CardsList />

const CardsList = observer(() => {
  useCheckCardExistInCurrentTeam()
  useLoggingOff()

  return (
    <TwContainer>
      <Cards />
      <AddNewCard />
    </TwContainer>
  )
})

const Cards = observer(() => {
  const [state, store] = useCardsStore()
  const cardId = getSearchCard()

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

  return store
    .searchedCards()
    .map(card => <Card card={card} key={card.id} active={cardId === card.id} />)
})

const Card = observer(({card, active}: {card: CardType; active: boolean}) => {
  const {user} = useSupabase()
  const updateSearchParams = useUpdateSearchParams()
  const {removeCard} = useCardHandlers()

  const remove = async () => {
    await removeCard(card.id)
    updateSearchParams('card')
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

interface CardProps {
  card: CardType
  remove: () => void
}

const CardBody = observer(({card, remove}: CardProps) => {
  const updateSearchParams = useUpdateSearchParams()

  const onClickHandler = () => {
    updateSearchParams('card', card.id)
  }

  return (
    <>
      <CardUI.Title className="flex justify-between">
        <Button color="ghost" className="p-0" onClick={onClickHandler}>
          <span className="w-16 truncate">{card.text}</span>
        </Button>
        <Button color="ghost" shape="circle" onClick={remove}>
          <IconTrash />
        </Button>
      </CardUI.Title>
      <CardUI.Actions className="justify-center">
        <Button color="primary" className="w-full" onClick={onClickHandler}>
          <CardChecklistProgress id={card.id} />
        </Button>
      </CardUI.Actions>
    </>
  )
})

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
