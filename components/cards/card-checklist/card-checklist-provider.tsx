'use client'

import {useCardsStore} from '@/components/cards/cards-store'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import {PropsWithChildren, useMemo, useState} from 'react'
import {CardChecklistContext, CardChecklistStore} from './card-checklist-store'
import {useCardChecklistListener} from './use-card-checklist-listener'

export const CardChecklistProvider = observer(
  ({children}: PropsWithChildren) => {
    const {user, supabase} = useSupabase()
    const [state] = useCardsStore()
    const [store] = useState(() => new CardChecklistStore())

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
      store,
      user
    })

    return (
      <CardChecklistContext.Provider value={store}>
        <>{children}</>
      </CardChecklistContext.Provider>
    )
  }
)
