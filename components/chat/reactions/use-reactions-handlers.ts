import {ObjUtil} from '@/utils/obj-util'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {useChatHandlers} from '../chat-handlers'
import {Message, Reaction, Reactions, Smiley} from '../types'

interface Handlers {
  addReaction: (smiley: Smiley, message: Message) => Promise<void>
  removeReaction: (smiley: Smiley, message: Message) => Promise<void>
  selectReaction: (smiley: Smiley, message: Message) => Promise<void>
}

export const useReactionsHandlers = (): Handlers => {
  const {user} = useSupabase()
  const {updateMessageReactions} = useChatHandlers()

  const addReaction: Handlers['addReaction'] = async (
    smiley: Smiley,
    message: Message
  ) => {
    if (!user) {
      return
    }
    const userId = user.id
    const reaction: Reaction = {
      timestamp: Date.now(),
      smiley
    }
    const reactions: Reactions = {
      ...message.reactions,
      [userId]: message.reactions?.[userId]
        ? [...message.reactions[userId], reaction]
        : [reaction]
    }
    const reactionsResult = reactions

    await updateMessageReactions(reactionsResult, message.id)
  }

  const removeReaction: Handlers['removeReaction'] = async (
    smiley: Smiley,
    message: Message
  ) => {
    if (!user) {
      return
    }
    const userId = user.id
    const reactions: Reactions = {
      ...message.reactions,
      [userId]: message.reactions?.[userId].filter(
        reaction => reaction.smiley !== smiley
      )
    }
    const filteredReactions = ObjUtil.filter(
      reactions,
      (_userId, reactions) => reactions.length > 0
    )

    const reactionsResult = ObjUtil.isEmpty(filteredReactions)
      ? {}
      : (filteredReactions as Reactions)

    await updateMessageReactions(reactionsResult, message.id)
  }

  const selectReaction: Handlers['selectReaction'] = async (
    smiley: Smiley,
    message: Message
  ) => {
    if (!user) {
      return
    }
    const reactionExist = message.reactions?.[user.id]?.some(
      reaction => reaction.smiley === smiley
    )
    if (reactionExist) {
      await removeReaction(smiley, message)
    } else {
      await addReaction(smiley, message)
    }
  }

  return {
    addReaction,
    removeReaction,
    selectReaction
  }
}
