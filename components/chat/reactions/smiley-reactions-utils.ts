import {ObjUtil} from '@/utils/obj-util'
import {
  Message,
  Smiley,
  smileys,
  SmileyWithUserWhoReacted,
  UserWhoReacted
} from '../types'

const getUsersWhoReact = (
  smiley: Smiley,
  message: Message
): UserWhoReacted[] => {
  const usersWhoReact: UserWhoReacted[] = []
  ObjUtil.forEach(message.reactions, (user_id, userSmileys) => {
    const reaction = userSmileys.find(reaction => reaction.smiley === smiley)
    if (reaction) {
      usersWhoReact.push({
        user_id: String(user_id),
        timestamp: reaction.timestamp
      })
    }
  })

  return usersWhoReact
}

export const getReactions = (message: Message): SmileyWithUserWhoReacted[] => {
  const reactions: SmileyWithUserWhoReacted[] = []
  smileys.forEach(smiley => {
    reactions.push({
      smiley,
      usersWhoReacted: getUsersWhoReact(smiley, message)
    })
  })

  return reactions
    .filter(reaction => reaction.usersWhoReacted.length > 0)
    .sort((a, b) => b.usersWhoReacted.length - a.usersWhoReacted.length)
}
