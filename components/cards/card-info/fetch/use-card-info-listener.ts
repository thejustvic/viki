import {CardInfoStore} from '@/components/cards/card-info/card-info-store'
import {getCardById} from '@/components/cards/card-info/fetch/get-card-by-id'
import {Card, CardVisualType} from '@/components/cards/types'
import {GlobalStore} from '@/components/global-provider/global-store'
import {useFetch} from '@/hooks/use-fetch'
import {useSupabaseFetch} from '@/hooks/use-supabase-fetch'
import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'
import type {User} from '@supabase/supabase-js'
import {useCallback, useEffect} from 'react'

interface CardProps {
  cardId: Card['id'] | null
  supabase: SupabaseContext['supabase']
  store: CardInfoStore
  globalStore: GlobalStore
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
  }, [cardId])
}

export const useCardInfoListener = ({
  cardId,
  store,
  globalStore,
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

  const {data, error, loading} = useSupabaseFetch(fetchCardById, [cardId])

  const authorId = data?.author_id

  const {
    data: userData,
    error: userError,
    loading: userLoading
  } = useFetch<User>(
    authorId
      ? () =>
          fetch(`${window.location.origin}/api/retrieve-user?id=${authorId}`)
      : null,
    [authorId]
  )

  useEffect(() => {
    store.setCard({loading, data, error})

    if (loading) {
      store.setCardCreator({
        loading: true, // imitate for consistent ui
        data: null,
        error: null
      })
      store.setMy(undefined)
    } else {
      store.setCardCreator({
        loading: userLoading,
        data: userData,
        error: userError
      })

      if (user && authorId) {
        store.setMy(user.id === authorId)

        // set visual config
        globalStore.setSelectedVisualMode(
          (data?.selected_visual as CardVisualType[number]) ?? 'winter'
        )
      }
    }
  }, [loading, data, error, userLoading, userData, userError, authorId, user])

  useEffect(() => {
    return () => store.clear()
  }, [])

  useSupabaseListener(supabase, cardId, store)
}
