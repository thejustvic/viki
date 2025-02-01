import {Message} from '@/components/chat/types'
import {createClient} from './supabase-server'

export const getServerChat = async (): Promise<Message[] | null> => {
  const supabase = await createClient()
  const {data} = await supabase.from('chat').select('*')

  return data
}
