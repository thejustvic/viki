import type {User} from '@supabase/supabase-js'
import {createClient} from './supabase-server'

export const getServerTheme = async (
  user: User | null
): Promise<string | undefined> => {
  if (!user) {
    return undefined
  }
  const supabase = await createClient()
  const {data} = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return data?.theme
}
