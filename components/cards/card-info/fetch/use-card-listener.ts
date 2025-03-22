import {useCardInfoStore} from '@/components/cards/card-info/card-info-store'
import {getCardById} from '@/components/cards/card-info/fetch/get-card-by-id'
import {Card} from '@/components/cards/types'
import {useFetch} from '@/hooks/use-fetch'
import {useSupabaseFetch} from '@/hooks/use-supabase-fetch'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import type {User} from '@supabase/supabase-js'
import {useEffect} from 'react'

interface CardProps {
  cardId: Card['id'] | null
  authorId: Card['author_id'] | undefined
}

export const useCardListener = ({cardId, authorId}: CardProps): void => {
  const [, store] = useCardInfoStore()
  const {supabase} = useSupabase()

  const {data, error, loading} = useSupabaseFetch(
    cardId ? () => getCardById(cardId, supabase) : null,
    [cardId]
  )

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
    store.setCard({
      loading,
      data,
      error
    })
  }, [data, loading, error])

  useEffect(() => {
    store.setCardCreator({
      loading: userLoading,
      data: userData,
      error: userError
    })
  }, [userData, userError, userLoading])
}
