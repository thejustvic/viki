import type {Database} from '@/utils/database.types'

export type Theme = Database['public']['Tables']['profiles']['Row']['theme']

export type Tab = 'chat' | 'info' | 'empty'
