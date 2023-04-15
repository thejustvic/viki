import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'
import type {PostgrestBuilder} from '@supabase/postgrest-js'
import {Post, User} from '../../types'

export const getPostCreatorById = (
  userId: Post['by'],
  supabase: SupabaseContext['supabase']
): PostgrestBuilder<User> => {
  return supabase
    .from('users')
    .select()
    .match({id: userId})
    .throwOnError()
    .single()
}
