import {Card} from '@/components/cards/types'
import {useSupabaseFetch} from '@/hooks/use-supabase-fetch'
import {ObjUtil} from '@/utils/obj-util'
import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'
import type {PostgrestBuilder} from '@supabase/postgrest-js'
import {useCallback, useEffect} from 'react'
import {CardChecklistStore} from './card-checklist-store'
import {Checkbox} from './types'

const getChecklists = (
  cardIds: Card['id'][],
  supabase: SupabaseContext['supabase']
): PostgrestBuilder<Checkbox[]> => {
  return supabase
    .from('checklist')
    .select()
    .in('card_id', cardIds)
    .throwOnError()
}

const useSupabaseChecklistListener = (
  supabase: SupabaseContext['supabase'],
  cardIds: Card['id'][],
  store: CardChecklistStore
): void => {
  useEffect(() => {
    if (cardIds.length === 0) {
      return
    }
    const channel = supabase
      .channel('card-checklist')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'checklist'
        },
        payload =>
          store.handleInsert(
            payload.new.card_id as Checkbox['card_id'],
            payload.new as Checkbox
          )
      )
      .on(
        'postgres_changes',
        {event: 'DELETE', schema: 'public', table: 'checklist'},
        payload => store.handleDelete(payload.old as Checkbox)
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'checklist'
        },
        payload =>
          store.handleUpdate(
            payload.new.card_id as Checkbox['card_id'],
            payload.old as Checkbox,
            payload.new as Checkbox
          )
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, store, cardIds])
}

export const useCardChecklistListener = ({
  cardIds,
  supabase,
  store,
  user
}: {
  cardIds: Card['id'][]
  supabase: SupabaseContext['supabase']
  store: CardChecklistStore
  user: SupabaseContext['user']
}): void => {
  const fetchChecklists = useCallback(() => {
    if (!user) {
      return null
    }
    if (!cardIds || cardIds.length === 0) {
      return null
    }
    return getChecklists(cardIds, supabase)
  }, [cardIds])

  const {data, loading, error} = useSupabaseFetch(fetchChecklists, [cardIds])

  useEffect(() => {
    const checkboxes = ObjUtil.groupBy(data ?? [], 'card_id')

    // Convert Record<string, Checkbox[]> to Map<string, Checkbox[]>
    const checkboxesMap = new Map<string, Checkbox[]>(
      Object.entries(checkboxes)
    )
    store.setChecklists({loading, data: checkboxesMap, error})
  }, [data, loading, error, store])

  useSupabaseChecklistListener(supabase, cardIds, store)
}
