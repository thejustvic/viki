import type {Tables} from '@/utils/database.types'

export type Theme = Tables<'profiles'>['theme']

export type Tab = 'checklist' | 'info' | 'chat' | 'visual'

export type AuthView = 'register' | 'login'

export type AuthTabGroup = 'authProviders' | 'anonymously' | 'email'
