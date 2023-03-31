import type {GlobalStore} from '@/common/global/global-store'
import {Theme} from '@/common/global/types'
import {MaybeSession} from '@/utils/supabase-utils/supabase-provider'
import type {SupabaseClient} from '@supabase/auth-helpers-nextjs'

type ThemeResponse = Awaited<ReturnType<typeof update>>
type ThemeResponseSuccess = ThemeResponse['data'] & {
  theme: Theme
}

interface Props {
  theme: GlobalStore['state']['theme']
  opts: {
    supabase: SupabaseClient
    session: MaybeSession
  }
}

const update = async (props: Props) => {
  const {theme} = props
  const {supabase, session} = props.opts
  return await supabase
    .from('users')
    .update({theme})
    .eq('id', session?.user.id)
    .select()
    .single()
}

export const updateTheme = async (props: Props) => {
  const res: ThemeResponse = await update(props)
  const data = res.data as ThemeResponseSuccess

  return data?.theme || 'dark'
}
