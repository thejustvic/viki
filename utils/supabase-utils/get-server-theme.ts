import type {Session} from '@supabase/auth-helpers-nextjs'
import {createClient} from './supabase-server'

export const getServerTheme = async (
  session: Session | null
): Promise<string | undefined> => {
  if (!session) {
    return undefined
  }
  const supabase = createClient()
  const {data} = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return data?.theme
}
