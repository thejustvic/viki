'use client'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {PropsWithChildren, useEffect, useState} from 'react'
import {TeamContext, TeamStore} from './team-store'
import {useCurrentTeamListener} from './use-current-team-listener'
import {useMemberTeamsListener} from './use-member-teams-listener'
import {useMyTeamsListener} from './use-my-teams-listener'

interface Props extends PropsWithChildren {
  currentTeamId: string | null
}

export default function TeamProvider({children, currentTeamId}: Props) {
  const {user, supabase} = useSupabase()

  const [store] = useState(() => new TeamStore())

  useEffect(() => {
    if (!user) {
      return
    }

    if (currentTeamId) {
      store.setCurrentTeamId(currentTeamId)
      return
    }

    void (async (): Promise<void> => {
      const {data} = await supabase
        .from('profiles')
        .select()
        .eq('id', user.id)
        .maybeSingle()
      if (data?.current_team_id) {
        store.setCurrentTeamId(data.current_team_id)
      }
    })()
  }, [currentTeamId])

  useMemberTeamsListener(user, supabase, store)
  useMyTeamsListener(user, supabase, store)
  useCurrentTeamListener({
    user,
    supabase,
    store,
    teamId: store.state.currentTeamId
  })

  return (
    <TeamContext.Provider value={store}>
      <>{children}</>
    </TeamContext.Provider>
  )
}
