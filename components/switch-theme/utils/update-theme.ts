import type {GlobalStore} from '@/common/global/global-store'
import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'

interface Props {
  theme: GlobalStore['state']['theme']
  opts: {
    supabase: SupabaseContext['supabase']
    session: SupabaseContext['session']
  }
}

export const updateTheme = async (props: Props): Promise<string> => {
  const {theme} = props
  const {supabase, session} = props.opts
  const {data} = await supabase
    .from('users')
    .update({theme})
    .eq('id', session?.user.id)
    .select()
    .single()

  return data?.theme || 'dark'
}
