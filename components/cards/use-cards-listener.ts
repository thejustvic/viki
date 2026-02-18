import {TeamStore, useTeamStore} from '@/components/team/team-store'
import {useSupabaseFetch} from '@/hooks/use-supabase-fetch'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'
import {useCallback, useEffect} from 'react'
import {CardsStore, useCardsStore} from './cards-store'
import {getSearchCard} from './get-search-card'
import type {Card} from './types'

// Fetch cards for a given team
const getMyCards = (
  supabase: SupabaseContext['supabase'],
  currentTeamId: string
) => {
  if (!currentTeamId) {
    throw new Error('Current team ID is required!')
  }

  return supabase
    .from('cards')
    .select()
    .eq('team_id', currentTeamId)
    .order('position', {ascending: true})
}

// Check if card exists in current team
export const useCheckCardExistInCurrentTeam = (): void => {
  const [teamState] = useTeamStore()
  const [cardState] = useCardsStore()
  const updateSearchParams = useUpdateSearchParams()
  const cardId = getSearchCard()

  const cardExists = useCallback(
    (cardId: string) => {
      const card = cardState.cards?.data?.find(p => p.id === cardId)
      return card?.team_id === teamState.currentTeamId
    },
    [cardState.cards?.data, cardId, teamState.currentTeamId]
  )

  useEffect(() => {
    if (cardId && cardState.cards?.data?.length && !cardExists(cardId)) {
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
      store.clear()
    }
  }, [currentTeamId])
}

// Fetch cards and listen for updates
export const useCardsListener = ({
  user,
  supabase,
  store,
  teamState
}: {
  user: SupabaseContext['user']
  supabase: SupabaseContext['supabase']
  store: CardsStore
  teamState: TeamStore['state']
}): void => {
  const currentTeamId = teamState.currentTeamId
  const fetchCards = useCallback(() => {
    if (!user) {
      return null
    }
    if (!currentTeamId) {
      return null
    }
    return getMyCards(supabase, currentTeamId)
  }, [currentTeamId])

  const {data, loading, error} = useSupabaseFetch(fetchCards, [currentTeamId])

  useEffect(() => {
    store.setCards({loading, data, error})
  }, [data, loading, error])

  useSupabaseListener(supabase, currentTeamId, store)
}
