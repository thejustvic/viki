import {Card} from '@/components/cards/types'
import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'
import type {PostgrestBuilder} from '@supabase/postgrest-js'

export const getCardById = (
  cardId: Card['id'],
  supabase: SupabaseContext['supabase']
): PostgrestBuilder<Card | null> => {
  return supabase
    .from('cards')
    .select()
    .match({id: cardId})
    .throwOnError()
    .maybeSingle()
}
