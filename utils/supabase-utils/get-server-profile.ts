import {Tables} from '@/utils/database.types'
import {createClient} from '@/utils/supabase-utils/supabase-server'
import type {User} from '@supabase/supabase-js'

export const getServerProfile = async (
  user: User | null
): Promise<Tables<'profiles'> | null> => {
  if (!user) {
    return null
  }
  const supabase = await createClient()
  const {data} = await supabase
    .from('profiles')
    .select()
    .eq('id', user.id)
    .maybeSingle()

  return data
}
