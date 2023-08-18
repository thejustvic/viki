import type {Database} from '@/utils/database.types'

export type Theme = Database['public']['Tables']['users']['Row']['theme']

export type Tab = 'chat' | 'info'
