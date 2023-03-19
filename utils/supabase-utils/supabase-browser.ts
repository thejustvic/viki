import {Database} from '@/utils/database.types'
import {createBrowserSupabaseClient} from '@supabase/auth-helpers-nextjs'

export const createBrowserClient = () => createBrowserSupabaseClient<Database>()
