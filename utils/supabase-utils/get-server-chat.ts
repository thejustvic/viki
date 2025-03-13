import {Message, Reactions} from '@/components/chat/types'
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

  if (!data) {
    return null
  }

  const messages = data.map(msg => ({
    ...msg,
    reactions: msg.reactions as unknown as Reactions // Explicitly cast from Json to Reactions
  }))

  return messages
}
