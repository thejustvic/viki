import {createServerComponentSupabaseClient} from '@supabase/auth-helpers-nextjs'
import {cookies, headers} from 'next/headers'

import type {Database} from '@/utils/database.types'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createClient = () =>
  createServerComponentSupabaseClient<Database>({
    headers,
    cookies
  })
