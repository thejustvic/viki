import type {GlobalStore} from '@/common/global/global-store'
import {MaybeSession} from '@/utils/supabase-utils/supabase-provider'
import type {SupabaseClient} from '@supabase/auth-helpers-nextjs'

export const updateTheme = async (
  theme: GlobalStore['state']['theme'],
  opts: {
    supabase: SupabaseClient
    session: MaybeSession
  }
) => {
  const {supabase, session} = opts
  const {data} = await supabase
    .from('users')
    .update({theme})
    .eq('id', session?.user.id)
    .select()

  const themeRes = data?.[0]?.theme || 'dark'
  return themeRes
}
