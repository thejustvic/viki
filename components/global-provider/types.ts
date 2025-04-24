import type {Tables} from '@/utils/database.types'

export type Theme = Tables<'profiles'>['theme']

export type Tab = 'checklist' | 'info' | 'chat' | 'visual'
