'use client'

import {useMemoOne} from '@/hooks/use-memo-one'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {ReactNode} from 'react'
import {TeamContext, TeamStore} from './team-store'
import {useMemberTeamsListener} from './use-member-teams-listener'
import {useMyTeamsListener} from './use-my-teams-listener'

interface Props {
  children: ReactNode
}

export default function TeamProvider({children}: Props) {
  const {user, supabase} = useSupabase()
  const store = useMemoOne(() => new TeamStore(), [user])

  useMyTeamsListener(user, supabase, store)
  useMemberTeamsListener(user, supabase, store)

  return (
    <TeamContext.Provider value={store}>
      <>{children}</>
    </TeamContext.Provider>
  )
}
