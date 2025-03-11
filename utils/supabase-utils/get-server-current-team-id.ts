import type {User} from '@supabase/supabase-js'
import {createClient} from './supabase-server'

export const getServerCurrentTeamId = async (
  user: User | null
): Promise<string | null | undefined> => {
  if (!user) {
    return undefined
  }
  const supabase = await createClient()
  const {data} = await supabase
    .from('profiles')
    .select()
    .eq('id', user.id)
    .maybeSingle()

  return data?.current_team_id
}
