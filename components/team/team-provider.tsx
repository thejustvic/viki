'use client'

import {useMemoOne} from '@/hooks/use-memo-one'
import {Tables} from '@/utils/database.types'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {PropsWithChildren, useEffect, useState} from 'react'
import {TeamContext, TeamStore} from './team-store'
import {useCurrentTeamListener} from './use-current-team-listener'
import {useMemberTeamsListener} from './use-member-teams-listener'
import {useMyTeamsListener} from './use-my-teams-listener'

interface Props extends PropsWithChildren {
  serverProfile: Tables<'profiles'> | null
}

export default function TeamProvider({children, serverProfile}: Props) {
  const [clientProfile, setClientProfile] = useState<Tables<'profiles'> | null>(
    null
  )
  const {user, supabase} = useSupabase()
  const store = useMemoOne(
    () =>
      new TeamStore(
        serverProfile?.current_team_id ?? clientProfile?.current_team_id
      ),
    [user]
  )

  useEffect(() => {
    if (!user) {
      return
    }
    if (serverProfile) {
      return
    }
    void (async (): Promise<void> => {
      const {data} = await supabase
        .from('profiles')
        .select()
        .eq('id', user.id)
        .maybeSingle()
      if (data) {
        setClientProfile(data)
      }
    })()
  }, [])

  useMemberTeamsListener(user, supabase, store)
  useMyTeamsListener(user, supabase, store)
  useCurrentTeamListener({
    user,
    supabase,
    store,
    teamId: serverProfile?.current_team_id ?? clientProfile?.current_team_id
  })

  return (
    <TeamContext.Provider value={store}>
      <>{children}</>
    </TeamContext.Provider>
  )
}
