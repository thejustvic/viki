import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'

interface Props {
  currentTeamId: string
  opts: {
    supabase: SupabaseContext['supabase']
    user: SupabaseContext['user']
  }
}

export const updateCurrentTeamId = async (
  props: Props
): Promise<string | null> => {
  if (!props.opts.user) {
    return null
  }
  const {currentTeamId} = props
  const {supabase, user} = props.opts
  const {data} = await supabase
    .from('profiles')
    .update({current_team_id: currentTeamId})
    .eq('id', user.id)
    .select()
    .maybeSingle()

  return data?.current_team_id ?? null
}
