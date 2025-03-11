import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {Team} from './types'

interface Handlers {
  removeTeam: (id: Team['id']) => Promise<void>
  insertTeam: ({
    owner_id,
    data
  }: {
    owner_id: Team['owner_id']
    data: {
      name: string
    }
  }) => Promise<void>
  updateTeam: (data: {name?: string}, teamId: Team['id']) => Promise<void>
}

export const useTeamHandlers = (): Handlers => {
  const {supabase, user} = useSupabase()

  const removeTeam: Handlers['removeTeam'] = async id => {
    await supabase.from('teams').delete().eq('id', id)
  }

  const insertTeam: Handlers['insertTeam'] = async ({owner_id, data}) => {
    if (!user) {
      throw Error('You must log in first!')
    }
    await supabase.from('teams').insert({
      owner_id,
      ...data
    })
  }

  const updateTeam: Handlers['updateTeam'] = async (data, teamId) => {
    if (!user) {
      throw Error('You must provide a user object!')
    }
    await supabase
      .from('teams')
      .update({
        ...data
      })
      .eq('id', teamId)
  }

  return {
    removeTeam,
    insertTeam,
    updateTeam
  }
}
