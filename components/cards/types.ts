import type {Tables} from '@/utils/database.types'

export type Card = Tables<'cards'>
export type Profile = Tables<'profiles'>
export type Message = Tables<'messages'>

export type CardBgImages = ['none', 'cyborg', 'matrix', 'cyberpunk']

export type CardVisualType = ['winter', 'spring', 'summer']

export type PlayerSizeType = ['human', 'bunny']

export type GameModeType = ['none', 'egg-collecting']
