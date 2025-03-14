'use client'

import {Modal} from '@/components/common/modal'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {getSearchParam} from '@/utils/nextjs-utils/getSearchParam'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import {Team} from './team'
import {useTeamStore} from './team-store'
import {useCurrentTeamListener} from './use-current-team-listener'

export const ModalTeam = observer(() => {
  const {user, supabase} = useSupabase()
  const [state, store] = useTeamStore()

  useCurrentTeamListener({
    user,
    supabase,
    store,
    teamId: state.currentTeamId || ''
  })

  const updateSearchParams = useUpdateSearchParams()
  const goBack = () => {
    updateSearchParams('team')
  }

  return (
    <Modal
      id="modal-team"
      open={Boolean(getSearchParam('team'))}
      goBack={goBack}
      header={<TeamName />}
      body={<Team />}
    />
  )
})

const TeamName = observer(() => {
  const [state] = useTeamStore()
  const teamName = state.currentTeam.data?.name

  return <div className="flex justify-center mb-2">Team '{teamName}'</div>
})
