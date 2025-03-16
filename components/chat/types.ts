import {Tables} from '@/utils/database.types'
import {User} from '@supabase/supabase-js'

export type Profile = Tables<'profiles'>

export type Message = Omit<Tables<'messages'>, 'reactions'> & {
  reactions: Reactions
}

export type Reactions = {
  [smiley in Smiley]?: User['id'][]
}

export const smileys = [
  '\uD83D\uDC4D', //👍
  '\uD83D\uDC4E', //👎
  '\uD83D\uDE02', //😂
  '\uD83D\uDE15', //😕
  '\uD83D\uDE28', //😨
  '\u2764\uFE0F', //❤️
  '\uD83D\uDC80', //💀
  '\uD83D\uDE08', //😈
  '\uD83D\uDE07' //😇
] as const

export type Smiley = (typeof smileys)[number]
