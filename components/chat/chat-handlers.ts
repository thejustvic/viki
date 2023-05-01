import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {Message} from './types'

interface Handlers {
  removeMessage: (id: Message['id']) => Promise<void>
  insertMessage: (text: string) => Promise<void>
  updateMessage: (text: string, messageId: string) => Promise<void>
}

export const useChatHandlers = (): Handlers => {
  const {supabase, session} = useSupabase()

  const removeMessage: Handlers['removeMessage'] = async id => {
    await supabase.from('chat').delete().eq('id', id)
  }

  const insertMessage: Handlers['insertMessage'] = async text => {
    if (!session) {
      throw Error('You must log in first!')
    }
    await supabase.from('chat').insert({
      author_email: session.user.email ?? '',
      author_image: session.user.user_metadata?.avatar_url ?? '',
      text
    })
  }

  const updateMessage: Handlers['updateMessage'] = async (text, messageId) => {
    if (!session) {
      throw Error('You must provide a session object!')
    }
    await supabase
      .from('chat')
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
