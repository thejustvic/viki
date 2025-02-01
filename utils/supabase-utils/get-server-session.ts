import {Session} from '@supabase/supabase-js'
import {createClient} from './supabase-server'

export const getServerSession = async (): Promise<Session | null> => {
  const supabase = await createClient()

  const {
    data: {session}
  } = await supabase.auth.getSession()

  return session
}
