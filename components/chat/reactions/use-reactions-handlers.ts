import {ObjUtil} from '@/utils/obj-util'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {useChatHandlers} from '../chat-handlers'
import {Message, Reactions, Smiley} from '../types'

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
    const userIds = new Set(message.reactions[smiley])
    userIds.add(userId)

    const reactions: Reactions = {
      ...message.reactions,
      [smiley]: Array.from(userIds)
    }
    await updateMessageReactions(reactions, message.id)
  }

  const removeReaction: Handlers['removeReaction'] = async (
    smiley: Smiley,
    message: Message
  ) => {
    if (!user) {
      return
    }
    const userId = user.id
    const userIds = new Set(message.reactions[smiley])
    userIds.delete(userId)

    const reactions: Reactions = {
      ...message.reactions,
      [smiley]: Array.from(userIds)
    }
    const filteredReactions = ObjUtil.filter(
      reactions,
      (_smiley, userIds) => userIds?.length !== 0
    )
    const reactionsResult: Reactions = ObjUtil.isEmpty(filteredReactions)
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
    const userIds = new Set(message.reactions[smiley])
    const userId = user.id
    const reactionExist = userIds.has(userId)
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
