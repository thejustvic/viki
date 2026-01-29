'use client'
import {Tables} from '@/utils/database.types'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {PropsWithChildren, useEffect, useMemo, useState} from 'react'
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

  const effectiveTeamId = useMemo(
    () =>
      serverProfile?.current_team_id ?? clientProfile?.current_team_id ?? null,
    [serverProfile?.current_team_id, clientProfile?.current_team_id]
  )

  const store = useMemo(() => new TeamStore(effectiveTeamId), [user])

  useEffect(() => {
    if (!user || serverProfile) {
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
  }, [user, serverProfile, supabase])

  useMemberTeamsListener(user, supabase, store)
  useMyTeamsListener(user, supabase, store)
  useCurrentTeamListener({
    user,
    supabase,
    store,
    teamId: effectiveTeamId
  })

  return (
    <TeamContext.Provider value={store}>
      <>{children}</>
    </TeamContext.Provider>
  )
}
