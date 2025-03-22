import {useTeamStore} from '@/components/team/team-store'
import {useSupabaseFetch} from '@/hooks/use-supabase-fetch'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'
import type {PostgrestBuilder} from '@supabase/postgrest-js'
import {useCallback, useEffect} from 'react'
import {CardsStore, useCardsStore} from './cards-store'
import {getSearchCard} from './get-search-card'
import type {Card} from './types'

// Fetch cards for a given team
const getMyCards = (
  supabase: SupabaseContext['supabase'],
  currentTeamId: string
): PostgrestBuilder<Card[]> => {
  if (!currentTeamId) {
    throw new Error('Current team ID is required!')
  }

  return supabase.from('cards').select().eq('team_id', currentTeamId)
}

// Check if card exists in current team
export const useCheckCardExistInCurrentTeam = (): void => {
  const [teamState] = useTeamStore()
  const [cardState] = useCardsStore()
  const updateSearchParams = useUpdateSearchParams()
  const cardId = getSearchCard()

  const cardExists = useCallback(() => {
    const card = cardState.cards?.data?.find(p => p.id === cardId)
    return card ? card.team_id === teamState.currentTeamId : false
  }, [cardState.cards?.data, cardId, teamState.currentTeamId])

  useEffect(() => {
    if (cardState.cards?.data && !cardExists()) {
      updateSearchParams('card')
    }
  }, [cardExists, updateSearchParams])
}

// Reusable Supabase Listener Hook
const useSupabaseListener = (
  supabase: SupabaseContext['supabase'],
  currentTeamId: string | null,
  store: CardsStore
): void => {
  useEffect(() => {
    if (!currentTeamId) {
      return
    }

    const channel = supabase
      .channel('cards')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'cards',
          filter: `team_id=eq.${currentTeamId}`
        },
        payload => store.handleInsert(payload.new as Card)
      )
      .on(
        'postgres_changes',
        {event: 'DELETE', schema: 'public', table: 'cards'},
        payload => store.handleDelete(payload.old as Card)
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'cards',
          filter: `team_id=eq.${currentTeamId}`
        },
        payload => store.handleUpdate(payload.old as Card, payload.new as Card)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, store, currentTeamId])
}

// Fetch cards and listen for updates
export const useCardsListener = ({
  supabase,
  store,
  currentTeamId
}: {
  supabase: SupabaseContext['supabase']
  store: CardsStore
  currentTeamId: string | null
}): void => {
  const fetchCards = useCallback(() => {
    if (!currentTeamId) {
      return null
    }
    return getMyCards(supabase, currentTeamId)
  }, [currentTeamId, supabase])

  const {data, loading, error} = useSupabaseFetch(fetchCards, [currentTeamId])

  useEffect(() => {
    store.setCards({loading, data, error})
  }, [data, loading, error, store])

  useSupabaseListener(supabase, currentTeamId, store)
}
