import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {TeamMember} from './types'

interface Handlers {
  removeTeamMember: (id: TeamMember['id']) => Promise<void>
  insertTeamMember: ({
    team_id,
    data
  }: {
    team_id: TeamMember['team_id']
    data: {
      name: string
      email: string
      role: string
      status: string
    }
  }) => Promise<void>
  updateTeamMember: (
    data: {name?: string; role?: string; email?: string; status?: string},
    teamMemberId: TeamMember['id']
  ) => Promise<void>
}

export const useTeamHandlers = (): Handlers => {
  const {supabase, user} = useSupabase()

  const removeTeamMember: Handlers['removeTeamMember'] = async id => {
    await supabase.from('team_members').delete().eq('id', id)
  }

  const insertTeamMember: Handlers['insertTeamMember'] = async ({
    team_id,
    data
  }) => {
    if (!user) {
      throw Error('You must log in first!')
    }
    await supabase.from('team_members').insert({
      team_id: team_id,
      ...data
    })
  }

  const updateTeamMember: Handlers['updateTeamMember'] = async (
    data,
    teamMemberId
  ) => {
    if (!user) {
      throw Error('You must provide a user object!')
    }
    await supabase
      .from('team_members')
      .update({
        ...data
      })
      .eq('id', teamMemberId)
  }

  return {
    removeTeamMember,
    insertTeamMember,
    updateTeamMember
  }
}
