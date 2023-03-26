import {Anonymous} from '@/components/anonymous'
import {Logged} from '@/components/logged'
import {getServerSession} from '@/utils/supabase-utils/get-server-session'

export default async function Page() {
  const session = await getServerSession()
  return session ? <Logged /> : <Anonymous />
}
