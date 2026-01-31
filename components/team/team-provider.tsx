'use client'
import {useLocalObservable} from 'mobx-react-lite'
import {PropsWithChildren} from 'react'
import {TeamContext, TeamStore} from './team-store'

interface Props extends PropsWithChildren {
  currentTeamId: string | null
}

export default function TeamProvider({children, currentTeamId}: Props) {
  const store = useLocalObservable(() => new TeamStore(currentTeamId))

  return (
    <TeamContext.Provider value={store}>
      <>{children}</>
    </TeamContext.Provider>
  )
}
