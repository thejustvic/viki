import type {Database} from '@/utils/database.types'

export type Post = Database['public']['Tables']['posts']['Row']
export type User = Database['public']['Tables']['profiles']['Row']
