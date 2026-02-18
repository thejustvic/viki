'use client'

import {useCardChecklistStore} from '@/components/cards/card-checklist/card-checklist-store'
import {useLoggingOff} from '@/hooks/use-logging-off'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import {useMemo} from 'react'
import tw from 'tailwind-styled-components'
import {useTeamStore} from '../team/team-store'
import {useCardChecklistListener} from './card-checklist/use-card-checklist-listener'
import {Cards} from './cards'
import {useCardsStore} from './cards-store'
import {
  useCardsListener,
  useCheckCardExistInCurrentTeam
} from './use-cards-listener'

const TwContainer = tw.div`
  grid 
  gap-4 
  p-4  
  max-[425px]:grid-cols-2
  grid-cols-[repeat(auto-fill,_minmax(min(190px,100%),_1fr))]
`

export const CardsList = observer(() => {
  const {supabase, user} = useSupabase()
  const [state, store] = useCardsStore()
  const [, cardChecklistStore] = useCardChecklistStore()
  const [teamState] = useTeamStore()

  useLoggingOff()
  useCheckCardExistInCurrentTeam()
  useCardsListener({supabase, user, store, teamState})

  const cards = state.cards.data
  const cardsCount = cards?.length

  const cardIds = useMemo(() => {
    const cards = state.cards.data
    if (!cards || cards.length === 0) {
      return null
    }

    return cards.map(card => card.id)
  }, [cardsCount])

  useCardChecklistListener({
    cardIds,
    supabase,
    store: cardChecklistStore,
    user
  })

  return (
    <TwContainer>
      <Cards />
    </TwContainer>
  )
})
