import type {GlobalStore} from '@/components/global/global-store'
import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'

interface Props {
  theme: GlobalStore['state']['theme']
  opts: {
    supabase: SupabaseContext['supabase']
    user: SupabaseContext['user']
  }
}

export const updateTheme = async (props: Props): Promise<string> => {
  const {theme} = props
  const {supabase, user} = props.opts
  const {data} = await supabase
    .from('profiles')
    .update({theme})
    .eq('id', user?.id || '')
    .select()
    .single()

  return data?.theme || 'dark'
}
