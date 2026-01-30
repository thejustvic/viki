import {CardInfoStore} from '@/components/cards/card-info/card-info-store'
import {getCardById} from '@/components/cards/card-info/fetch/get-card-by-id'
import {Card} from '@/components/cards/types'
import {useFetch} from '@/hooks/use-fetch'
import {useSupabaseFetch} from '@/hooks/use-supabase-fetch'
import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'
import type {User} from '@supabase/supabase-js'
import {useCallback, useEffect} from 'react'

interface CardProps {
  cardId: Card['id'] | null
  authorId: Card['author_id'] | undefined
  supabase: SupabaseContext['supabase']
  store: CardInfoStore
  user: SupabaseContext['user']
}

const useSupabaseListener = (
  supabase: SupabaseContext['supabase'],
  cardId: string | null,
  store: CardInfoStore
): void => {
  useEffect(() => {
    if (!cardId) {
      return
    }

    const channel = supabase
      .channel('selected-card')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'cards',
          filter: `id=eq.${cardId}`
        },
        payload => {
          store.setCard({
            loading: false,
            data: payload.new as Card,
            error: null
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      store.clear()
    }
  }, [supabase, store, cardId])
}

export const useCardInfoListener = ({
  cardId,
  authorId,
  store,
  supabase,
  user
}: CardProps): void => {
  const fetchCardById = useCallback(() => {
    if (!user) {
      return null
    }
    if (!cardId) {
      return null
    }
    return getCardById(cardId, supabase)
  }, [cardId])

  const {data, error, loading} = useSupabaseFetch(fetchCardById, [
    cardId,
    store,
    user,
    supabase
  ])

  const {
    data: userData,
    error: userError,
    loading: userLoading
  } = useFetch<User>(
    authorId
      ? () =>
          fetch(`${window.location.origin}/api/retrieve-user?id=${authorId}`)
      : null,
    [authorId, store, user, supabase]
  )

  useEffect(() => {
    store.setCard({
      loading,
      data,
      error
    })
    store.setCardCreator({
      loading: userLoading,
      data: userData,
      error: userError
    })
  }, [
    userData,
    userError,
    userLoading,
    data,
    loading,
    error,
    store,
    user,
    supabase
  ])

  useSupabaseListener(supabase, cardId, store)
}
