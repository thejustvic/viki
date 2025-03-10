import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'
import type {PostgrestBuilder} from '@supabase/postgrest-js'
import {Post} from '../../types'

export const getPostById = (
  postId: Post['id'],
  supabase: SupabaseContext['supabase']
): PostgrestBuilder<Post | null> => {
  return supabase
    .from('posts')
    .select()
    .match({id: postId})
    .throwOnError()
    .maybeSingle()
}
