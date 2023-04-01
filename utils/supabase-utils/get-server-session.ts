import type {Session} from '@supabase/auth-helpers-nextjs'
import {createClient} from './supabase-server'

export const getServerSession = async (): Promise<Session | null> => {
  const supabase = createClient()

  const {
    data: {session}
  } = await supabase.auth.getSession()

  return session
}
