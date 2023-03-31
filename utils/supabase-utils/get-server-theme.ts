import type {Session} from '@supabase/auth-helpers-nextjs'
import {createClient} from './supabase-server'

export const getServerTheme = async (session: Session | null) => {
  if (!session) {
    return undefined
  }
  const supabase = createClient()
  const {data} = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return data?.theme
}
