import {Json} from '@/utils/database.types'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {Message, Reactions} from './types'

interface Handlers {
  removeMessage: (id: Message['id']) => Promise<void>
  insertMessage: ({
    cardId,
    text
  }: {
    cardId: Message['card_id']
    text: string
  }) => Promise<void>
  updateMessageText: (text: string, messageId: string) => Promise<void>
  updateMessageReactions: (
    reactions: Reactions,
    messageId: string
  ) => Promise<void>
}

export const useChatHandlers = (): Handlers => {
  const {supabase, user} = useSupabase()

  const removeMessage: Handlers['removeMessage'] = async id => {
    await supabase.from('messages').delete().eq('id', id)
  }

  const insertMessage: Handlers['insertMessage'] = async ({cardId, text}) => {
    if (!user) {
      throw Error('You must log in first!')
    }
    await supabase.from('messages').insert({
      author_id: user.id,
      card_id: cardId,
      author_email: user.email ?? '',
      author_image: user.user_metadata?.avatar_url ?? '',
      reactions: {},
      text
    })
  }

  const updateMessageText: Handlers['updateMessageText'] = async (
    text,
    messageId
  ) => {
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

  const updateMessageReactions: Handlers['updateMessageReactions'] = async (
    reactions,
    messageId
  ) => {
    if (!user) {
      throw Error('You must provide a user object!')
    }
    const reactionsAsJson = reactions as unknown as Json
    await supabase
      .from('messages')
      .update({
        reactions: reactionsAsJson
      })
      .eq('id', messageId)
  }

  return {
    removeMessage,
    insertMessage,
    updateMessageText,
    updateMessageReactions
  }
}
