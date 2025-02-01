import {User} from '@supabase/supabase-js'
import {createClient} from './supabase-server'

export const getServerUser = async (): Promise<User | null> => {
  const supabase = await createClient()

  const {
    data: {user}
  } = await supabase.auth.getUser()

  return user
}
