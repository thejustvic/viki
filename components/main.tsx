import 'server-only'

import {getServerSession} from '@/utils/supabase-utils/get-server-session'
import {Anonymous} from './anonymous'
import {Logged} from './logged'

export default async function Main() {
  const session = await getServerSession()

  return session ? <Logged /> : <Anonymous />
}
