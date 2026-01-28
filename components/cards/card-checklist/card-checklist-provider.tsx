'use client'

import {useCardsStore} from '@/components/cards/cards-store'
import {useMemoOne} from '@/hooks/use-memo-one'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {PropsWithChildren, useMemo} from 'react'
import {CardChecklistContext, CardChecklistStore} from './card-checklist-store'
import {useCardChecklistListener} from './use-card-checklist-listener'

export const CardChecklistProvider = ({children}: PropsWithChildren) => {
  const {user, supabase} = useSupabase()
  const [state] = useCardsStore()
  const store = useMemoOne(() => new CardChecklistStore(), [user])

  const cardIds = useMemo(() => {
    if (!state.cards.data) {
      return []
    }
    return state.cards.data?.map(card => card.id)
  }, [state.cards.data?.length])

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
