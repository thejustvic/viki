import {Tables} from '@/utils/database.types'
import {User} from '@supabase/supabase-js'

export type Profile = Tables<'profiles'>

export type Message = Omit<Tables<'messages'>, 'reactions'> & {
  reactions: Reactions
}

export interface Reactions {
  [user_id: User['id']]: Reaction[]
}

export interface Reaction {
  smiley: Smiley
  timestamp: number
}

export type Smiley = (typeof smileys)[number]

export const smileys = [
  '👍',
  '👎',
  '😂',
  '😕',
  '😨',
  '❤️',
  '💀',
  '😈',
  '😇'
] as const

export interface UserWhoReacted {
  user_id: User['id']
  timestamp: number
}

export interface SmileyWithUserWhoReacted {
  smiley: Smiley
  usersWhoReacted: UserWhoReacted[]
}
