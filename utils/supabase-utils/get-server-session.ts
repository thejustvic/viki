import {createClient} from './supabase-server'

export const getServerSession = async () => {
  const supabase = createClient()

  const {
    data: {session}
  } = await supabase.auth.getSession()

  return session
}
