import {Message} from '@/components/chat/types'
import {createClient} from './supabase-server'

export const getServerChat = async (
  postId: string | undefined
): Promise<Message[] | null> => {
  if (!postId) {
    return []
  }
  const supabase = await createClient()
  const {data} = await supabase
    .from('messages')
    .select()
    .eq('post_id', postId)
    .order('created_at')

  return data
}
