import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {Message} from './types'

interface Handlers {
  removeMessage: (id: Message['id']) => Promise<void>
  insertMessage: ({
    postId,
    text
  }: {
    postId: Message['post_id']
    text: string
  }) => Promise<void>
  updateMessage: (text: string, messageId: string) => Promise<void>
}

export const useChatHandlers = (): Handlers => {
  const {supabase, user} = useSupabase()

  const removeMessage: Handlers['removeMessage'] = async id => {
    await supabase.from('messages').delete().eq('id', id)
  }

  const insertMessage: Handlers['insertMessage'] = async ({postId, text}) => {
    if (!user) {
      throw Error('You must log in first!')
    }
    await supabase.from('messages').insert({
      author_id: user.id,
      post_id: postId,
      author_email: user.email ?? '',
      author_image: user.user_metadata?.avatar_url ?? '',
      text
    })
  }

  const updateMessage: Handlers['updateMessage'] = async (text, messageId) => {
    if (!user) {
      throw Error('You must provide a user object!')
    }
    await supabase
      .from('messages')
      .update({
        text
      })
      .eq('id', messageId)
  }

  return {
    removeMessage,
    insertMessage,
    updateMessage
  }
}
