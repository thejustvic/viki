import {createMiddlewareSupabaseClient} from '@supabase/auth-helpers-nextjs'
import {NextResponse} from 'next/server'

import type {Database} from '@/utils/database.types'
import type {NextRequest} from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createMiddlewareSupabaseClient<Database>({req, res})

  const {
    data: {session}
  } = await supabase.auth.getSession()

  return res
}
