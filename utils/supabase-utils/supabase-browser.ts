import {Database} from '@/utils/database.types'
import {createBrowserSupabaseClient} from '@supabase/auth-helpers-nextjs'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createBrowserClient = () => createBrowserSupabaseClient<Database>()
