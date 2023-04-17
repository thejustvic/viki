import {createClient} from '@supabase/supabase-js'

import type {Database} from '@/utils/database.types'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createAdmin = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ?? ''
  )
