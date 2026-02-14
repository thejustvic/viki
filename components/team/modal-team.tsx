'use client'

import {Modal} from '@/components/common/modal'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {getSearchParam} from '@/utils/nextjs-utils/getSearchParam'
import {observer} from 'mobx-react-lite'
import {useCallback} from 'react'
import {Team} from './team'
import {useTeamStore} from './team-store'

export const ModalTeam = observer(() => {
  const updateSearchParams = useUpdateSearchParams()
  const team = getSearchParam('team')

  const goBack = useCallback(() => {
    if (team) {
      updateSearchParams('team')
    }
  }, [team, updateSearchParams])

  return (
    <Modal
      id="modal-team"
      open={Boolean(team)}
      goBack={goBack}
      header={<TeamName />}
      body={<Team />}
    />
  )
})

const TeamName = observer(() => {
  const [state] = useTeamStore()
  const teamName = state.currentTeam.data?.name

  return (
    <div className="flex justify-center mb-2">
      members of the "{teamName}" team
    </div>
  )
})
